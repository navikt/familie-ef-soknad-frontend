export function oppdaterObjektIListe<T>(array: T[], object: T, index: number) {
    return [...array.slice(0, index), object, ...array.slice(index + 1)];
}
