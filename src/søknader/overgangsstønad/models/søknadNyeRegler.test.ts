import { describe, expect, test } from 'vitest';
import { tilSøknadRegelendring2026 } from './søknad-regelendring-2026';
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

describe('tilSøknadRegelendring2026', () => {
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

    const overgangsstønadRegelendring2026 = tilSøknadRegelendring2026(søknad);

    expect(overgangsstønadRegelendring2026.erRegelendring2026).toBe(true);
    expect(overgangsstønadRegelendring2026.hvaSituasjon).toEqual(hvaSituasjon);
    expect(overgangsstønadRegelendring2026.harInntekt).toEqual(harInntekt);
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

    const overgangsstønadRegelendring2026 = tilSøknadRegelendring2026(søknad);

    expect(overgangsstønadRegelendring2026.firmaer).toEqual(firmaer);
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

    const overgangsstønadRegelendring2026 = tilSøknadRegelendring2026(søknad);

    expect(overgangsstønadRegelendring2026.sagtOppEllerRedusertStilling).toEqual(
      sagtOppEllerRedusertStilling
    );
    expect(overgangsstønadRegelendring2026.begrunnelseSagtOppEllerRedusertStilling).toEqual(
      begrunnelse
    );
    expect(overgangsstønadRegelendring2026.datoSagtOppEllerRedusertStilling).toEqual(dato);
    expect(overgangsstønadRegelendring2026.søkerFraBestemtMåned).toEqual(søkerFraBestemtMåned);
    expect(overgangsstønadRegelendring2026.søknadsdato).toEqual(søknadsdato);
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

    const overgangsstønadRegelendring2026 = tilSøknadRegelendring2026(søknad);

    expect(overgangsstønadRegelendring2026.person).toEqual(søknad.person);
    expect(overgangsstønadRegelendring2026.sivilstatus).toEqual(søknad.sivilstatus);
    expect(overgangsstønadRegelendring2026.medlemskap).toEqual(søknad.medlemskap);
    expect(overgangsstønadRegelendring2026.bosituasjon).toEqual(søknad.bosituasjon);
    expect(overgangsstønadRegelendring2026.dokumentasjonsbehov).toEqual(søknad.dokumentasjonsbehov);
    expect(overgangsstønadRegelendring2026.harBekreftet).toBe(true);
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

    expect(() => tilSøknadRegelendring2026(søknad)).toThrow('hvaSituasjon mangler');
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

    expect(() => tilSøknadRegelendring2026(søknad)).toThrow('harInntekt mangler');
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

    const overgangsstønadRegelendring2026 = tilSøknadRegelendring2026(søknad);

    expect(overgangsstønadRegelendring2026.firmaer).toBeUndefined();
  });
});
