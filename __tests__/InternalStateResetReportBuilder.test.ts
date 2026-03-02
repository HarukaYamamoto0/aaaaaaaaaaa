import { describe, expect, it } from "bun:test";
import { InternalStateResetReportBuilder } from "../src/protocols/InternalStateResetReportBuilder.js";
import { ConnectionMode } from "../src/types.js";

describe("InternalStateResetReportBuilder", () => {
    it("should initialize with correct default buffer", () => {
        const builder = new InternalStateResetReportBuilder();
        // 0c 0a 01 fe 01 fe 00 00 00 00
        expect(builder.toString()).toBe("0c0a01fe01fe00000000");
    });

    it("should have correct USB control transfer parameters", () => {
        const builder = new InternalStateResetReportBuilder();
        expect(builder.bmRequestType).toBe(0x21);
        expect(builder.bRequest).toBe(0x09);
        expect(builder.wValue).toBe(0x030C);
        expect(builder.wIndex).toBe(2);
    });

    it("should return truncated buffer for Wired mode", () => {
        const builder = new InternalStateResetReportBuilder();
        const buffer = builder.build(ConnectionMode.Wired);
        expect(buffer.length).toBe(6);
        expect(buffer.toString("hex")).toBe("0c0a01fe01fe");
    });

    it("should return full buffer for Adapter mode", () => {
        const builder = new InternalStateResetReportBuilder();
        const buffer = builder.build(ConnectionMode.Adapter);
        expect(buffer.length).toBe(10);
        expect(buffer.toString("hex")).toBe("0c0a01fe01fe00000000");
    });

    it("should calculate checksum as 0x00", () => {
        const builder = new InternalStateResetReportBuilder();
        expect(builder.calculateChecksum()).toBe(0);
    });

    it("should compare correctly with hex string", () => {
        const builder = new InternalStateResetReportBuilder();
        const hex = "0c0a01fe01fe00000000";
        expect(builder.compareWithHexString(hex)).toBe(true);
        expect(builder.compareWithHexString("invalid")).toBe(false);
    });
});
