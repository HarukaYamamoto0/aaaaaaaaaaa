// noinspection ES6RedundantAwait,ES6UnusedImports

import {
    AttackSharkX11,
    KeyCode,
    CustomMacroBuilder,
    Buttons,
    MouseMacroEvent
} from "./src/index.js";

const driver = new AttackSharkX11()

try {
    const customMacro = new CustomMacroBuilder()
        .setMacroButton(Buttons.EXTRA_BUTTON_5)
        .addKeyPress(KeyCode.A)
        .addKeyRelease(KeyCode.A)
        .addMousePress(MouseMacroEvent.LEFT_CLICK)
        .addMouseRelease(MouseMacroEvent.LEFT_CLICK)
        .addKeyPress(KeyCode.B, 5000)
        .addKeyRelease(KeyCode.B, 10)

    await driver.setCustomMacro(customMacro)
} finally {
    driver.close()
}

