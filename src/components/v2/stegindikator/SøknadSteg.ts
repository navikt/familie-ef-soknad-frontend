export interface SøknadSteg {
  id: string;
  stegKey: string;
}

// TODO: Denne må gåes igjennom, rydd opp strenger og generer hjelpe medotder basert på stønad osv.
export const SøknadSteg: SøknadSteg[] = [
  {
    id: 'omDeg',
    stegKey: 'stegtittel.omDeg',
  },
  {
    id: 'bosituasjon',
    stegKey: 'stegtittel.bosituasjon',
  },
  {
    id: 'barneDine',
    stegKey: 'stegtittel.barnaDine',
  },
  {
    id: 'andreForelderOgSamvær',
    stegKey: 'stegtittel.andreForelderOgSamvær',
  },
  {
    id: 'arbeidssituasjon',
    stegKey: 'stegtittel.arbeidssituasjon',
  },
  {
    id: 'dinSituasjon',
    stegKey: 'stegtittel.dinSituasjon',
  },
  {
    id: 'oppsummering',
    stegKey: 'stegtittel.oppsummering',
  },
  {
    id: 'lastOppDokumentasjon',
    stegKey: 'stegtittel.lastOppDokumentasjon',
  },
];
