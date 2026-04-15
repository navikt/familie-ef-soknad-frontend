import { describe, expect, test } from 'vitest';
import { tilSøknadV2 } from './søknadNyeRegler';
import {
  lagSøknadOvergangsstønad,
  lagDinSituasjon,
  lagAktivitet,
  lagSpørsmålListeFelt,
  lagSpørsmålFelt,
  lagTekstfelt,
  lagDatoFelt,
  lagSpørsmålBooleanFelt,
} from '../../../test/domeneUtils';
import { EHvaSituasjon, EHarInntekt } from '../../../models/steg/dinsituasjon/nyeSituasjonTyper';
import { IFirma } from '../../../models/steg/aktivitet/firma';

const lagFirma = (id: string): IFirma => ({
  id,
  navn: lagTekstfelt({ label: 'Navn', verdi: 'Firma AS' }),
  organisasjonsnummer: lagTekstfelt({ label: 'Org.nr', verdi: '123456789' }),
  etableringsdato: lagDatoFelt('Etableringsdato', '2020-01-01'),
  arbeidsmengde: lagTekstfelt({ label: 'Arbeidsmengde', verdi: '50' }),
  arbeidsuke: lagTekstfelt({ label: 'Arbeidsuke', verdi: '37.5' }),
});

describe('tilSøknadV2', () => {
  test('mapper hvaSituasjon og harInntekt til flatet struktur', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon, harInntekt }),
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2.brukNyeRegler).toBe(true);
    expect(v2.hvaSituasjon).toEqual(hvaSituasjon);
    expect(v2.harInntekt).toEqual(harInntekt);
  });

  test('mapper firmaer fra aktivitet', () => {
    const firmaer = [lagFirma('1'), lagFirma('2')];
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.selvstendigNæringsdrivende],
      [EHarInntekt.selvstendigNæringsdrivende]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon, harInntekt }),
      aktivitet: lagAktivitet({ firmaer }),
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2.firmaer).toEqual(firmaer);
  });

  test('mapper sagtOpp-felt og søkerFraBestemtMåned', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );
    const sagtOppEllerRedusertStilling = lagSpørsmålFelt({
      spørsmålid: 'sagtOpp',
      svarid: 'sagtOpp',
      verdi: 'Ja',
    });
    const begrunnelse = lagTekstfelt({ label: 'Begrunnelse', verdi: 'Bla bla' });
    const dato = lagDatoFelt('Dato', '2025-01-15');
    const søkerFraBestemtMåned = lagSpørsmålBooleanFelt({
      spørsmålid: 'søkerFraBestemtMåned',
      svarid: 'ja',
      verdi: true,
    });
    const søknadsdato = lagDatoFelt('Søknadsdato', '2025-03-01');

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({
        hvaSituasjon,
        harInntekt,
        sagtOppEllerRedusertStilling,
        begrunnelseSagtOppEllerRedusertStilling: begrunnelse,
        datoSagtOppEllerRedusertStilling: dato,
        søkerFraBestemtMåned,
        søknadsdato,
      }),
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2.sagtOppEllerRedusertStilling).toEqual(sagtOppEllerRedusertStilling);
    expect(v2.begrunnelseSagtOppEllerRedusertStilling).toEqual(begrunnelse);
    expect(v2.datoSagtOppEllerRedusertStilling).toEqual(dato);
    expect(v2.søkerFraBestemtMåned).toEqual(søkerFraBestemtMåned);
    expect(v2.søknadsdato).toEqual(søknadsdato);
  });

  test('beholder fellesfelter fra steg 1-4', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon, harInntekt }),
      harBekreftet: true,
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2.person).toEqual(søknad.person);
    expect(v2.sivilstatus).toEqual(søknad.sivilstatus);
    expect(v2.medlemskap).toEqual(søknad.medlemskap);
    expect(v2.bosituasjon).toEqual(søknad.bosituasjon);
    expect(v2.dokumentasjonsbehov).toEqual(søknad.dokumentasjonsbehov);
    expect(v2.harBekreftet).toBe(true);
  });

  test('fjerner skalBehandlesINySaksbehandling', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon, harInntekt }),
      skalBehandlesINySaksbehandling: true,
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2).not.toHaveProperty('skalBehandlesINySaksbehandling');
    expect(v2).not.toHaveProperty('aktivitet');
    expect(v2).not.toHaveProperty('merOmDinSituasjon');
  });

  test('kaster feil hvis hvaSituasjon mangler', () => {
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ harInntekt }),
    });

    expect(() => tilSøknadV2(søknad)).toThrow('hvaSituasjon mangler');
  });

  test('kaster feil hvis harInntekt mangler', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon }),
    });

    expect(() => tilSøknadV2(søknad)).toThrow('harInntekt mangler');
  });

  test('firmaer er undefined når selvstendig ikke valgt', () => {
    const hvaSituasjon = lagSpørsmålListeFelt(
      'hvaSituasjon',
      [EHvaSituasjon.barnUnder14Måneder],
      [EHvaSituasjon.barnUnder14Måneder]
    );
    const harInntekt = lagSpørsmålListeFelt(
      'harInntekt',
      [EHarInntekt.arbeidstaker],
      [EHarInntekt.arbeidstaker]
    );

    const søknad = lagSøknadOvergangsstønad({
      merOmDinSituasjon: lagDinSituasjon({ hvaSituasjon, harInntekt }),
      aktivitet: lagAktivitet({ firmaer: undefined }),
    });

    const v2 = tilSøknadV2(søknad);

    expect(v2.firmaer).toBeUndefined();
  });
});
