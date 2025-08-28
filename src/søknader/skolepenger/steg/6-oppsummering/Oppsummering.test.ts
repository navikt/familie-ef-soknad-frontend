import { mockGet, mockMellomlagretSøknadSkolepenger, mockPost } from '../../../../test/axios';
import { describe, expect, test, vi } from 'vitest';
import { navigerTilStegSkolepenger } from '../../../../test/aksjoner';
import {
  lagBooleanFelt,
  lagDokumentasjon,
  lagIBarn,
  lagPeriode,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagTekstfelt,
} from '../../../../test/domeneUtils';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'skolepenger')),
      post: vi.fn((url: string) => mockPost(url, 'skolepenger')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Oppsumering-Steg for skolepenger', () => {
  test('Skal navigere til Oppsumering-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadSkolepenger('/skolepenger/oppsummering');
    const { screen } = await navigerTilStegSkolepenger();

    expect(screen.getByRole('heading', { level: 2, name: 'Oppsummering' })).toBeInTheDocument();
  });

  test('Initielle elementer er til stede', async () => {
    mockMellomlagretSøknadSkolepenger('/skolepenger/oppsummering');
    const { screen } = await navigerTilStegSkolepenger();

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
    expect(screen.getByRole('button', { name: 'Utdanningen din' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  test('Gjennomgang hele søknad', async () => {
    mockMellomlagretSøknadSkolepenger(
      '/skolepenger/oppsummering',
      {},
      {
        adresseopplysninger: undefined,
        bosituasjon: {
          delerBoligMedAndreVoksne: lagSpørsmålFelt({
            label: 'Deler du bolig med andre voksne?',
            spørsmålid: 'delerBoligMedAndreVoksne',
            svarid: 'delerBoligMedAndreVoksne',
            verdi:
              'Ja, jeg deler bolig med andre voksne, for eksempel utleier, venn, søsken eller egne foreldre',
          }),
          skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
            label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
            spørsmålid: 'skalGifteSegEllerBliSamboer',
            svarid: 'NEI',
            verdi: false,
          }),
        },
        dokumentasjonsbehov: [
          lagDokumentasjon({
            beskrivelse: 'utdanning.label.utgifter.dokumentasjon',
            harSendtInn: false,
            id: 'UTGIFTER_UTDANNING',
            label: 'Utgifter til skolepenger',
            spørsmålid: 'semesteravgift',
            svarid: 'tarUtdanning',
            tittel: 'utdanning.label.utgifter',
          }),
          lagDokumentasjon({
            beskrivelse: 'dokumentasjon.utdanning.beskrivelse.skolepenger',
            harSendtInn: false,
            id: 'UTDANNING',
            label: 'Dokumentasjon på utdanningen du tar eller skal ta',
            spørsmålid: 'hvaErDinArbeidssituasjon',
            svarid: 'tarUtdanning',
            tittel: 'dokumentasjon.utdanning.tittel',
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
              alder: lagTekstfelt({ label: 'Alder', verdi: '4' }),
              forelder: {
                hvorforIkkeOppgi: {
                  label: 'Hvorfor kan du ikke oppgi den andre forelderen?',
                  spørsmålid: 'hvorforIkkeOppgi',
                  svarid: 'annet',
                  verdi: 'Annet',
                },
                ikkeOppgittAnnenForelderBegrunnelse: {
                  label: 'Hvorfor kan du ikke oppgi den andre forelderen?',
                  verdi: 'Veit ikke hvem det er',
                },
                kanIkkeOppgiAnnenForelderFar: {
                  label: 'Jeg kan ikke oppgi den andre forelderen',
                  verdi: true,
                },
              },
              fødselsdato: {
                label: 'Fødselsdato',
                verdi: '2021-05-09',
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
              navn: { label: 'Navn', verdi: 'RAKRYGGET OVERSKRIFT' },
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
            sivilstand: 'UGIFT',
            statsborgerskap: 'NORGE',
          },
        },
        sivilstatus: {
          datoEndretSamvær: undefined,
          datoFlyttetFraHverandre: undefined,
          datoForSamlivsbrudd: undefined,
          erUformeltGift: {
            label: 'Er du gift uten at det er registrert i folkeregisteret i Norge?',
            spørsmålid: 'erUformeltGift',
            svarid: 'NEI',
            verdi: false,
          },
          erUformeltSeparertEllerSkilt: {
            label:
              'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
            spørsmålid: 'erUformeltSeparertEllerSkilt',
            svarid: 'NEI',
            verdi: false,
          },
          tidligereSamboerDetaljer: undefined,
          årsakEnslig: lagSpørsmålFelt({
            label: 'Hvorfor er du alene med barn?',
            spørsmålid: 'årsakEnslig',
            svarid: 'aleneFraFødsel',
            verdi: 'Jeg er alene med barn fra fødsel',
          }),
        },
        søkerBorPåRegistrertAdresse: {
          label: 'Bor du på denne adressen?',
          spørsmålid: 'søkerBorPåRegistrertAdresse',
          svarid: 'JA',
          verdi: true,
        },
        utdanning: {
          eksamensgebyr: {
            label: 'Eksamensgebyr',
            verdi: '10',
          },
          harTattUtdanningEtterGrunnskolen: {
            label: 'Har du tatt utdanning etter grunnskolen?',
            verdi: false,
          },
          heltidEllerDeltid: {
            label: 'Er utdanningen på heltid eller deltid?',
            spørsmålid: 'heltidEllerDeltid',
            svarid: 'heltid',
            verdi: 'Heltid',
          },
          id: '22abcff7-6ab3-4220-aa9d-7cbbc6fbe56e',
          linjeKursGrad: { label: 'Linje / kurs / grad', verdi: 'Sykepleier' },
          målMedUtdanning: {
            label: 'Hva er målet med utdanningen?',
            verdi: 'Å få en utdanning',
          },
          offentligEllerPrivat: {
            label: 'Er utdanningen offentlig eller privat?',
            spørsmålid: 'offentligEllerPrivat',
            svarid: 'offentlig',
            verdi: 'Offentlig',
          },
          periode: lagPeriode({
            fra: { label: 'Fra', verdi: '2025-08-01' },
            til: { label: 'Til', verdi: '2025-08-31' },
            label: 'Når skal du være elev/student?',
          }),
          semesteravgift: { label: 'Semesteravgift', verdi: '640' },
          skoleUtdanningssted: { label: 'Skole / utdanningssted', verdi: 'UIO' },
          studieavgift: { label: 'Studieavgift', verdi: '0' },
        },
      }
    );
    const { screen } = await navigerTilStegSkolepenger();

    expect(screen.getAllByText('Ja')).toHaveLength(4);
    expect(screen.getAllByText('Nei')).toHaveLength(4);
    expect(screen.getAllByText('RAKRYGGET OVERSKRIFT')).toHaveLength(3);

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
    // Ja
    expect(
      screen.getByText('Er du gift uten at det er registrert i folkeregisteret i Norge?')
    ).toBeInTheDocument();
    // Nei
    expect(
      screen.getByText(
        'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?'
      )
    ).toBeInTheDocument();
    // Nei
    expect(screen.getByText('Hvorfor er du alene med barn?')).toBeInTheDocument();
    expect(screen.getByText('Jeg er alene med barn fra fødsel')).toBeInTheDocument();
    expect(screen.getByText('Oppholder du og barnet/barna dere i Norge?')).toBeInTheDocument();
    // Ja
    expect(screen.getByText('Har du oppholdt deg i Norge de siste 5 årene?')).toBeInTheDocument();
    // Ja

    //Bosituasjonen din
    expect(screen.getByRole('button', { name: 'Bosituasjonen din' })).toBeInTheDocument();
    expect(screen.getByText('Deler du bolig med andre voksne?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, jeg deler bolig med andre voksne, for eksempel utleier, venn, søsken eller egne foreldre'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Har du konkrete planer om å gifte deg eller bli samboer?')
    ).toBeInTheDocument();
    // Nei

    //Barna dine
    expect(screen.getByRole('button', { name: 'Barna dine' })).toBeInTheDocument();
    expect(screen.getByText('Navn')).toBeInTheDocument();
    // Rakrygget overskrift
    expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
    expect(screen.getByText('27870998401')).toBeInTheDocument();
    expect(screen.getByText('Alder')).toBeInTheDocument();
    // 4
    expect(screen.getByText('Har barnet samme adresse som deg?')).toBeInTheDocument();
    // Ja

    //Den andre forelderen og samvær
    expect(
      screen.getByRole('button', { name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
    expect(screen.getByText('Hvorfor kan du ikke oppgi den andre forelderen?')).toBeInTheDocument();
    expect(screen.getByText('Veit ikke hvem det er')).toBeInTheDocument();

    //Utdanningen din
    expect(screen.getByRole('button', { name: 'Utdanningen din' })).toBeInTheDocument();
    expect(screen.getByText('Utdanningen du tar eller skal ta')).toBeInTheDocument();
    expect(screen.getByText('Skole / utdanningssted')).toBeInTheDocument();
    expect(screen.getByText('UIO')).toBeInTheDocument();
    expect(screen.getByText('Linje / kurs / grad')).toBeInTheDocument();
    expect(screen.getByText('Sykepleier')).toBeInTheDocument();
    expect(screen.getByText('Er utdanningen offentlig eller privat?')).toBeInTheDocument(); // Nei
    expect(screen.getByText('Offentlig')).toBeInTheDocument();
    expect(screen.getByText('Fra')).toBeInTheDocument();
    expect(screen.getByText('2025-08-01')).toBeInTheDocument();
    expect(screen.getByText('Til')).toBeInTheDocument();
    expect(screen.getByText('2025-08-31')).toBeInTheDocument();
    expect(screen.getByText('Er utdanningen på heltid eller deltid?')).toBeInTheDocument();
    expect(screen.getByText('Heltid')).toBeInTheDocument();
    expect(screen.getByText('Hva er målet med utdanningen?')).toBeInTheDocument();
    expect(screen.getByText('Å få en utdanning')).toBeInTheDocument();
    expect(screen.getByText('Semesteravgift')).toBeInTheDocument();
    expect(screen.getByText('640')).toBeInTheDocument();
    expect(screen.getByText('Studieavgift')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Eksamensgebyr')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Har du tatt utdanning etter grunnskolen?')).toBeInTheDocument();
    // Nei

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });
});
