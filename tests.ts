import {AttackSharkX11} from "./src/index.js";
import {Buttons, MacroName} from "./src/protocols/MacrosBuilder.js";

const driver = new AttackSharkX11()

try {
    await driver.setMacro(Buttons.BUTTON_5, MacroName.SHORTCUT_SWAP_WINDOW)
} finally {
    driver.close()
}