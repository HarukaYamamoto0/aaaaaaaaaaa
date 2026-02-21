import {AttackSharkX11} from "./src/index.js";
import {Buttons, FirmwareAction, KeyCode, MacroTemplate, Modifiers} from "./src/protocols/MacrosBuilder.js";

const driver = new AttackSharkX11()

try {
    await driver.setMacro({
        type: "raw",
        value: {
            button: Buttons.BUTTON_5,
            firmwareAction: FirmwareAction.KEYBOARD,
            modifier: Modifiers.CTRL,
            keyCode: KeyCode.V
        }
    })
    await driver.setMacro({
        type: "template",
        value: MacroTemplate["shortcut-swap-window"]
    }, Buttons.BUTTON_4)
} finally {
    driver.close()
}