export enum MellomlagredeStønadstyper {
  overgangsstønad = 'overgangsstonad',
  overgangsstønadV2 = 'overgangsstonad-v2',
  barnetilsyn = 'barnetilsyn',
  skolepenger = 'skolepenger',
}

export enum Stønadstype {
  overgangsstønad = 'OVERGANGSSTØNAD',
  barnetilsyn = 'BARNETILSYN',
  skolepenger = 'SKOLEPENGER',
}

export const stønadsTypeTilEngelsk = (stønadstype: Stønadstype): string => {
  switch (stønadstype) {
    case Stønadstype.overgangsstønad:
      return 'transitional benefit';
    case Stønadstype.barnetilsyn:
      return 'child care benefit';
    case Stønadstype.skolepenger:
      return 'school fees';
  }
};
