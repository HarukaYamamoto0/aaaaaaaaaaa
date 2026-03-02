import { ConnectionMode } from "../types.js";
import type {BaseProtocolBuilder} from "../core/BaseProtocolBuilder.js";

/**
 * ⚠️ CRITICAL: INTERNAL STATE RESET REPORT
 *
 * From what I've been able to gather, although I'm not certain, this command resets the ACTIVE mouse configuration in RAM.
 *
 * It DOES NOT:
 *
 * - Clear the EEPROM
 * - Restore factory defaults
 * - Finalize any configuration
 *
 * It:
 *
 * - Clears the current configuration structure in memory
 * - Temporarily disables button mapping
 * - Leaves the device in a partially non-functional state
 *
 * After sending this report, ALL configuration blocks MUST be reapplied.
 *
 * If the complete sequence is not sent:
 *
 * → The mouse may stop responding correctly
 * → The buttons may stop working
 * → Only a physical shutdown and restart will restore the state
 *
 * This report should NEVER be exposed as a public API call.
 *
 * It should only be used internally, for example, when resetting all settings. Theoretically, you use it to clean up
 * before applying the new settings or when switching from one profile to another.
 *
 * DO NOT:
 *
 * - Send this report alone
 * - Send this report twice
 * - Send this report outside a complete configuration update
 */
export class InternalStateResetReportBuilder implements BaseProtocolBuilder {
    public static readonly BM_REQUEST_TYPE = 0x21;
    public static readonly B_REQUEST = 0x09;
    public static readonly W_VALUE = 0x030C;
    public static readonly W_INDEX = 2;

    readonly buffer: Buffer;
    public readonly bmRequestType: number = InternalStateResetReportBuilder.BM_REQUEST_TYPE;
    public readonly bRequest: number = InternalStateResetReportBuilder.B_REQUEST;
    public readonly wValue: number = InternalStateResetReportBuilder.W_VALUE;
    public readonly wIndex: number = InternalStateResetReportBuilder.W_INDEX;

    constructor() {
        this.buffer = Buffer.from([
            0x0c, // Report ID (must match low byte of wValue)
            0x0a, 0x01, 0xfe, 0x01, 0xfe, // Static payload observed in official software
            0x00, 0x00, 0x00, 0x00 // Padding
        ]);
    }

    calculateChecksum(): number {
        // No checksum required for this report
        return 0x00;
    }

    build(mode: ConnectionMode): Buffer {
        // Wired mode uses a truncated version (6 bytes observed)
        if (mode === ConnectionMode.Wired) {
            return this.buffer.subarray(0, 6);
        }

        return this.buffer;
    }

    toString(): string {
        return this.buffer.toString("hex");
    }

    compareWithHexString(value: string): boolean {
        return this.toString() == value
    }
}