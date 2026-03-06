export class DriverError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = new.target.name;
	}
}

/**
 * An error is thrown when the provided parameters are invalid or missing
 */
export class ParamsError extends DriverError {
	constructor(
		public paramName: string,
		message?: string,
		options?: { cause?: unknown },
	) {
		super(message ?? `The parameter ${paramName} is missing or is not of the desired type.`, options);
	}
}

/**
 * Generic error related to the USB device
 */
export class DeviceError extends DriverError {}

/**
 * This error is thrown when there is a failure to access or claim a USB interface
 */
export class InterfaceError extends DriverError {
	constructor(
		message: string,
		public interfaceNumber: number,
		options?: { cause?: unknown },
	) {
		super(message, options);
	}
}

/**
 * Basic error causing data transfer failures
 */
export class TransferError extends DriverError {
	constructor(
		message: string,
		public endpoint?: number,
		options?: { cause?: unknown },
	) {
		super(message, options);
	}
}

/**
 * Specific error related to Control Transfers (USB) failures
 */
export class ControlTransferError extends TransferError {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, undefined, options);
	}
}

/**
 * An error is thrown when an operation exceeds the expected timeout
 */
export class TimeoutError extends DriverError {}
