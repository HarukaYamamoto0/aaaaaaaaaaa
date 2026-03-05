// noinspection JSUnusedGlobalSymbols

import type { Device, InEndpoint, Interface } from 'usb';
import * as usb from 'usb';
import { ControlTransferError, DeviceError, DriverError, InterfaceError, TimeoutError } from '../errors.js';
import { CustomMacroBuilder, type CustomMacroBuilderOptions, MacroMode } from '../protocols/CustomMacroBuilder.js';
import { DpiBuilder } from '../protocols/DpiBuilder.js';
import { InternalStateResetReportBuilder } from '../protocols/InternalStateResetReportBuilder.js';
import { type MacroBuilderOptions, MacrosBuilder } from '../protocols/MacrosBuilder.js';
import { PollingRateBuilder, type Rate } from '../protocols/PollingRateBuilder.js';
import { UserPreferencesBuilder, type UserPreferencesBuilderOptions } from '../protocols/UserPreferencesBuilder.js';
import {
	Button,
	ConnectionMode,
	type ControlTransferIn,
	type ControlTransferOptions,
	type ControlTransferOut,
	type Logger,
} from '../types.js';
import { bufferStartsWith } from '../utils/bufferUtils.js';
import { delay } from '../utils/delay.js';
import { ConsoleLogger } from '../logger/index.js';

const VID = 0x1d57;
const DEVICE_INTERFACE = 0x02;
const INTERRUPT_ENDPOINT = 0x83;

class AttackSharkX11 {
	public readonly productId: number;
	device: Device;
	deviceInterface!: Interface;
	interruptEndpoint!: InEndpoint;
	private isOpen: boolean = false;
	private lastBattery: number = -1;
	private logger: Logger;

	constructor(options: { connectionMode: ConnectionMode; logger?: Logger }) {
		if (!options.connectionMode) {
			throw new DriverError('The type of connection was not specified');
		}

		this.logger = options.logger ?? new ConsoleLogger();

		const device = usb
			.getDeviceList()
			.find(
				(d) => d.deviceDescriptor.idVendor === VID && d.deviceDescriptor.idProduct === options.connectionMode,
			);

		if (!device) {
			throw new DeviceError(`Device with idProduct ${options.connectionMode} not found`);
		}

		this.device = device;
		this.productId = device.deviceDescriptor.idProduct;
	}

	/**
	 * Returns to the current connection mode.
	 */
	get connectionMode(): ConnectionMode {
		return this.productId as ConnectionMode;
	}

	open(): Promise<unknown> {
		return new Promise((resolve, reject) => {
			try {
				this.device.open();
			} catch (e: unknown) {
				reject(
					new DeviceError(`An unexpected error occurred while trying to open device ${this.connectionMode}`, {
						cause: e,
					}),
				);
			}

			const iface = this.device.interface(DEVICE_INTERFACE);

			if (!iface) {
				reject(new InterfaceError(`interface ${DEVICE_INTERFACE} not found`, DEVICE_INTERFACE));
			}

			this.deviceInterface = iface;

			// Once everything is complete, this Windows verification should be removed.
			if (process.platform !== 'win32') {
				if (iface.isKernelDriverActive()) {
					try {
						iface.detachKernelDriver();
					} catch (e: unknown) {
						reject(new DriverError('Could not detach kernel driver: ', { cause: e }));
					}
				}
			}

			try {
				iface.claim();
			} catch (e: unknown) {
				this.logger.error('An unexpected error occurred', e);

				// Once everything is complete, this Windows verification should be removed.
				if (process.platform === 'win32') {
					reject(
						new InterfaceError(
							`Could not claim interface ${DEVICE_INTERFACE}. On Windows, you might need to use Zadig to install WinUSB driver for Interface ${DEVICE_INTERFACE}.`,
							DEVICE_INTERFACE,
						),
					);
				}
				throw e;
			}

			const interruptEndpoint = iface.endpoints.find((e) => e.address === INTERRUPT_ENDPOINT);

			if (!interruptEndpoint) {
				reject(new InterfaceError(`interruptEndpoint ${INTERRUPT_ENDPOINT} not found`, INTERRUPT_ENDPOINT));
			}

			this.interruptEndpoint = interruptEndpoint as InEndpoint;
			this.isOpen = true;
			resolve(true);
		});
	}

	async close(): Promise<void> {
		if (!this.isOpen) return;

		if (!this.deviceInterface) {
			this.device?.close();
			return;
		}

		await new Promise<void>((resolve, reject) => {
			this.deviceInterface.release(true, (err) => {
				if (err) {
					reject(new InterfaceError('Error releasing interface', this.deviceInterface.interfaceNumber));
					return;
				}

				resolve();
			});
		});

		this.device?.close();
		this.isOpen = false;
	}

	checkIsOpen(): void {
		if (!this.isOpen) throw new DriverError('You have to open the device first');
	}

	controlTransfer(options: ControlTransferIn): Promise<Buffer>;
	controlTransfer(options: ControlTransferOut): Promise<number>;
	controlTransfer(options: ControlTransferOptions): Promise<number | Buffer> {
		this.checkIsOpen();

		return new Promise((resolve, reject) => {
			this.device.controlTransfer(
				options.bmRequestType,
				options.bRequest,
				options.wValue,
				options.wIndex,
				options.data,
				(err, result) => {
					if (err) {
						reject(new ControlTransferError('Control transfer failed', { cause: err }));
						return;
					}

					if (result === undefined) {
						reject(new ControlTransferError('Control transfer returned undefined'));
						return;
					}

					resolve(result);
				},
			);
		});
	}

	getBatteryLevel(timeoutMs = 1000): Promise<number> {
		this.checkIsOpen();

		return new Promise((resolve, reject) => {
			if (this.connectionMode === ConnectionMode.Wired) {
				resolve(-1); // -1 indicates that it was not possible to get the exact battery status value
			}

			const endpoint = this.interruptEndpoint as InEndpoint;
			let finished = false;

			const cleanup = (): void => {
				if (finished) return;
				finished = true;

				clearTimeout(timeout);
				endpoint.off('data', handleData);

				try {
					endpoint.stopPoll();
				} catch {
					/* empty */
				}
			};

			const handleData = (data: Buffer): void => {
				if (finished) return;
				if (data.length < 5) return;

				if (bufferStartsWith(data, Buffer.from([0x03, 0x55, 0x40, 0x01]))) {
					const battery = data[4];

					if (battery === undefined) return;

					if (battery <= 100) {
						cleanup();
						resolve(battery);
					}
				}
			};

			const timeout = setTimeout(() => {
				cleanup();
				reject(new TimeoutError('Timeout waiting for battery report'));
			}, timeoutMs);

			endpoint.on('data', handleData);

			try {
				endpoint.startPoll(1, 64);
			} catch (err) {
				cleanup();
				reject(err);
			}
		});
	}

	onBatteryChange(listener: (battery: number) => void): () => void {
		this.checkIsOpen();

		const endpoint = this.interruptEndpoint as InEndpoint;

		const handleData = (data: Buffer): void => {
			if (!bufferStartsWith(data, Buffer.from([0x03, 0x55, 0x40, 0x01]))) {
				return;
			}

			if (data.length < 5) return;

			const battery = data[4];
			if (battery === undefined) return;

			if (battery !== this.lastBattery) {
				this.lastBattery = battery;
				listener(battery);
			}
		};

		endpoint.on('data', handleData);
		endpoint.startPoll(1, 64);

		return () => {
			endpoint.removeListener('data', handleData);

			try {
				endpoint.stopPoll();
			} catch {
				/* empty */
			}
		};
	}

	setPollingRate(rate: Rate | PollingRateBuilder): Promise<number> {
		this.checkIsOpen();
		const builder = rate instanceof PollingRateBuilder ? rate : new PollingRateBuilder().setRate(rate);

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	async setCustomMacro(options: CustomMacroBuilder | CustomMacroBuilderOptions): Promise<void> {
		this.checkIsOpen();
		const builder = options instanceof CustomMacroBuilder ? options : new CustomMacroBuilder(options);
		const [setMacroBuffer, secondPacket, thirdPacket, fourthPacket] = builder.build(this.connectionMode);

		await this.controlTransfer({
			data: setMacroBuffer,
			bmRequestType: 0x21,
			bRequest: 0x09,
			wValue: 0x0308,
			wIndex: 2,
		});
		await delay(250);

		await this.controlTransfer({
			data: secondPacket,
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
		await delay(500);

		await this.controlTransfer({
			data: thirdPacket,
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
		await delay(500);

		await this.controlTransfer({
			data: fourthPacket,
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	setMacro(config: MacroBuilderOptions | MacrosBuilder): Promise<number> {
		this.checkIsOpen();
		const builder = config instanceof MacrosBuilder ? config : new MacrosBuilder(config);

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	setUserPreferences(options: UserPreferencesBuilder | UserPreferencesBuilderOptions): Promise<number> {
		this.checkIsOpen();
		const builder = options instanceof UserPreferencesBuilder ? options : new UserPreferencesBuilder(options);

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	sendInternalStateResetReportBuilder(): Promise<number> {
		this.checkIsOpen();
		const builder = new InternalStateResetReportBuilder();

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	resetPollingRate(): Promise<number> {
		this.checkIsOpen();
		const builder = new PollingRateBuilder();

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	setDpi(builder: DpiBuilder): Promise<number> {
		this.checkIsOpen();
		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	resetDpi(): Promise<number> {
		this.checkIsOpen();
		const builder = new DpiBuilder();

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	resetMacro(): Promise<number> {
		this.checkIsOpen();
		const builder = new MacrosBuilder();

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	async resetCustomMacro(): Promise<void> {
		this.checkIsOpen();
		const builder = new CustomMacroBuilder({
			playOptions: {
				mode: MacroMode.THE_NUMBER_OF_TIME_TO_PLAY,
				times: 1,
			},
			targetButton: Button.BACKWARD,
			macroEvents: [],
		});

		await this.setCustomMacro(builder);
	}

	resetUserPreferences(): Promise<number> {
		this.checkIsOpen();
		const builder = new UserPreferencesBuilder().setKeyResponse(8);

		return this.controlTransfer({
			data: builder.build(this.connectionMode),
			bmRequestType: builder.bmRequestType,
			bRequest: builder.bRequest,
			wValue: builder.wValue,
			wIndex: builder.wIndex,
		});
	}

	async reset(): Promise<void> {
		this.checkIsOpen();
		await this.sendInternalStateResetReportBuilder();
		await delay(250);
		await this.resetDpi();
		await delay(250);
		await this.resetUserPreferences();
		await delay(250);
		await this.resetPollingRate();
		await delay(250);
		await this.resetMacro();
		await delay(250);
		await this.resetCustomMacro();
	}
}

export default AttackSharkX11;
