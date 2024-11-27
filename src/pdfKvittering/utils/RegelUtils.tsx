function hentKlausulOgTestNummer(regel: string): [number[], number] {
  const klausulTreff = regel.match(/clause=([\d.]+)/);
  const testNummerTreff = regel.match(/testNumber=(\d+)/);

  if (!klausulTreff?.[1] || !testNummerTreff?.[1]) {
    throw new Error(`Ugyldig regelformat: ${regel}`);
  }

  const klausul = klausulTreff[1].split('.').map(Number);
  const testNummer = parseInt(testNummerTreff[1], 10);

  return [klausul, testNummer];
}

export function feiletRegelSammenligner(a: string, b: string): number {
  const [klausulA, testNumberA] = hentKlausulOgTestNummer(a);
  const [klausulB, testNumberB] = hentKlausulOgTestNummer(b);

  if (klausulA.length !== klausulB.length) {
    return klausulA.length - klausulB.length;
  }

  for (let i = 0; i < klausulA.length; i++) {
    const elementA = klausulA?.[i];
    const elementB = klausulB?.[i];
    const typeA = typeof elementA;
    const typeB = typeof elementB;

    if (
      elementA === undefined ||
      elementB === undefined ||
      typeA !== 'number' ||
      typeB !== 'number'
    ) {
      throw new Error(`Ugyldig elementtype: ${a} eller ${b} er ikke et tall`);
    }

    if (elementA !== elementB) {
      return elementB - elementA;
    }
  }

  return testNumberB - testNumberA;
}

export function parseFeiletRegel(feiletRegel: string | undefined): string[] {
  if (!feiletRegel) {
    return [];
  }
  return feiletRegel
    .slice(1, -1)
    .split(',')
    .map((regel) => regel.trim());
}
