import { mockGet, mockMellomlagretSøknadBarnetilsyn, mockPost } from '../../../../test/axios';
import { describe, expect, test, vi } from 'vitest';
import { navigerTilStegBarnetilsyn } from '../../../../test/aksjoner';
import {
  lagBarnepass,
  lagBooleanFelt,
  lagDokumentasjon,
  lagIBarn,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagTekstfelt,
} from '../../../../test/domeneUtils';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'barnetilsyn')),
      post: vi.fn((url: string) => mockPost(url, 'barnetilsyn')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Oppsumering-Steg for barnetilsyn', () => {
  test('Skal navigere til Oppsumering-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadBarnetilsyn('/barnetilsyn/oppsummering');
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByRole('heading', { level: 2, name: 'Oppsummering' })).toBeInTheDocument();
  });

  test('Initielle elementer er til stede', async () => {
    mockMellomlagretSøknadBarnetilsyn('/barnetilsyn/oppsummering');
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByText(
        'Les gjennom oppsummeringen før du sender inn søknaden. Hvis du trenger å gjøre endringer, kan du gå tilbake.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Om deg' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bosituasjonen din' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Barna dine' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Arbeidssituasjonen din' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Om barnepassordningen' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  test('Gjennomgang hele søknad', async () => {
    mockMellomlagretSøknadBarnetilsyn(
      '/barnetilsyn/oppsummering',
      {},
      {
        adresseopplysninger: undefined,
        aktivitet: {
          arbeidsforhold: [
            {
              ansettelsesforhold: lagSpørsmålFelt({
                label: 'Hva slags ansettelsesforhold har du?',
                spørsmålid: 'ansettelsesforhold',
                svarid: 'fast',
                verdi: 'Fast stilling',
              }),
              id: 'a6c9a1ed-ee72-4ae8-96a1-9122750839e6',
              navn: lagTekstfelt({ label: 'Navn på arbeidssted', verdi: 'Nav' }),
            },
          ],
          erIArbeid: lagSpørsmålFelt({
            label: 'Er du i arbeid?',
            spørsmålid: 'erDuIArbeid',
            svarid: 'JA',
            verdi: 'Ja',
          }),
          hvaErDinArbeidssituasjon: {
            label: 'Hvordan er situasjonen din?',
            spørsmålid: 'hvaErDinArbeidssituasjon',
            svarid: ['erArbeidstakerOgEllerLønnsmottakerFrilanser'],
            verdi: ['Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)'],
            alternativer: [],
          },
        },
        bosituasjon: {
          delerBoligMedAndreVoksne: lagSpørsmålFelt({
            label: 'Deler du bolig med andre voksne?',
            spørsmålid: 'delerBoligMedAndreVoksne',
            svarid: 'borAleneMedBarnEllerGravid',
            verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
          }),
          skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
            label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
            spørsmålid: 'skalGifteSegEllerBliSamboer',
            svarid: 'NEI',
            verdi: false,
          }),
        },
        datoPåbegyntSøknad: '2025-08-21',
        dokumentasjonsbehov: [
          lagDokumentasjon({
            barneid: undefined,
            barnepassid: undefined,
            beskrivelse: 'dokumentasjon.begrunnelse.beskrivelse',
            harSendtInn: false,
            id: 'SAMLIVSBRUDD',
            label: 'Bekreftelse på samlivsbrudd med den andre forelderen',
            spørsmålid: 'årsakEnslig',
            svarid: 'samlivsbruddForeldre',
            tittel: 'dokumentasjon.begrunnelse.tittel',
          }),
          lagDokumentasjon({
            barneid: 'ab15b4b6-c530-4e9f-a772-08c735c3cdd2',
            barnepassid: undefined,
            harSendtInn: false,
            id: 'SAMVÆRSAVTALE',
            label: 'Samværsavtale ',
            spørsmålid: 'harDereSkriftligSamværsavtale',
            svarid: 'jaKonkreteTidspunkter',
            tittel: 'dokumentasjon.samværsavtale.tittel',
          }),
          lagDokumentasjon({
            barneid: 'ab15b4b6-c530-4e9f-a772-08c735c3cdd2',
            barnepassid: '44eeb002-b4e4-40e9-94b3-175c218836d4',
            beskrivelse: 'dokumentasjon.privatBarnepass.beskrivelse',
            harSendtInn: false,
            id: 'AVTALE_BARNEPASSER',
            label: 'Avtalen du har med barnepasseren',
            spørsmålid: 'hvaSlagsBarnepassOrdning',
            svarid: 'privat',
            tittel: 'dokumentasjon.privatBarnepass.tittel',
          }),
        ],
        harBekreftet: true,
        locale: '',
        medlemskap: {
          oppholdsland: undefined,
          perioderBoddIUtlandet: undefined,
          søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
            'Har du oppholdt deg i Norge de siste 5 årene?',
            true
          ),
          søkerOppholderSegINorge: lagBooleanFelt(
            'Oppholder du og barnet/barna dere i Norge?',
            true
          ),
        },
        person: {
          barn: [
            lagIBarn({
              alder: lagTekstfelt({ label: 'Alder', verdi: '16' }),
              barnepass: lagBarnepass({
                årsakBarnepass: {
                  label: 'Hvorfor trenger RAKRYGGET OVERSKRIFT pass?',
                  spørsmålid: 'årsakBarnepass',
                  svarid: 'trengerMerPassEnnJevnaldrede',
                  verdi:
                    'Barnet har behov for vesentlig mer pass enn det som er vanlig for jevnaldrende',
                },
                barnepassordninger: [
                  {
                    belop: { label: 'Beløp pr måned (ikke inkludert kost)', verdi: '1000' },
                    hvaSlagsBarnepassOrdning: {
                      label: 'Hva slags barnepassordning har RAKRYGGET OVERSKRIFT?',
                      spørsmålid: 'hvaSlagsBarnepassOrdning',
                      svarid: 'privat',
                      verdi: 'Dagmamma eller annen privat ordning',
                    },
                    id: 'b10ce530-fbb0-4cf0-a1c3-acbd90f10bd7',
                    navn: {
                      label:
                        'Navn på barnepassordningen eller personen som passer RAKRYGGET OVERSKRIFT',
                      verdi: 'Bestemor AS',
                    },
                    periode: {
                      fra: { label: 'Startdato', verdi: '2025-08-01' },
                      label: 'I hvilken periode har RAKRYGGET OVERSKRIFT denne barnepassordningen?',
                      til: { label: 'Sluttdato', verdi: '2025-08-31' },
                    },
                  },
                ],
              }),
              forelder: {
                boddSammenFør: {
                  spørsmålid: 'boddSammenFør',
                  svarid: 'JA',
                  label: 'Har du bodd sammen med den andre forelderen til [0] før?',
                  verdi: true,
                },
                borAnnenForelderISammeHus: {
                  spørsmålid: 'borAnnenForelderISammeHus',
                  svarid: 'nei',
                  label:
                    'Bor du og den andre forelderen til [0] i samme hus, blokk, gårdstun, kvartal eller vei/gate?',
                  verdi: 'Nei',
                },
                borINorge: {
                  spørsmålid: 'borINorge',
                  svarid: 'JA',
                  label: 'Bor [0]s andre forelder i Norge?',
                  verdi: true,
                },
                flyttetFra: { label: 'Når flyttet dere fra hverandre?', verdi: '2025-08-01' },
                fraFolkeregister: true,
                harAnnenForelderSamværMedBarn: {
                  spørsmålid: 'harAnnenForelderSamværMedBarn',
                  svarid: 'jaIkkeMerEnnVanlig',
                  label: 'Har den andre forelderen samvær med [0]?',
                  verdi:
                    'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
                },
                harDereSkriftligSamværsavtale: {
                  spørsmålid: 'harDereSkriftligSamværsavtale',
                  svarid: 'jaKonkreteTidspunkter',
                  label: 'Har dere skriftlig samværsavtale for [0]?',
                  verdi: 'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
                },
                hvorMyeSammen: {
                  spørsmålid: 'hvorMyeSammen',
                  svarid: 'kunNårLeveres',
                  label: 'Hvor mye er du sammen med den andre forelderen til [0]?',
                  verdi: 'Vi møtes kun når barnet skal hentes eller leveres',
                },
                id: '4de477a1-9880-4c83-8c4e-61eede679922',
                ident: { label: 'Fødselsnummer eller d-nummer', verdi: '17817395406' },
                kanIkkeOppgiAnnenForelderFar: {
                  label: 'Jeg kan ikke oppgi den andre forelderen',
                  verdi: false,
                },
                navn: { label: 'Navn på den andre forelderen', verdi: 'GÅEN SKADE' },
              },
              fødselsdato: {
                label: 'Fødselsdato',
                verdi: '2009-07-27',
              },
              født: {
                label: 'Født',
                verdi: true,
                spørsmålid: '',
                svarid: '',
              },
              harAdressesperre: false,
              harSammeAdresse: { label: 'Har barnet samme adresse som deg?', verdi: true },
              id: '52655ac3-ede5-4ead-b12a-335bf9aac2d7',
              ident: {
                label: 'Fødselsnummer eller d-nummer',
                verdi: '27870998401',
              },
              medforelder: {
                label: 'Annen forelder',
                verdi: {
                  alder: 52,
                  død: false,
                  harAdressesperre: false,
                  ident: '17817395406',
                  navn: 'GÅEN SKADE',
                },
              },
              navn: { label: 'Navn', verdi: 'RAKRYGGET OVERSKRIFT' },
              skalHaBarnepass: { label: 'Søk om stønad til barnetilsyn for barnet', verdi: true },
            }),
          ],
          hash: '1234',
          søker: {
            adresse: {
              adresse: 'Mjosundvegen 351 H0101',
              postnummer: '6693',
              poststed: 'MJOSUNDET',
            },
            alder: 50,
            erStrengtFortrolig: false,
            fnr: '18877598140',
            forkortetNavn: 'POSITIV HAGE',
            sivilstand: 'GIFT',
            statsborgerskap: 'NORGE',
          },
        },
        sivilstatus: {
          datoEndretSamvær: undefined,
          datoFlyttetFraHverandre: undefined,
          datoForSamlivsbrudd: lagTekstfelt({
            label: 'Dato for samlivsbrudd',
            verdi: '2025-08-01',
          }),
          datoSøktSeparasjon: lagTekstfelt({
            label: 'Når søkte dere eller reiste sak?',
            verdi: '2025-08-01',
          }),
          harSøktSeparasjon: lagBooleanFelt(
            'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
            true
          ),
          tidligereSamboerDetaljer: undefined,
          årsakEnslig: lagSpørsmålFelt({
            label: 'Hvorfor er du alene med barn?',
            spørsmålid: 'årsakEnslig',
            svarid: 'samlivsbruddForeldre',
            verdi: 'Samlivsbrudd med den andre forelderen',
          }),
        },
        søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
          label: 'Bor du på denne adressen?',
          spørsmålid: 'søkerBorPåRegistrertAdresse',
          svarid: 'JA',
          verdi: true,
        }),
        søkerFraBestemtMåned: lagSpørsmålBooleanFelt({
          label: 'Søker du om stønad til barnetilsyn fra en bestemt måned? ',
          spørsmålid: 'søkerFraBestemtMåned',
          svarid: 'neiNavKanVurdere',
          verdi: false,
        }),
      }
    );
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getAllByText('Ja')).toHaveLength(9);
    expect(screen.getAllByText('2025-08-01')).toHaveLength(4);
    expect(screen.getAllByText('Nei')).toHaveLength(2);
    expect(screen.getAllByText('RAKRYGGET OVERSKRIFT')).toHaveLength(4);

    //Om deg
    expect(screen.getByRole('button', { name: 'Om deg' })).toBeInTheDocument();
    expect(screen.getByText('Fødselsnummer / d-nummer (11 siffer)')).toBeInTheDocument();
    expect(screen.getByText('18877598140')).toBeInTheDocument();
    expect(screen.getByText('Statsborgerskap')).toBeInTheDocument();
    expect(screen.getByText('NORGE')).toBeInTheDocument();
    expect(screen.getByText('Adresse')).toBeInTheDocument();
    expect(screen.getByText('Mjosundvegen 351 H0101')).toBeInTheDocument();
    expect(screen.getByText('6693 MJOSUNDET')).toBeInTheDocument();
    expect(screen.getByText('Bor du på denne adressen?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Hvorfor er du alene med barn?')).toBeInTheDocument();
    expect(screen.getByText('Samlivsbrudd med den andre forelderen')).toBeInTheDocument();
    expect(screen.getByText('Dato for samlivsbrudd')).toBeInTheDocument();
    expect(screen.getByText('Når søkte dere eller reiste sak?')).toBeInTheDocument();
    expect(screen.getByText('Oppholder du og barnet/barna dere i Norge?')).toBeInTheDocument();
    expect(screen.getByText('Har du oppholdt deg i Norge de siste 5 årene?')).toBeInTheDocument();

    //Bosituasjonen din
    expect(screen.getByRole('button', { name: 'Bosituasjonen din' })).toBeInTheDocument();
    expect(screen.getByText('Deler du bolig med andre voksne?')).toBeInTheDocument();
    expect(
      screen.getByText('Nei, jeg bor alene med barn eller jeg er gravid og bor alene')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du konkrete planer om å gifte deg eller bli samboer?')
    ).toBeInTheDocument();

    //Barna dine
    expect(screen.getByRole('button', { name: 'Barna dine' })).toBeInTheDocument();
    expect(screen.getByText('Navn')).toBeInTheDocument();
    expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
    expect(screen.getByText('27870998401')).toBeInTheDocument();
    expect(screen.getByText('Alder')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('Søk om stønad til barnetilsyn for barnet')).toBeInTheDocument();
    expect(screen.getByText('Har barnet samme adresse som deg?')).toBeInTheDocument();

    //Den andre forelderen og samvær
    expect(
      screen.getByRole('button', { name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
    expect(screen.getByText('Navn på annen forelder')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();
    expect(
      screen.getByText('Bor RAKRYGGET OVERSKRIFTs andre forelder i Norge?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har den andre forelderen samvær med RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har dere skriftlig samværsavtale for RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ja, og den beskriver når barnet er sammen med hver av foreldrene')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til RAKRYGGET OVERSKRIFT i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til RAKRYGGET OVERSKRIFT før?')
    ).toBeInTheDocument();
    expect(screen.getByText('Når flyttet dere fra hverandre?')).toBeInTheDocument();
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vi møtes kun når barnet skal hentes eller leveres')
    ).toBeInTheDocument();

    //Arbeidssituasjonen din
    expect(screen.getByRole('button', { name: 'Arbeidssituasjonen din' })).toBeInTheDocument();
    expect(screen.getByText('Er du i arbeid?')).toBeInTheDocument();
    expect(screen.getByText('Hvordan er situasjonen din?')).toBeInTheDocument();
    expect(
      screen.getByText('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)')
    ).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(screen.getByText('Navn på arbeidssted')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Hva slags ansettelsesforhold har du?')).toBeInTheDocument();
    expect(screen.getByText('Fast stilling')).toBeInTheDocument();

    //Om barnepassordningen
    expect(screen.getByRole('button', { name: 'Om barnepassordningen' })).toBeInTheDocument();
    expect(screen.getByText('Hvorfor trenger RAKRYGGET OVERSKRIFT pass?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Barnet har behov for vesentlig mer pass enn det som er vanlig for jevnaldrende'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Hva slags barnepassordning har RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(screen.getByText('Dagmamma eller annen privat ordning')).toBeInTheDocument();
    expect(
      screen.getByText('Navn på barnepassordningen eller personen som passer RAKRYGGET OVERSKRIFT')
    ).toBeInTheDocument();
    expect(screen.getByText('Bestemor AS')).toBeInTheDocument();
    expect(screen.getByText('Startdato')).toBeInTheDocument();
    expect(screen.getByText('Sluttdato')).toBeInTheDocument();
    expect(screen.getByText('2025-08-31')).toBeInTheDocument();
    expect(screen.getByText('Beløp pr måned (ikke inkludert kost)')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(
      screen.getByText('Søker du om stønad til barnetilsyn fra en bestemt måned?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nei, Nav kan vurdere fra hvilken måned jeg har rett til stønad')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });
});
