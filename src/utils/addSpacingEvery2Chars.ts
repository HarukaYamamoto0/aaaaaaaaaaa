export function addSpacingEvery2Chars(input: string): string {
    return input.match(/.{1,2}/g)?.join(" ") ?? "";
}