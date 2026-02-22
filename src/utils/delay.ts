// Source - https://stackoverflow.com/a/37764963
// Posted by v-andrew, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-22, License - CC BY-SA 4.0

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
