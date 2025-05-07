import { describe, expect, test } from 'vitest';
import { DokumentasjonsConfig } from './DokumentasjonsConfig';
import {
  AdresseopplysningerDokumentasjon,
  AktivitetDokumentasjon,
  BarnasBostedDokumentasjon,
  BarnDokumentasjon,
  BarnetilsynDokumentasjon,
  BosituasjonDokumentasjon,
  IDokumentasjon,
  OmDegDokumentasjon,
  SituasjonDokumentasjon,
} from '../models/steg/dokumentasjon';

describe('validerer dokumentasjonsconfig', () => {
  test('Skal ha like mange keys i dokumentasjonsconfig som vi har i enums', () => {
    const antallKeysIDokumentasjonsconfig =
      Object.keys(DokumentasjonsConfig).length;

    const alleEnums: number = [
      Object.keys(SituasjonDokumentasjon).length,
      Object.keys(BosituasjonDokumentasjon).length,
      Object.keys(BarnetilsynDokumentasjon).length,
      Object.keys(AktivitetDokumentasjon).length,
      Object.keys(BarnasBostedDokumentasjon).length,
      Object.keys(BarnDokumentasjon).length,
      Object.keys(OmDegDokumentasjon).length,
      Object.keys(AdresseopplysningerDokumentasjon).length,
    ].reduce((last: number, current: number) => {
      return last + current;
    }, 0);

    //DokumentasjonsConfig inneholder to innslag av Samværsavtale, derfor har den ett innslag ekstra
    expect(antallKeysIDokumentasjonsconfig).toBe(alleEnums + 1);
  });

  test('Kun id SAMVÆRSAVTALE skal ha to innslag i DokumentasjonsConfig. Disse skal ha samme tittel og beskrivelse', () => {
    const alleInnslagGruppertPåId: Map<string, IDokumentasjon[]> = groupBy(
      Object.values(DokumentasjonsConfig),
      'id'
    );
    const alleInnslagMedSammeId: IDokumentasjon[][] = Object.values(
      alleInnslagGruppertPåId
    ).filter((dokumentasjonListe) => dokumentasjonListe.length > 1);

    expect(alleInnslagMedSammeId.length).toBe(1);
    expect(alleInnslagMedSammeId[0].length).toBe(2);
    expect(alleInnslagMedSammeId[0][0].id).toBe(
      BarnasBostedDokumentasjon.SAMVÆRSAVTALE
    );
    expect(alleInnslagMedSammeId[0][0].tittel).toBe(
      alleInnslagMedSammeId[0][1].tittel
    );
    expect(alleInnslagMedSammeId[0][0].beskrivelse).toBe(
      alleInnslagMedSammeId[0][1].beskrivelse
    );
  });
});

// @ts-expect-error ukjent type
const groupBy = (xs, key: string): Map<string, IDokumentasjon[]> => {
  // @ts-expect-error ukjent type
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
