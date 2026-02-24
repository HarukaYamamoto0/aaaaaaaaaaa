import {ConnectionMode, type ProtocolBuilder} from "../types.js";
import {DPI_STEP_MAP} from "../dpi-map.js";

const OFFSET = {
    ANGLE_SNAP: 3,
    RIPPLER_CONTROL: 4,
    STAGE_MASK_A: 6,
    STAGE_MASK_B: 7,
    EXPANDED_MASK: 16,
    CURRENT_STAGE: 24,
    UNKNOWN: 50,
    CHECKSUM: 51,
    STAGE_OFFSET_BASE: 7,
    STAGES_START: 8,
    STAGES_END: 13,
} as const;

const CHECKSUM_RANGE = {START: 3, END: 49} as const;
const STAGE_COUNT = 6;
const HIGH_BYTE_THRESHOLD = 0x80;

export enum StageIndex {
    FIRST = 0x01,
    SECOND = 0x02,
    THIRD = 0x03,
    FOURTH = 0x04,
    FIFTH = 0x05,
    SIXTH = 0x06
}

export class DpiBuilder implements ProtocolBuilder {
    public readonly buffer: Buffer;
    public readonly bmRequestType: number = 0x21;
    public readonly bRequest: number = 0x09;
    public readonly wValue: number = 0x0304;
    public readonly wIndex: number = 2;

    // noinspection FunctionTooLongJS
    constructor() {
        this.buffer = Buffer.alloc(56)

        this.buffer[0] = 0x04
        this.buffer[1] = 0x38
        this.buffer[2] = 0x01
        this.buffer[3] = 0x00 // angle snap
        this.buffer[4] = 0x01 // rippler control
        this.buffer[5] = 0x3F
        this.buffer[6] = 0x00
        this.buffer[7] = 0x00
        this.buffer[8] = 0x12 // stage 1 step
        this.buffer[9] = 0x25 // stage 2 step
        this.buffer[10] = 0x38 // stage 3 step
        this.buffer[11] = 0x4B // stage 4 step
        this.buffer[12] = 0x75 // stage 5 step
        this.buffer[13] = 0x8D // stage 6 step
        this.buffer[14] = 0x00
        this.buffer[15] = 0x00

        this.buffer[16] = 0x00
        this.buffer[17] = 0x00
        this.buffer[18] = 0x00
        this.buffer[19] = 0x00
        this.buffer[20] = 0x00
        this.buffer[21] = 0x01
        this.buffer[22] = 0x00
        this.buffer[23] = 0x00
        this.buffer[24] = 0x02 // stage index
        this.buffer[25] = 0xFF
        this.buffer[26] = 0x00
        this.buffer[27] = 0x00
        this.buffer[28] = 0x00
        this.buffer[29] = 0xFF
        this.buffer[30] = 0x00
        this.buffer[31] = 0x00

        this.buffer[32] = 0x00
        this.buffer[33] = 0xFF
        this.buffer[34] = 0xFF
        this.buffer[35] = 0xFF
        this.buffer[36] = 0x00
        this.buffer[37] = 0x00
        this.buffer[38] = 0xFF
        this.buffer[39] = 0xFF
        this.buffer[40] = 0xFF
        this.buffer[41] = 0x00
        this.buffer[42] = 0xFF
        this.buffer[43] = 0xFF
        this.buffer[44] = 0x40
        this.buffer[45] = 0x00
        this.buffer[46] = 0xFF
        this.buffer[47] = 0xFF

        this.buffer[48] = 0xFF
        this.buffer[49] = 0x02
        this.buffer[50] = 0x0F // unknown
        this.buffer[51] = 0x68 // checksum

        this.buffer[52] = 0x00 // padding
        this.buffer[53] = 0x00 // padding
        this.buffer[54] = 0x00 // padding
        this.buffer[55] = 0x00 // padding
    }

    setAngleSnap(active: boolean = false): this {
        this.buffer[OFFSET.ANGLE_SNAP] = active ? 0x01 : 0x00;
        return this;
    }

    setRipplerControl(active: boolean = true): this {
        this.buffer[OFFSET.RIPPLER_CONTROL] = active ? 0x01 : 0x00;
        return this;
    }

    setCurrentStage(currentStage: StageIndex): this {
        this.buffer[OFFSET.CURRENT_STAGE] = currentStage;
        return this;
    }

    setDpiValue(stage: StageIndex, dpi: number): this {
        this.buffer[OFFSET.STAGE_OFFSET_BASE + stage] = this.dpiToFirmwareStep(dpi);
        return this;
    }

    dpiToFirmwareStep(dpi: number): number {
        const keys = Object.keys(DPI_STEP_MAP)
            .map(Number)
            .sort((a, b) => a - b);

        const match = keys.find(k => k >= dpi);

        if (match === undefined) {
            throw new Error(`Unsupported DPI: ${dpi}`);
        }

        return DPI_STEP_MAP[match]!;
    }

    calculateChecksum(): number {
        let checksum = 0;
        for (let i = CHECKSUM_RANGE.START; i <= CHECKSUM_RANGE.END; i++) {
            checksum = (checksum + this.buffer[i]!) & 0xFF;
        }
        return checksum;
    }

    build(mode: ConnectionMode): Buffer {
        this.applyMask();
        this.buffer[OFFSET.CHECKSUM] = this.calculateChecksum();

        return mode === ConnectionMode.Wired
            ? this.buffer.subarray(0, OFFSET.CHECKSUM + 1) // exclui padding
            : this.buffer;
    }

    toString(): string {
        return this.buffer.toString("hex");
    }

    private applyMask(): void {
        const stages = this.buffer.subarray(OFFSET.STAGES_START, OFFSET.STAGES_END);

        let mask = 0;
        for (let i = 0; i < STAGE_COUNT; i++) {
            if (stages[i]! >= HIGH_BYTE_THRESHOLD) mask |= (1 << i);
        }

        this.buffer[OFFSET.STAGE_MASK_A] = mask;
        this.buffer[OFFSET.STAGE_MASK_B] = mask;

        for (let i = 0; i < STAGE_COUNT; i++) {
            this.buffer[OFFSET.EXPANDED_MASK + i] = (mask >> i) & 1;
        }
    }
}
