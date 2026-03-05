import {
	AttackSharkX11,
	Button,
	ConnectionMode,
	CustomMacroBuilder,
	DpiBuilder,
	delay,
	KeyCode,
	LightMode,
	MacroMode,
	MacroName,
	MacrosBuilder,
	macroTemplates,
	PollingRateBuilder,
	Rate,
} from './src/index.js';
import { logger } from './src/logger/index.js';

const driver = new AttackSharkX11(ConnectionMode.Adapter);
const delayMS = 250;

try {
	await driver.open();
	await driver.reset();
	await delay(delayMS);

	const macroBuilder = new MacrosBuilder().setMacro(Button.DPI, macroTemplates[MacroName.SHORTCUT_SWAP_WINDOW]);

	await driver.setMacro(macroBuilder);
	await delay(delayMS);

	const dpiBuilder = new DpiBuilder({
		dpiValues: [800, 1600, 2400, 3400, 5000, 22000],
		activeStage: 2,
	});
	await driver.setDpi(dpiBuilder);
	await delay(delayMS);

	const pollingRateBuilder = new PollingRateBuilder().setRate(Rate.eSports);

	await driver.setPollingRate(pollingRateBuilder);
	await delay(delayMS);

	await driver.setUserPreferences({
		lightMode: LightMode.Neon,
		ledSpeed: 5,
		keyResponse: 4,
	});
	await delay(delayMS);

	await driver.setCustomMacro(
		new CustomMacroBuilder()
			.setPlayOptions(MacroMode.THE_NUMBER_OF_TIME_TO_PLAY, 9)
			.setTargetButton(Button.BACKWARD, macroBuilder) // Here I pass the macroBuilder so as not to overwrite it
			.addEvent(KeyCode.A)
			.addEvent(KeyCode.A, 10, true),
	);
	await delay(delayMS);

	const key = 0xff;

	await driver.setCustomMacro({
		macroEvents: [0x01, key, 0x81, key],
		targetButton: Button.BACKWARD,
		macrosBuilder: macroBuilder,
	});

	const batteryStatus = await driver.getBatteryLevel();
	logger.info(`${batteryStatus}%`);

	driver.onBatteryChange((level: number) => {
		logger.info(`${level}%`);
	});

	await delay(10000);
} finally {
	await driver.close();
}
