import { describe, expect } from 'vitest';
import {
  lagBosituasjon,
  lagDatoFelt,
  lagPersonDetaljer,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagSøknadOvergangsstønad,
  lagTekstfelt,
} from '../../../../test/domeneUtils';
import { isoDatoEnMånedFrem, isoDatoEnMånedTilbake } from '../../../../test/dato';
import { EBosituasjon, ESøkerDelerBolig } from '../../../../models/steg/bosituasjon';
import { ISpørsmålFelt } from '../../../../models/søknad/søknadsfelter';
import { ESvar } from '../../../../models/felles/spørsmålogsvar';
import { sanerBosituasjonSteg } from './sanering';

const lagUtfyltBosituasjon = (hovedSpørsmål: ISpørsmålFelt, skalGifteSeg: boolean) => {
  return lagBosituasjon({
    delerBoligMedAndreVoksne: hovedSpørsmål,
    skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
      spørsmålid: EBosituasjon.skalGifteSegEllerBliSamboer,
      svarid: skalGifteSeg ? ESvar.JA : ESvar.NEI,
      label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      verdi: skalGifteSeg,
    }),
    datoFlyttetSammenMedSamboer: lagDatoFelt('Når flyttet dere sammen?', isoDatoEnMånedTilbake),
    datoSkalGifteSegEllerBliSamboer: lagDatoFelt('Når skal dette skje?', isoDatoEnMånedFrem),
    datoFlyttetFraHverandre: lagDatoFelt('Når flyttet dere fra hverandre?', isoDatoEnMånedTilbake),
    samboerDetaljer: lagPersonDetaljer({
      navn: lagTekstfelt({ label: 'Navn', verdi: 'Ola Nordmann' }),
      ident: lagTekstfelt({ label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '12345678910' }),
      fødselsdato: lagDatoFelt('Fødselsdato', isoDatoEnMånedTilbake),
      kjennerIkkeIdent: false,
    }),
    vordendeSamboerEktefelle: lagPersonDetaljer({
      navn: lagTekstfelt({ label: 'Navn', verdi: 'Kari Nordmann' }),
      ident: lagTekstfelt({ label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '23456789012' }),
      fødselsdato: lagDatoFelt('Fødselsdato', isoDatoEnMånedTilbake),
      kjennerIkkeIdent: false,
    }),
  });
};

describe('skal sanere felter tilhørende bosituasjonsteget', () => {
  describe('overgangsstønad', () => {
    test('bruker bor sammen med en hen venter barn med', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borSammenOgVenterBarn,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, jeg bor sammen med en jeg har eller venter barn med',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borSammenOgVenterBarn);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg bor sammen med en jeg har eller venter barn med'
      );

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker og den andre forelderen bor midlertidig fra hverandre', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borMidlertidigFraHverandre,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, men jeg og den andre forelderen bor midlertidig fra hverandre',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borMidlertidigFraHverandre);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, men jeg og den andre forelderen bor midlertidig fra hverandre'
      );

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker bor med kjæresten sin', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.harEkteskapsliknendeForhold,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, jeg bor med kjæresten min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.harEkteskapsliknendeForhold);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe('Ja, jeg bor med kjæresten min');

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(datoFlyttetSammenMedSamboer?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker deler bolig med andre voksne', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.delerBoligMedAndreVoksne,
        label: 'Deler du bolig med andre voksne?',
        verdi:
          'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeFalsy;

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker deler bolig med andre voksne og skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.delerBoligMedAndreVoksne,
        label: 'Deler du bolig med andre voksne?',
        verdi:
          'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker bor alene med barn/gravid', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borAleneMedBarnEllerGravid);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker bor alene med barn/gravid og skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borAleneMedBarnEllerGravid);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('tidligere samboer er fortsatt registrert på brukers adresse', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, men en tidligere samboer er fortsatt registrert på adressen min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
      );
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, men en tidligere samboer er fortsatt registrert på adressen min'
      );

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(datoFlyttetFraHverandre?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(skalGifteSegEllerBliSamboer?.verdi).toBe(false);

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
    });

    test('tidligere samboer er fortsatt registrert på brukers adresse og bruker skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, men en tidligere samboer er fortsatt registrert på adressen min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
      );
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, men en tidligere samboer er fortsatt registrert på adressen min'
      );

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(skalGifteSegEllerBliSamboer?.verdi).toBe(true);

      expect(datoFlyttetFraHverandre?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
    });
  });

  describe('overgangsstønad', () => {
    test('bruker bor sammen med en hen venter barn med', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borSammenOgVenterBarn,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, jeg bor sammen med en jeg har eller venter barn med',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borSammenOgVenterBarn);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg bor sammen med en jeg har eller venter barn med'
      );

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker og den andre forelderen bor midlertidig fra hverandre', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borMidlertidigFraHverandre,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, men jeg og den andre forelderen bor midlertidig fra hverandre',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borMidlertidigFraHverandre);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, men jeg og den andre forelderen bor midlertidig fra hverandre'
      );

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker bor med kjæresten sin', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.harEkteskapsliknendeForhold,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Ja, jeg bor med kjæresten min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.harEkteskapsliknendeForhold);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe('Ja, jeg bor med kjæresten min');

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(datoFlyttetSammenMedSamboer?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(skalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
    });

    test('bruker deler bolig med andre voksne', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.delerBoligMedAndreVoksne,
        label: 'Deler du bolig med andre voksne?',
        verdi:
          'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeFalsy;

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker deler bolig med andre voksne og skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.delerBoligMedAndreVoksne,
        label: 'Deler du bolig med andre voksne?',
        verdi:
          'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Ja, jeg deler bolig med andre voksne, for eksempel utleier, veinn, søsken eller lignende'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker bor alene med barn/gravid', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borAleneMedBarnEllerGravid);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('bruker bor alene med barn/gravid og skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(ESøkerDelerBolig.borAleneMedBarnEllerGravid);
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      );

      expect(skalGifteSegEllerBliSamboer?.verdi).toBeTruthy;

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(samboerDetaljer).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
      expect(datoFlyttetFraHverandre).toBeUndefined();
    });

    test('tidligere samboer er fortsatt registrert på brukers adresse', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, men en tidligere samboer er fortsatt registrert på adressen min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, false),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
      );
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, men en tidligere samboer er fortsatt registrert på adressen min'
      );

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(datoFlyttetFraHverandre?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(skalGifteSegEllerBliSamboer?.verdi).toBe(false);

      expect(datoSkalGifteSegEllerBliSamboer).toBeUndefined();
      expect(vordendeSamboerEktefelle).toBeUndefined();
      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
    });

    test('tidligere samboer er fortsatt registrert på brukers adresse og bruker skal gifte seg', () => {
      const hovedSpørsmål = lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, men en tidligere samboer er fortsatt registrert på adressen min',
      });
      const søknad = lagSøknadOvergangsstønad({
        bosituasjon: lagUtfyltBosituasjon(hovedSpørsmål, true),
      });
      const sanertSøknad = sanerBosituasjonSteg(søknad, søknad.bosituasjon);
      const {
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoFlyttetSammenMedSamboer,
        datoSkalGifteSegEllerBliSamboer,
        datoFlyttetFraHverandre,
        samboerDetaljer,
        vordendeSamboerEktefelle,
      } = sanertSøknad.bosituasjon;

      expect(delerBoligMedAndreVoksne.spørsmålid).toBe(EBosituasjon.delerBoligMedAndreVoksne);
      expect(delerBoligMedAndreVoksne.svarid).toBe(
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
      );
      expect(delerBoligMedAndreVoksne.label).toBe('Deler du bolig med andre voksne?');
      expect(delerBoligMedAndreVoksne.verdi).toBe(
        'Nei, men en tidligere samboer er fortsatt registrert på adressen min'
      );

      expect(samboerDetaljer?.navn?.verdi).toBe('Ola Nordmann');
      expect(samboerDetaljer?.ident?.verdi).toBe('12345678910');
      expect(samboerDetaljer?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(samboerDetaljer?.kjennerIkkeIdent).toBeFalsy;

      expect(skalGifteSegEllerBliSamboer?.verdi).toBe(true);

      expect(datoFlyttetFraHverandre?.verdi).toBe(isoDatoEnMånedTilbake);

      expect(datoSkalGifteSegEllerBliSamboer?.verdi).toBe(isoDatoEnMånedFrem);

      expect(vordendeSamboerEktefelle?.navn?.verdi).toBe('Kari Nordmann');
      expect(vordendeSamboerEktefelle?.ident?.verdi).toBe('23456789012');
      expect(vordendeSamboerEktefelle?.fødselsdato?.verdi).toBe(isoDatoEnMånedTilbake);
      expect(vordendeSamboerEktefelle?.kjennerIkkeIdent).toBeFalsy();

      expect(datoFlyttetSammenMedSamboer).toBeUndefined();
    });
  });
});
