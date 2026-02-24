// noinspection SpellCheckingInspection

import {AttackSharkX11} from "./src/index.js";
import {addSpacingEvery2Chars} from "./src/utils/addSpacingEvery2Chars.js";
import {DPI_STEP_MAP} from "./src/dpi-map.js";

const driver = new AttackSharkX11()

enum Stages {
    First = 0x01,
    Second = 0x02,
    Third = 0x03,
    Fourth = 0x04,
    Fifth = 0x05,
    Sixth = 0x06,
}

try {
    const report = Buffer.alloc(56)

    report[0] = 0x04 // header
    report[1] = 0x38 // header
    report[2] = 0x01 // header

    report[3] = 0x01 // angle snap
    report[4] = 0x00 // ripple control

    report[5] = 0x3F // fixed

    report[6] = 0x20 // stage mask
    report[7] = 0x20 // stage mask

    report[8] = 0x12 // stage 1 value
    report[9] = 0x25 // stage 2 value
    report[10] = 0x38 // stage 3 value
    report[11] = 0x4B // stage 4 value
    report[12] = 0x75 // stage 5 value
    report[13] = 0x81 // stage 6 value

    report[14] = 0x00 // fixed
    report[15] = 0x00 // fixed

    report[16] = 0x00 // high stage 1
    report[17] = 0x00 // high stage 2
    report[18] = 0x00 // high stage 3
    report[19] = 0x00 // high stage 4
    report[20] = 0x00 // high stage 5
    report[21] = 0x01 // high stage 6

    report[22] = 0x00 // fixed
    report[23] = 0x00 // fixed
    report[24] = 0x02 // stage index
    report[25] = 0xFF // fixed
    report[26] = 0x00 // fixed
    report[27] = 0x00 // fixed
    report[28] = 0x00 // fixed
    report[29] = 0xFF // fixed
    report[30] = 0x00 // fixed
    report[31] = 0x00 // fixed

    report[32] = 0x00 // fixed
    report[33] = 0xFF // fixed
    report[34] = 0xFF // fixed
    report[35] = 0xFF // fixed
    report[36] = 0x00 // fixed
    report[37] = 0x00 // fixed
    report[38] = 0xFF // fixed
    report[39] = 0xFF // fixed
    report[40] = 0xFF // fixed
    report[41] = 0x00 // fixed
    report[42] = 0xFF // fixed
    report[43] = 0xFF // fixed
    report[44] = 0x40 // fixed
    report[45] = 0x00 // fixed
    report[46] = 0xFF // fixed
    report[47] = 0xFF // fixed

    report[48] = 0xFF // fixed
    report[49] = 0x02 // fixed
    report[50] = 0x0F // unknown, perhaps a second checksum?
    report[51] = 0x67 // checksum

    report[52] = 0x00 // padding wireless mode
    report[53] = 0x00 // padding wireless mode
    report[54] = 0x00 // padding wireless mode
    report[55] = 0x00 // padding wireless mode

    const stages = [800, 1600, 2400, 3200, 5000, 22000]

    // calculates
    setAngleSnap(report, false)
    setRippleControl(report, true)
    setStages(report, stages)
    report[6] = computeStageMask(stages)
    report[7] = report[6] // mirror
    applyStageFlags(report, stages)
    setCurrentStage(report, Stages.Second)

    const checksum = calculateChecksum16(report)

    report[50] = (checksum >> 8) & 0xff   // high byte
    report[51] = checksum & 0xff          // low byte

    console.log(addSpacingEvery2Chars(report.toString("hex")))

    await driver.commandTransfer(
        report,
        0x21,
        0x09,
        0x0304,
        2
    )
} finally {
    driver.close()
}

function setAngleSnap(report: Uint8Array, active: boolean) {
    report[3] = active ? 0x01 : 0x00
}

function setRippleControl(report: Uint8Array, active: boolean) {
    report[4] = active ? 0x01 : 0x00
}

function setStages(report: Uint8Array, stages: number[]) {
    for (let i = 0; i < 6; i++) {
        report[8 + i] = encodeDpi(stages[i]!)
    }
}

function computeStageMask(stages: number[]): number {
    let mask = 0x00

    const bitValues = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20]

    for (let i = 0; i < 6; i++) {
        if (stages[i]! > 12000) {
            mask |= bitValues[i]!
        }
    }

    return mask
}

function applyStageFlags(report: Uint8Array, stages: number[]) {
    for (let i = 0; i < 6; i++) {
        report[16 + i] = stages[i]! > 10000 ? 0x01 : 0x00
    }
}

function setCurrentStage(report: Uint8Array, stage: Stages) {
    report[24] = stage
}

function calculateChecksum16(report: Uint8Array): number {
    let sum = 0

    for (let i = 3; i <= 49; i++) {
        sum += report[i]!
    }

    return sum & 0xffff
}

function encodeDpi(dpi: number): number {
    const keys = Object.keys(DPI_STEP_MAP)
        .map(Number)
        .sort((a, b) => a - b);

    const match = keys.find(k => k >= dpi);

    if (match === undefined) {
        throw new Error(`Unsupported DPI: ${dpi}`);
    }

    return DPI_STEP_MAP[match]!;
}


// quando o stage 1 está acima de 10000 o byte 16 é ativado com 0x01
// quando o stage 2 está acima de 10000 o byte 17 é ativado com 0x01
// quando o stage 3 está acima de 10000 o byte 18 é ativado com 0x01
// quando o stage 4 está acima de 10000 o byte 19 é ativado com 0x01
// quando o stage 5 está acima de 10000 o byte 20 é ativado com 0x01
// quando o stage 6 está acima de 10000 o byte 21 é ativado com 0x01
//
// quando o stage 1 está acima de 12000 o bytes 6 e 7 elevam para 0x01
// quando o stage 2 está acima de 12000 o bytes 6 e 7 elevam para 0x02
// quando o stage 3 está acima de 12000 o bytes 6 e 7 elevam para 0x04
// quando o stage 4 está acima de 12000 o bytes 6 e 7 elevam para 0x08
// quando o stage 5 está acima de 12000 o bytes 6 e 7 elevam para 0x10
// quando o stage 6 está acima de 12000 o bytes 6 e 7 elevam para 0x20
//
// quando o stage 6 está acima de 12000 e o stage 1 tambem o bytes 6 e 7 elevam para 0x21
// quando o stage 6 está acima de 12000 e o stage 2 tambem o bytes 6 e 7 elevam para 0x22
// quando o stage 6 está acima de 12000 e o stage 3 tambem o bytes 6 e 7 elevam para 0x24
// quando o stage 6 está acima de 12000 e o stage 4 tambem o bytes 6 e 7 elevam para 0x28
// quando o stage 6 está acima de 12000 e o stage 5 tambem o bytes 6 e 7 elevam para 0x30
//
// quando o stage 1 está acima de 12000 e o stage 2 tambem o bytes 6 e 7 elevam para 0x21
// quando o stage 1 está acima de 12000 e o stage 4 tambem o bytes 6 e 7 elevam para 0x22
// quando o stage 1 está acima de 12000 e o stage 5 tambem o bytes 6 e 7 elevam para 0x24
// quando o stage 1 está acima de 12000 e o stage 6 tambem o bytes 6 e 7 elevam para 0x28
//
// ou seja é uma soma dos valores ativos com valor minimo de 0x00 é com todos o stages ativos dá 0x3f
// se stage 2, 3 e 5 estiver acima de 12000 os bytes 6 e 7 elevam para 0x16 (0x02 + 0x04 + 0x10 = 0x16)