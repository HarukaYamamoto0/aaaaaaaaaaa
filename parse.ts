import { readFileSync } from "fs"
import { randomBytes } from "crypto"

type Sample = {
    id: string
    label: string
    bytes: number[]
    source: "paste"
}

function generateId(): string {
    return randomBytes(5).toString("base64url")
}

function hexToBytes(hex: string): number[] {
    const bytes: number[] = []

    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16))
    }

    return bytes
}

function parseSamplesFile(path: string) {
    const content = readFileSync(path, "utf-8")

    const lines = content
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)

    const samples: Sample[] = lines.map(line => {
        const [delayRaw, hexRaw] = line.split(":")
        const delay = delayRaw.trim()
        const hex = hexRaw.trim()

        return {
            id: generateId(),
            label: `DPI ${delay}`,
            bytes: hexToBytes(hex),
            source: "paste"
        }
    })

    return {
        version: 1,
        exportedAt: new Date().toISOString(),
        samples,
        signatures: [],
        pairwiseDiff: {
            enabled: false,
            sampleAId: null,
            sampleBId: null
        },
        activeSampleId: samples.at(-1)?.id ?? null
    }
}

const result = parseSamplesFile("./dpi-change.txt")

console.log(JSON.stringify(result, null, 2))