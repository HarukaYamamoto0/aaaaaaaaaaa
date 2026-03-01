// noinspection ES6RedundantAwait,ES6UnusedImports

import {AttackSharkX11, ConnectionMode, MacroName, MacrosBuilder, macroTemplates} from "./src/index.js";
import {diffStrings} from "./src/utils/diffStrings.js";
import {delay} from "./src/utils/delay.js";

const driver = new AttackSharkX11()

enum CUSTOM_MACRO_BUTTONS {
    LEFT_BUTTON = 0x01,
    RIGHT_BUTTON = 0x02,
    MIDDLE_BUTTON = 0x03,
    EXTRA_BUTTON_4 = 0x07,
    EXTRA_BUTTON_5 = 0x08,
}

enum MacroSettings {
    THE_NUMBER_OF_TIME_TO_PLAY = 0x00,
    ANY_KEY_PRESS_TO_STOP_PLAYING = 0x01,
    PRESS_AND_HOLD_RELEASE_STOP = 0x02
}

try {
    const setMacroBuffer = new MacrosBuilder({
        extra5: macroTemplates[MacroName.CUSTOM_MACRO_EXTRA_BUTTON_5]
    })

    const secondPacket = Buffer.alloc(64)
    secondPacket[0] = 0x09 // Header
    secondPacket[1] = 0x40 // Header
    secondPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
    secondPacket[3] = 0x00
    secondPacket[4] = MacroSettings.THE_NUMBER_OF_TIME_TO_PLAY
    secondPacket[5] = 0x00
    secondPacket[6] = 0x00
    secondPacket[7] = 0x00
    secondPacket[8] = 0x09 // referring to THE_NUMBER_OF_TIME_TO_PLAY, which indicates how many times it will repeat the macro.
    secondPacket[9] = 0x00
    secondPacket[10] = 0x00
    secondPacket[11] = 0x00
    secondPacket[12] = 0x00
    secondPacket[13] = 0x00
    secondPacket[14] = 0x00
    secondPacket[15] = 0x00

    secondPacket[16] = 0x00
    secondPacket[17] = 0x00
    secondPacket[18] = 0x00
    secondPacket[19] = 0x00
    secondPacket[20] = 0x00
    secondPacket[21] = 0x00
    secondPacket[22] = 0x00
    secondPacket[23] = 0x00
    secondPacket[24] = 0x00
    secondPacket[25] = 0x00
    secondPacket[26] = 0x00
    secondPacket[27] = 0x00
    secondPacket[28] = 0x00
    secondPacket[29] = 0x02

    secondPacket[30] = 0x01
    secondPacket[31] = 0x04
    secondPacket[32] = 0x81
    secondPacket[33] = 0x04

    secondPacket[34] = 0x00
    secondPacket[35] = 0x00
    secondPacket[36] = 0x00
    secondPacket[37] = 0x00
    secondPacket[38] = 0x00
    secondPacket[39] = 0x00
    secondPacket[40] = 0x00
    secondPacket[41] = 0x00
    secondPacket[42] = 0x00
    secondPacket[43] = 0x00
    secondPacket[44] = 0x00
    secondPacket[45] = 0x00
    secondPacket[46] = 0x00
    secondPacket[47] = 0x00
    secondPacket[48] = 0x00
    secondPacket[49] = 0x00
    secondPacket[50] = 0x00
    secondPacket[51] = 0x00
    secondPacket[52] = 0x00
    secondPacket[53] = 0x00
    secondPacket[54] = 0x00
    secondPacket[55] = 0x00
    secondPacket[56] = 0x00
    secondPacket[57] = 0x00
    secondPacket[58] = 0x00
    secondPacket[59] = 0x00
    secondPacket[60] = 0x00
    secondPacket[61] = 0x00
    secondPacket[62] = 0x00
    secondPacket[63] = 0x00

    const thirdPacket = Buffer.alloc(64)

    thirdPacket[0] = 0x09
    thirdPacket[1] = 0x40
    thirdPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
    thirdPacket[3] = 0x01
    thirdPacket[4] = 0x00
    thirdPacket[5] = 0x00
    thirdPacket[6] = 0x00
    thirdPacket[7] = 0x00
    thirdPacket[8] = 0x00
    thirdPacket[9] = 0x00
    thirdPacket[10] = 0x00
    thirdPacket[11] = 0x00
    thirdPacket[12] = 0x00
    thirdPacket[13] = 0x00
    thirdPacket[14] = 0x00
    thirdPacket[15] = 0x00
    thirdPacket[16] = 0x00
    thirdPacket[17] = 0x00
    thirdPacket[18] = 0x00
    thirdPacket[19] = 0x00
    thirdPacket[20] = 0x00
    thirdPacket[21] = 0x00
    thirdPacket[22] = 0x00
    thirdPacket[23] = 0x00
    thirdPacket[24] = 0x00
    thirdPacket[25] = 0x00
    thirdPacket[26] = 0x00
    thirdPacket[27] = 0x00
    thirdPacket[28] = 0x00
    thirdPacket[29] = 0x00
    thirdPacket[30] = 0x00
    thirdPacket[31] = 0x00
    thirdPacket[32] = 0x00
    thirdPacket[33] = 0x00
    thirdPacket[34] = 0x00
    thirdPacket[35] = 0x00
    thirdPacket[36] = 0x00
    thirdPacket[37] = 0x00
    thirdPacket[38] = 0x00
    thirdPacket[39] = 0x00
    thirdPacket[40] = 0x00
    thirdPacket[41] = 0x00
    thirdPacket[42] = 0x00
    thirdPacket[43] = 0x00
    thirdPacket[44] = 0x00
    thirdPacket[45] = 0x00
    thirdPacket[46] = 0x00
    thirdPacket[47] = 0x00
    thirdPacket[48] = 0x00
    thirdPacket[49] = 0x00
    thirdPacket[50] = 0x00
    thirdPacket[51] = 0x00
    thirdPacket[52] = 0x00
    thirdPacket[53] = 0x00
    thirdPacket[54] = 0x00
    thirdPacket[55] = 0x00
    thirdPacket[56] = 0x00
    thirdPacket[57] = 0x00
    thirdPacket[58] = 0x00
    thirdPacket[59] = 0x00
    thirdPacket[60] = 0x00
    thirdPacket[61] = 0x00
    thirdPacket[62] = 0x00
    thirdPacket[63] = 0x00

    const fourthPacket = Buffer.alloc(64)

    fourthPacket[0] = 0x09
    fourthPacket[1] = 0x0C
    fourthPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
    fourthPacket[3] = 0x02
    fourthPacket[4] = 0x00
    fourthPacket[5] = 0x00
    fourthPacket[6] = 0x00
    fourthPacket[7] = 0x00
    fourthPacket[8] = 0x00
    fourthPacket[9] = 0x00
    fourthPacket[10] = 0x00
    fourthPacket[11] = 0x00 // checksum
    fourthPacket[12] = 0x00
    fourthPacket[13] = 0x00
    fourthPacket[14] = 0x00
    fourthPacket[15] = 0x00
    fourthPacket[16] = 0x00
    fourthPacket[17] = 0x00
    fourthPacket[18] = 0x00
    fourthPacket[19] = 0x00
    fourthPacket[20] = 0x00
    fourthPacket[21] = 0x00
    fourthPacket[22] = 0x00
    fourthPacket[23] = 0x00
    fourthPacket[24] = 0x00
    fourthPacket[25] = 0x00
    fourthPacket[26] = 0x00
    fourthPacket[27] = 0x00
    fourthPacket[28] = 0x00
    fourthPacket[29] = 0x00
    fourthPacket[30] = 0x00
    fourthPacket[31] = 0x00
    fourthPacket[32] = 0x00
    fourthPacket[33] = 0x00
    fourthPacket[34] = 0x00
    fourthPacket[35] = 0x00
    fourthPacket[36] = 0x00
    fourthPacket[37] = 0x00
    fourthPacket[38] = 0x00
    fourthPacket[39] = 0x00
    fourthPacket[40] = 0x00
    fourthPacket[41] = 0x00
    fourthPacket[42] = 0x00
    fourthPacket[43] = 0x00
    fourthPacket[44] = 0x00
    fourthPacket[45] = 0x00
    fourthPacket[46] = 0x00
    fourthPacket[47] = 0x00
    fourthPacket[48] = 0x00
    fourthPacket[49] = 0x00
    fourthPacket[50] = 0x00
    fourthPacket[51] = 0x00
    fourthPacket[52] = 0x00
    fourthPacket[53] = 0x00
    fourthPacket[54] = 0x00
    fourthPacket[55] = 0x00
    fourthPacket[56] = 0x00
    fourthPacket[57] = 0x00
    fourthPacket[58] = 0x00
    fourthPacket[59] = 0x00
    fourthPacket[60] = 0x00
    fourthPacket[61] = 0x00
    fourthPacket[62] = 0x00
    fourthPacket[63] = 0x00

    let sum = 0

    for (let i = 8; i < secondPacket.length; i++) {
        sum += secondPacket[i]!
    }

    for (let i = 4; i < thirdPacket.length; i++) {
        sum += thirdPacket[i]!
    }

    fourthPacket[10] = (sum >> 8) & 0xff
    fourthPacket[11] = sum & 0xff

    await delay(500)
    await driver.commandTransfer(
        setMacroBuffer.build(ConnectionMode.Adapter),
        setMacroBuffer.bmRequestType,
        setMacroBuffer.bRequest,
        setMacroBuffer.wValue,
        setMacroBuffer.wIndex,
    )
    await delay(500)

    await driver.commandTransfer(
        secondPacket,
        0x21,
        0x09,
        0x0309,
        2,
    )
    await delay(500)

    await driver.commandTransfer(
        thirdPacket,
        0x21,
        0x09,
        0x0309,
        2,
    )
    await delay(500)

    await driver.commandTransfer(
        fourthPacket,
        0x21,
        0x09,
        0x0309,
        2,
    )
    await delay(500)

    diffStrings(setMacroBuffer.toString(), "083b010200000300000400000100000100000d00000600001200080100000100000100000100000100000100000100000100000900000a00000053")
    diffStrings(secondPacket.toString("hex"), "09400800000000000100000000000000000000000000000000000000000201048104000000000000000000000000000000000000000000000000000000000000")
    diffStrings(thirdPacket.toString("hex"), "09400801000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
    diffStrings(fourthPacket.toString("hex"), "090c0802000000000000008d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")

} finally {
    driver.close()
}

