export enum MellomlagredeStønadstyper {
  overgangsstønad = 'overgangsstonad',
  overgangsstønadRegelendring2026 = 'overgangsstonad-regelendring-2026',
  barnetilsyn = 'barnetilsyn',
  skolepenger = 'skolepenger',
}

export enum Stønadstype {
  overgangsstønad = 'OVERGANGSSTØNAD',
  overgangsstønadRegelendring2026 = 'OVERGANGSSTØNAD_REGELENDRING_2026',
  barnetilsyn = 'BARNETILSYN',
  skolepenger = 'SKOLEPENGER',
}

export const stønadsTypeTilEngelsk = (stønadstype: Stønadstype): string => {
  switch (stønadstype) {
    case Stønadstype.overgangsstønad:
      return 'transitional benefit';
    case Stønadstype.overgangsstønadRegelendring2026:
      return 'transitional benefit';
    case Stønadstype.barnetilsyn:
      return 'child care benefit';
    case Stønadstype.skolepenger:
      return 'school fees';
  }
};
