// noinspection SpellCheckingInspection

import {AttackSharkX11} from "./src/index.js";
import {DpiBuilder} from "./src/index.js";
import {StageIndex} from "./src/protocols/DpiBuilder.js";

const driver = new AttackSharkX11()

try {
    const dpiBuilder = new DpiBuilder()
        .setCurrentStage(StageIndex.SECOND)

    await driver.setDpi(dpiBuilder)
} finally {
    driver.close()
}