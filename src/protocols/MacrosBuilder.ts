import {ConnectionMode, type ProtocolBuilder} from "../types.js";

export type MacroCode = readonly [number, number, number]

export enum MacroName {
    // Global
    GLOBAL_DISABLE_BUTTON = "global-disable-button",
    GLOBAL_LEFT_CLICK = "global-left-click",
    GLOBAL_RIGHT_CLICK = "global-right-click",
    GLOBAL_MIDDLE = "global-middle",
    GLOBAL_BACKWARD = "global-backward",
    GLOBAL_FORWARD = "global-forward",
    GLOBAL_DOUBLE_CLICK = "global-double-click",
    GLOBAL_FIRE_BUTTON = "global-fire-button",
    GLOBAL_SCROLL_UP = "global-scroll-up",
    GLOBAL_SCROLL_DOWN = "global-scroll-down",
    GLOBAL_EASY_AIM = "global-easy-aim",
    GLOBAL_DPI_CYCLE = "global-dpi-cycle",
    GLOBAL_DPI_PLUS = "global-dpi-+",
    GLOBAL_DPI_MINUS = "global-dpi--",

    // Multimedia
    MULTIMEDIA_MEDIA_PLAYER = "multimedia-media-player",
    MULTIMEDIA_PLAY_PAUSE = "multimedia-play-pause",
    MULTIMEDIA_STOP_MUSIC = "multimedia-stop-music",
    MULTIMEDIA_PREVIOUS_TRACK = "multimedia-previous-track",
    MULTIMEDIA_NEXT_TRACK = "multimedia-next-track",
    MULTIMEDIA_VOLUME_PLUS = "multimedia-volume-+",
    MULTIMEDIA_VOLUME_MINUS = "multimedia-volume--",
    MULTIMEDIA_MUTE = "multimedia-mute",

    // Browser
    BROWSER_HOME = "browser-home",
    BROWSER_FAVORITES = "browser-favorites",
    BROWSER_FORWARD = "browser-forward",
    BROWSER_BACKWARD = "browser-backward",
    BROWSER_STOP = "browser-stop",
    BROWSER_REFRESH = "browser-refresh",
    BROWSER_SEARCH = "browser-search",
    BROWSER_EMAIL = "browser-email",
    BROWSER_CALCULATOR = "browser-calculator",
    BROWSER_MY_COMPUTER = "browser-my-computer",

    // Shortcuts
    SHORTCUT_CUT = "shortcut-cut",
    SHORTCUT_COPY = "shortcut-copy",
    SHORTCUT_PASTE = "shortcut-paste",
    SHORTCUT_OPEN = "shortcut-open",
    SHORTCUT_SAVE = "shortcut-save",
    SHORTCUT_FIND = "shortcut-find",
    SHORTCUT_REDO = "shortcut-redo",
    SHORTCUT_SELECT_ALL = "shortcut-select-all",
    SHORTCUT_PRINT = "shortcut-print",
    SHORTCUT_CLOSE_WINDOW = "shortcut-close-window",
    SHORTCUT_SWAP_WINDOW = "shortcut-swap-window",
    SHORTCUT_SHOW_DESKTOP = "shortcut-show-desktop",
    SHORTCUT_RUN_COMMAND = "shortcut-run-command",
    SHORTCUT_LOCK_PC = "shortcut-lock-pc",
    SHORTCUT_SCREEN_CAPTURE = "shortcut-screen-capture",
}

// @ts-ignore
export const Macros: Record<MacroName, MacroCode> = {
    [MacroName.GLOBAL_DISABLE_BUTTON]: [0x01, 0x00, 0x00],
    [MacroName.GLOBAL_LEFT_CLICK]: [0x02, 0x00, 0x00],
    [MacroName.GLOBAL_RIGHT_CLICK]: [0x03, 0x00, 0x00],
    [MacroName.GLOBAL_MIDDLE]: [0x04, 0x00, 0x00],
    [MacroName.GLOBAL_BACKWARD]: [0x05, 0x00, 0x00],
    [MacroName.GLOBAL_FORWARD]: [0x06, 0x00, 0x00],
    [MacroName.GLOBAL_DOUBLE_CLICK]: [0x07, 0x00, 0x00],
    [MacroName.GLOBAL_FIRE_BUTTON]: [0x08, 0x00, 0x00],
    [MacroName.GLOBAL_SCROLL_UP]: [0x09, 0x00, 0x00],
    [MacroName.GLOBAL_EASY_AIM]: [0x10, 0x00, 0x00],
    [MacroName.GLOBAL_SCROLL_DOWN]: [0x0A, 0x00, 0x00],
    [MacroName.GLOBAL_DPI_CYCLE]: [0x0D, 0x00, 0x00],
    [MacroName.GLOBAL_DPI_PLUS]: [0x0E, 0x00, 0x00],
    [MacroName.GLOBAL_DPI_MINUS]: [0x0F, 0x00, 0x00],

    // Multimedia
    [MacroName.MULTIMEDIA_MEDIA_PLAYER]: [0x15, 0x00, 0x00],
    [MacroName.MULTIMEDIA_PLAY_PAUSE]: [0x18, 0x00, 0x00],
    [MacroName.MULTIMEDIA_STOP_MUSIC]: [0x19, 0x00, 0x00],
    [MacroName.MULTIMEDIA_PREVIOUS_TRACK]: [0x16, 0x00, 0x00],
    [MacroName.MULTIMEDIA_NEXT_TRACK]: [0x17, 0x00, 0x00],
    [MacroName.MULTIMEDIA_VOLUME_PLUS]: [0x1B, 0x00, 0x00],
    [MacroName.MULTIMEDIA_VOLUME_MINUS]: [0x1C, 0x00, 0x00],
    [MacroName.MULTIMEDIA_MUTE]: [0x1A, 0x00, 0x00],

    // Browser
    [MacroName.BROWSER_HOME]: [0x25, 0x00, 0x00],
    [MacroName.BROWSER_FAVORITES]: [0x11, 0x00, 0x00],
    [MacroName.BROWSER_FORWARD]: [0x20, 0x00, 0x00],
    [MacroName.BROWSER_BACKWARD]: [0x21, 0x00, 0x00],
    [MacroName.BROWSER_STOP]: [0x22, 0x00, 0x00],
    [MacroName.BROWSER_REFRESH]: [0x24, 0x00, 0x00],
    [MacroName.BROWSER_SEARCH]: [0x26, 0x00, 0x00],
    [MacroName.BROWSER_EMAIL]: [0x1E, 0x00, 0x00],
    [MacroName.BROWSER_CALCULATOR]: [0x1D, 0x00, 0x00],
    [MacroName.BROWSER_MY_COMPUTER]: [0x23, 0x00, 0x00],

    // Shortcuts
    [MacroName.SHORTCUT_CUT]: [0x11, 0x01, 0x1B],
    [MacroName.SHORTCUT_COPY]: [0x11, 0x01, 0x06],
    [MacroName.SHORTCUT_PASTE]: [0x11, 0x01, 0x19],
    [MacroName.SHORTCUT_OPEN]: [0x11, 0x01, 0x12],
    [MacroName.SHORTCUT_SAVE]: [0x11, 0x01, 0x16],
    [MacroName.SHORTCUT_FIND]: [0x11, 0x01, 0x09],
    [MacroName.SHORTCUT_REDO]: [0x11, 0x01, 0x1C],
    [MacroName.SHORTCUT_SELECT_ALL]: [0x11, 0x01, 0x04],
    [MacroName.SHORTCUT_PRINT]: [0x11, 0x01, 0x13],
    [MacroName.SHORTCUT_CLOSE_WINDOW]: [0x11, 0x04, 0x3D],
    [MacroName.SHORTCUT_SWAP_WINDOW]: [0x11, 0x04, 0x2B],
    [MacroName.SHORTCUT_SHOW_DESKTOP]: [0x11, 0x08, 0x07],
    [MacroName.SHORTCUT_RUN_COMMAND]: [0x11, 0x08, 0x15],
    [MacroName.SHORTCUT_LOCK_PC]: [0x11, 0x08, 0x0F],
    [MacroName.SHORTCUT_SCREEN_CAPTURE]: [0x11, 0x0A, 0x16],
} as const;

export enum Buttons {
    LEFT_BUTTON,
    RIGHT_BUTTON,
    MIDDLE_BUTTON,
    BUTTON_4,
    BUTTON_5,
}

export class MacrosBuilder implements ProtocolBuilder {
    public readonly buffer: Buffer;
    public readonly bmRequestType: number = 0x21;
    public readonly bRequest: number = 0x09;
    public readonly wValue: number = 0x0308;
    public readonly wIndex: number = 2;

    // noinspection FunctionTooLongJS
    constructor() {
        this.buffer = Buffer.alloc(59);

        this.buffer[0] = 0x08 // header
        this.buffer[1] = 0x3b // header
        this.buffer[2] = 0x01 // header

        this.buffer[3] = 0x02 // button 1
        this.buffer[4] = 0x00 // button 1
        this.buffer[5] = 0x00 // button 1

        this.buffer[6] = 0x03 // button 2
        this.buffer[7] = 0x00 // button 2
        this.buffer[8] = 0x00 // button 2

        this.buffer[9] = 0x04 // button 3
        this.buffer[10] = 0x00 // button 3
        this.buffer[11] = 0x00 // button 3

        this.buffer[12] = 0x01
        this.buffer[13] = 0x00
        this.buffer[14] = 0x00

        this.buffer[15] = 0x01
        this.buffer[16] = 0x00
        this.buffer[17] = 0x00

        this.buffer[18] = 0x0d
        this.buffer[19] = 0x00
        this.buffer[20] = 0x00

        this.buffer[21] = 0x06 // button 4
        this.buffer[22] = 0x00 // button 4
        this.buffer[23] = 0x00 // button 4

        this.buffer[24] = 0x05 // button 5
        this.buffer[25] = 0x00 // button 5
        this.buffer[26] = 0x00 // button 5

        this.buffer[27] = 0x01
        this.buffer[28] = 0x00
        this.buffer[29] = 0x00

        this.buffer[30] = 0x01
        this.buffer[31] = 0x00
        this.buffer[32] = 0x00

        this.buffer[33] = 0x01
        this.buffer[34] = 0x00
        this.buffer[35] = 0x00

        this.buffer[36] = 0x01
        this.buffer[37] = 0x00
        this.buffer[38] = 0x00

        this.buffer[39] = 0x01
        this.buffer[40] = 0x00
        this.buffer[41] = 0x00

        this.buffer[42] = 0x01
        this.buffer[43] = 0x00
        this.buffer[44] = 0x00

        this.buffer[45] = 0x01
        this.buffer[46] = 0x00
        this.buffer[47] = 0x00

        this.buffer[48] = 0x01
        this.buffer[49] = 0x00
        this.buffer[50] = 0x00

        this.buffer[51] = 0x09
        this.buffer[52] = 0x00
        this.buffer[53] = 0x00

        this.buffer[54] = 0x0a
        this.buffer[55] = 0x00
        this.buffer[56] = 0x00

        this.buffer[57] = 0x00
        this.buffer[58] = 0x3b // checksum
    }

    setMacro(button: Buttons, macroName: MacroName): MacrosBuilder {
        const [first = 0x01, second = 0x00, three = 0x00] = Macros[macroName]

        switch (button) {
            case Buttons.LEFT_BUTTON: {
                this.buffer[3] = first
                this.buffer[4] = second
                this.buffer[5] = three
                break;
            }
            case Buttons.RIGHT_BUTTON: {
                this.buffer[6] = first
                this.buffer[7] = second
                this.buffer[8] = three
                break;
            }
            case Buttons.MIDDLE_BUTTON: {
                this.buffer[9] = first
                this.buffer[10] = second
                this.buffer[11] = three
                break;
            }
            case Buttons.BUTTON_4: {
                this.buffer[21] = first
                this.buffer[22] = second
                this.buffer[23] = three
                break;
            }
            case Buttons.BUTTON_5: {
                this.buffer[24] = first
                this.buffer[25] = second
                this.buffer[26] = three
                break;
            }
        }
        return this
    }

    calculateChecksum(): number {
        let checksum = 0;
        for (let i = 2; i < this.buffer.length - 1; i++) {
            checksum += this.buffer[i]!
        }
        return (checksum & 0xFF) - 1;
    }

    build(_mode: ConnectionMode): Buffer {
        this.buffer[58] = this.calculateChecksum();
        return this.buffer;
    }

    toString(): string {
        return this.buffer.toString("hex");
    }
}
