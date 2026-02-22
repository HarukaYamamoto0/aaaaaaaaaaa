import {AttackSharkX11, LightMode, PollingRate} from "./src/index.js";
import {FirmwareAction, KeyCode, MacroTemplate, Modifiers} from "./src/protocols/MacrosBuilder.js";
import {delay} from "./src/utils/delay.js";

const driver = new AttackSharkX11()

try {
    await driver.reset()
    await delay(500)

    await driver.setPollingRate(PollingRate.eSports)
    await delay(500)

    await driver.setUserPreferences({
        lightMode: LightMode.Static,
        rgb: {r: 0, g: 255, b: 0},
        ledSpeed: 5,
        sleepTime: 0.5,
        deepSleepTime: 10,
        keyResponse: 8
    })
    await delay(500)

    await driver.setMacro({
        left: MacroTemplate["global-left-click"],
        right: MacroTemplate["global-right-click"],
        middle: MacroTemplate["global-middle"],
        extra4: MacroTemplate["global-forward"],
        extra5: [FirmwareAction.KEYBOARD, Modifiers.ALT, KeyCode.TAB] as const
    })
} finally {
    driver.close()
}