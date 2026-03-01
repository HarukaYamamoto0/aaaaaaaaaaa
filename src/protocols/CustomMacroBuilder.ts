import type {BaseProtocolBuilder} from "../core/BaseProtocolBuilder.js";
import type {ConnectionMode} from "../types.js";
import {
    Buttons, KeyCode,
    MacroName,
    MacrosBuilder,
    macroTemplates,
    type MacroTuple
} from "./MacrosBuilder.js";

export enum CUSTOM_MACRO_BUTTONS {
    LEFT_BUTTON = 0x01,
    RIGHT_BUTTON = 0x02,
    MIDDLE_BUTTON = 0x03,
    EXTRA_BUTTON_4 = 0x07,
    EXTRA_BUTTON_5 = 0x08,
}

export enum MacroSettings {
    THE_NUMBER_OF_TIME_TO_PLAY = 0x00,
    ANY_KEY_PRESS_TO_STOP_PLAYING = 0x01,
    PRESS_AND_HOLD_RELEASE_STOP = 0x02
}

export class CustomMacroBuilder implements BaseProtocolBuilder {
    readonly buffer: Buffer = Buffer.alloc(0);
    public readonly bmRequestType: number = 0x21;
    public readonly bRequest: number = 0x09;
    public readonly wValue: number = 0x0304;
    public readonly wIndex: number = 2;

    private defineMacroButton: MacrosBuilder
    private readonly secondPacket: Buffer = Buffer.alloc(64)
    private readonly thirdPacket: Buffer = Buffer.alloc(64)
    private readonly fourthPacket: Buffer = Buffer.alloc(64)

    // noinspection FunctionTooLongJS
    constructor() {
        this.defineMacroButton = new MacrosBuilder()

        this.secondPacket[0] = 0x09 // Header
        this.secondPacket[1] = 0x40 // Header
        this.secondPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
        this.secondPacket[3] = 0x00 // Page 0
        this.secondPacket[4] = MacroSettings.THE_NUMBER_OF_TIME_TO_PLAY
        this.secondPacket[5] = 0x00
        this.secondPacket[6] = 0x00
        this.secondPacket[7] = 0x00
        this.secondPacket[8] = 0xFF // referring to THE_NUMBER_OF_TIME_TO_PLAY, which indicates how many times it will repeat the macro.
        this.secondPacket[9] = 0x00
        this.secondPacket[10] = 0x00
        this.secondPacket[11] = 0x00
        this.secondPacket[12] = 0x00
        this.secondPacket[13] = 0x00
        this.secondPacket[14] = 0x00
        this.secondPacket[15] = 0x00

        this.secondPacket[16] = 0x00
        this.secondPacket[17] = 0x00
        this.secondPacket[18] = 0x00
        this.secondPacket[19] = 0x00
        this.secondPacket[20] = 0x00
        this.secondPacket[21] = 0x00
        this.secondPacket[22] = 0x00
        this.secondPacket[23] = 0x00
        this.secondPacket[24] = 0x00
        this.secondPacket[25] = 0x00
        this.secondPacket[26] = 0x00
        this.secondPacket[27] = 0x00
        this.secondPacket[28] = 0x00
        this.secondPacket[29] = 0x02 // event counter

        this.secondPacket[30] = 0x01 // pressed event + delay // reserved for macro events
        this.secondPacket[31] = KeyCode.A // reserved for macro events
        this.secondPacket[32] = 0x81 // release event + delay // reserved for macro events
        this.secondPacket[33] = KeyCode.A // reserved for macro events

        this.secondPacket[34] = 0x00 // reserved for macro events
        this.secondPacket[35] = 0x00 // reserved for macro events
        this.secondPacket[36] = 0x00 // reserved for macro events
        this.secondPacket[37] = 0x00 // reserved for macro events
        this.secondPacket[38] = 0x00 // reserved for macro events
        this.secondPacket[39] = 0x00 // reserved for macro events
        this.secondPacket[40] = 0x00 // reserved for macro events
        this.secondPacket[41] = 0x00 // reserved for macro events
        this.secondPacket[42] = 0x00 // reserved for macro events
        this.secondPacket[43] = 0x00 // reserved for macro events
        this.secondPacket[44] = 0x00 // reserved for macro events
        this.secondPacket[45] = 0x00 // reserved for macro events
        this.secondPacket[46] = 0x00 // reserved for macro events
        this.secondPacket[47] = 0x00 // reserved for macro events
        this.secondPacket[48] = 0x00 // reserved for macro events
        this.secondPacket[49] = 0x00 // reserved for macro events
        this.secondPacket[50] = 0x00 // reserved for macro events
        this.secondPacket[51] = 0x00 // reserved for macro events
        this.secondPacket[52] = 0x00 // reserved for macro events
        this.secondPacket[53] = 0x00 // reserved for macro events
        this.secondPacket[54] = 0x00 // reserved for macro events
        this.secondPacket[55] = 0x00 // reserved for macro events
        this.secondPacket[56] = 0x00 // reserved for macro events
        this.secondPacket[57] = 0x00 // reserved for macro events
        this.secondPacket[58] = 0x00 // reserved for macro events
        this.secondPacket[59] = 0x00 // reserved for macro events
        this.secondPacket[60] = 0x00 // reserved for macro events
        this.secondPacket[61] = 0x00 // reserved for macro events
        this.secondPacket[62] = 0x00 // reserved for macro events
        this.secondPacket[63] = 0x00 // reserved for macro events

        // Third Packet

        this.thirdPacket[0] = 0x09 // Header
        this.thirdPacket[1] = 0x40 // Header
        this.thirdPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
        this.thirdPacket[3] = 0x01 // Page 1
        this.thirdPacket[4] = 0x00 // reserved for macro events
        this.thirdPacket[5] = 0x00 // reserved for macro events
        this.thirdPacket[6] = 0x00 // reserved for macro events
        this.thirdPacket[7] = 0x00 // reserved for macro events
        this.thirdPacket[8] = 0x00 // reserved for macro events
        this.thirdPacket[9] = 0x00 // reserved for macro events
        this.thirdPacket[10] = 0x00 // reserved for macro events
        this.thirdPacket[11] = 0x00 // reserved for macro events
        this.thirdPacket[12] = 0x00 // reserved for macro events
        this.thirdPacket[13] = 0x00 // reserved for macro events
        this.thirdPacket[14] = 0x00 // reserved for macro events
        this.thirdPacket[15] = 0x00 // reserved for macro events
        this.thirdPacket[16] = 0x00 // reserved for macro events
        this.thirdPacket[17] = 0x00 // reserved for macro events
        this.thirdPacket[18] = 0x00 // reserved for macro events
        this.thirdPacket[19] = 0x00 // reserved for macro events
        this.thirdPacket[20] = 0x00 // reserved for macro events
        this.thirdPacket[21] = 0x00 // reserved for macro events
        this.thirdPacket[22] = 0x00 // reserved for macro events
        this.thirdPacket[23] = 0x00 // reserved for macro events
        this.thirdPacket[24] = 0x00 // reserved for macro events
        this.thirdPacket[25] = 0x00 // reserved for macro events
        this.thirdPacket[26] = 0x00 // reserved for macro events
        this.thirdPacket[27] = 0x00 // reserved for macro events
        this.thirdPacket[28] = 0x00 // reserved for macro events
        this.thirdPacket[29] = 0x00 // reserved for macro events
        this.thirdPacket[30] = 0x00 // reserved for macro events
        this.thirdPacket[31] = 0x00 // reserved for macro events
        this.thirdPacket[32] = 0x00 // reserved for macro events
        this.thirdPacket[33] = 0x00 // reserved for macro events
        this.thirdPacket[34] = 0x00 // reserved for macro events
        this.thirdPacket[35] = 0x00 // reserved for macro events
        this.thirdPacket[36] = 0x00 // reserved for macro events
        this.thirdPacket[37] = 0x00 // reserved for macro events
        this.thirdPacket[38] = 0x00 // reserved for macro events
        this.thirdPacket[39] = 0x00 // reserved for macro events
        this.thirdPacket[40] = 0x00 // reserved for macro events
        this.thirdPacket[41] = 0x00 // reserved for macro events
        this.thirdPacket[42] = 0x00 // reserved for macro events
        this.thirdPacket[43] = 0x00 // reserved for macro events
        this.thirdPacket[44] = 0x00 // reserved for macro events
        this.thirdPacket[45] = 0x00 // reserved for macro events
        this.thirdPacket[46] = 0x00 // reserved for macro events
        this.thirdPacket[47] = 0x00 // reserved for macro events
        this.thirdPacket[48] = 0x00 // reserved for macro events
        this.thirdPacket[49] = 0x00 // reserved for macro events
        this.thirdPacket[50] = 0x00 // reserved for macro events
        this.thirdPacket[51] = 0x00 // reserved for macro events
        this.thirdPacket[52] = 0x00 // reserved for macro events
        this.thirdPacket[53] = 0x00 // reserved for macro events
        this.thirdPacket[54] = 0x00 // reserved for macro events
        this.thirdPacket[55] = 0x00 // reserved for macro events
        this.thirdPacket[56] = 0x00 // reserved for macro events
        this.thirdPacket[57] = 0x00 // reserved for macro events
        this.thirdPacket[58] = 0x00 // reserved for macro events
        this.thirdPacket[59] = 0x00 // reserved for macro events
        this.thirdPacket[60] = 0x00 // reserved for macro events
        this.thirdPacket[61] = 0x00 // reserved for macro events
        this.thirdPacket[62] = 0x00 // reserved for macro events
        this.thirdPacket[63] = 0x00 // reserved for macro events

        // Fourth Packet

        this.fourthPacket[0] = 0x09 // Header
        this.fourthPacket[1] = 0x0C // Header
        this.fourthPacket[2] = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
        this.fourthPacket[3] = 0x02 // Page 2
        this.fourthPacket[4] = 0x00
        this.fourthPacket[5] = 0x00
        this.fourthPacket[6] = 0x00
        this.fourthPacket[7] = 0x00
        this.fourthPacket[8] = 0x00
        this.fourthPacket[9] = 0x00
        this.fourthPacket[10] = 0x00 // Big Endian Checksum
        this.fourthPacket[11] = 0x00 // Big Endian Checksum
        this.fourthPacket[12] = 0x00
        this.fourthPacket[13] = 0x00
        this.fourthPacket[14] = 0x00
        this.fourthPacket[15] = 0x00
        this.fourthPacket[16] = 0x00
        this.fourthPacket[17] = 0x00
        this.fourthPacket[18] = 0x00
        this.fourthPacket[19] = 0x00
        this.fourthPacket[20] = 0x00
        this.fourthPacket[21] = 0x00
        this.fourthPacket[22] = 0x00
        this.fourthPacket[23] = 0x00
        this.fourthPacket[24] = 0x00
        this.fourthPacket[25] = 0x00
        this.fourthPacket[26] = 0x00
        this.fourthPacket[27] = 0x00
        this.fourthPacket[28] = 0x00
        this.fourthPacket[29] = 0x00
        this.fourthPacket[30] = 0x00
        this.fourthPacket[31] = 0x00
        this.fourthPacket[32] = 0x00
        this.fourthPacket[33] = 0x00
        this.fourthPacket[34] = 0x00
        this.fourthPacket[35] = 0x00
        this.fourthPacket[36] = 0x00
        this.fourthPacket[37] = 0x00
        this.fourthPacket[38] = 0x00
        this.fourthPacket[39] = 0x00
        this.fourthPacket[40] = 0x00
        this.fourthPacket[41] = 0x00
        this.fourthPacket[42] = 0x00
        this.fourthPacket[43] = 0x00
        this.fourthPacket[44] = 0x00
        this.fourthPacket[45] = 0x00
        this.fourthPacket[46] = 0x00
        this.fourthPacket[47] = 0x00
        this.fourthPacket[48] = 0x00
        this.fourthPacket[49] = 0x00
        this.fourthPacket[50] = 0x00
        this.fourthPacket[51] = 0x00
        this.fourthPacket[52] = 0x00
        this.fourthPacket[53] = 0x00
        this.fourthPacket[54] = 0x00
        this.fourthPacket[55] = 0x00
        this.fourthPacket[56] = 0x00
        this.fourthPacket[57] = 0x00
        this.fourthPacket[58] = 0x00
        this.fourthPacket[59] = 0x00
        this.fourthPacket[60] = 0x00
        this.fourthPacket[61] = 0x00
        this.fourthPacket[62] = 0x00
        this.fourthPacket[63] = 0x00
    }

    setMacroButton(button: Buttons) {
        let buttonMap: CUSTOM_MACRO_BUTTONS
        let macroTemplate: MacroTuple

        switch (button) {
            case Buttons.LEFT_BUTTON:
                buttonMap = CUSTOM_MACRO_BUTTONS.LEFT_BUTTON
                macroTemplate = macroTemplates[MacroName.CUSTOM_MACRO_LEFT_BUTTON]
                break
            case Buttons.RIGHT_BUTTON:
                buttonMap = CUSTOM_MACRO_BUTTONS.RIGHT_BUTTON
                macroTemplate = macroTemplates[MacroName.CUSTOM_MACRO_RIGHT_BUTTON]
                break
            case Buttons.MIDDLE_BUTTON:
                buttonMap = CUSTOM_MACRO_BUTTONS.MIDDLE_BUTTON
                macroTemplate = macroTemplates[MacroName.CUSTOM_MACRO_MIDDLE_BUTTON]
                break
            case Buttons.EXTRA_BUTTON_4:
                buttonMap = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_4
                macroTemplate = macroTemplates[MacroName.CUSTOM_MACRO_EXTRA_BUTTON_4]
                break
            case Buttons.EXTRA_BUTTON_5:
                buttonMap = CUSTOM_MACRO_BUTTONS.EXTRA_BUTTON_5
                macroTemplate = macroTemplates[MacroName.CUSTOM_MACRO_EXTRA_BUTTON_5]
                break
            default:
                throw new Error("Unsupported button")
        }

        this.defineMacroButton.setMacro(button, macroTemplate)

        this.secondPacket[2] = buttonMap
        this.thirdPacket[2] = buttonMap
        this.fourthPacket[2] = buttonMap

        return this
    }

    calculateChecksum(): number {
        let sum = 0

        for (let i = 8; i < this.secondPacket.length; i++) {
            sum += this.secondPacket[i]!
        }

        for (let i = 4; i < this.thirdPacket.length; i++) {
            sum += this.thirdPacket[i]!
        }
        return sum
    }

    build(mode: ConnectionMode): Buffer[] {
        const checksum = this.calculateChecksum()

        this.fourthPacket[10] = (checksum >> 8) & 0xff
        this.fourthPacket[11] = checksum & 0xff

        return [this.defineMacroButton.build(mode), this.secondPacket, this.thirdPacket, this.fourthPacket]
    }

    toString(): string {
        return this.buffer.toString("hex")
    }

    compareWitHexString(value: string): boolean {
        return this.toString() == value
    }
}