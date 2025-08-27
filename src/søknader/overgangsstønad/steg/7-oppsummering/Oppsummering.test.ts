import { mockGet, mockMellomlagretSøknadOvergangsstønad, mockPost } from '../../../../test/axios';
import { describe, expect, test, vi } from 'vitest';
import { navigerTilStegOvergangsstønad } from '../../../../test/aksjoner';
import {
  lagBooleanFelt,
  lagDokumentasjon,
  lagIBarn,
  lagPeriode,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagTekstfelt,
  lagUtlandsopphold,
} from '../../../../test/domeneUtils';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'overgangsstonad')),
      post: vi.fn((url: string) => mockPost(url, 'overgangsstonad')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Oppsumering-Steg for overgangsstønad', () => {
  test('Skal navigere til Oppsumering-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/oppsummering');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByRole('heading', { level: 2, name: 'Oppsummering' })).toBeInTheDocument();
  });

  test('Initielle elementer er til stede', async () => {
    mockMellomlagretSøknadOvergangsstønad('/oppsummering');
    const { screen } = await navigerTilStegOvergangsstønad();

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
    expect(
      screen.getByRole('button', { name: 'Arbeid, utdanning og andre aktiviteter' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mer om situasjonen din' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  test('Gjennomgang hele søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/oppsummering',
      {},
      {
        adresseopplysninger: {
          harMeldtAdresseendring: {
            label: 'Har du meldt adresseendring til Folkeregisteret?',
            spørsmålid: 'harMeldtAdresseendring',
            svarid: 'JA',
            verdi: true,
          },
        },
        aktivitet: {
          arbeidssøker: {
            hvorØnskerSøkerArbeid: {
              label: 'Hvor ønsker du å søke arbeid?',
              verdi: 'Kun i bodistriktet mitt, ikke mer enn 1 times reisevei hver vei',
            },
            kanBegynneInnenEnUke: {
              label: 'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
              spørsmålid: 'kanBegynneInnenEnUke',
              svarid: 'NEI',
              verdi: false,
            },
            registrertSomArbeidssøkerNav: {
              label: 'Er du registrert som arbeidssøker hos Nav?',
              spørsmålid: 'registrertSomArbeidssøkerNav',
              svarid: 'NEI',
              verdi: false,
            },
            villigTilÅTaImotTilbudOmArbeid: {
              label: 'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
              spørsmålid: 'villigTilÅTaImotTilbudOmArbeid',
              svarid: 'NEI',
              verdi: false,
            },
            ønskerSøker50ProsentStilling: {
              label: 'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
              spørsmålid: 'ønskerSøker50ProsentStilling',
              svarid: 'NEI',
              verdi: false,
            },
          },
          hvaErDinArbeidssituasjon: {
            label: 'Hvordan er situasjonen din?',
            spørsmålid: 'hvaErDinArbeidssituasjon',
            svarid: ['erArbeidssøker'],
            verdi: ['Jeg er arbeidssøker'],
            alternativer: [],
          },
        },
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
            beskrivelse: 'dokumentasjon.meldtAdresseendring.beskrivelse',
            harSendtInn: false,
            id: 'MELDT_ADRESSEENDRING',
            label: 'Dokumentasjon på adresseendring',
            spørsmålid: 'harMeldtAdresseendring',
            svarid: 'JA',
            tittel: 'dokumentasjon.meldtAdresseendring.tittel',
          }),
          lagDokumentasjon({
            beskrivelse: 'dokumentasjon.ikke.villig.til.arbeid.beskrivelse',
            harSendtInn: false,
            id: 'IKKE_VILLIG_TIL_ARBEID',
            label: 'Dokumentasjon som beskriver grunnen til at du ikke kan ta ethvert arbeid',
            spørsmålid: 'villigTilÅTaImotTilbudOmArbeid',
            svarid: 'NEI',
            tittel: 'dokumentasjon.ikke.villig.til.arbeid.tittel',
          }),
          lagDokumentasjon({
            beskrivelse: 'dokumentasjon.syk-dinSituasjon.beskrivelse',
            harSendtInn: false,
            id: 'SYKDOM',
            label: 'Dokumentasjon på at du er syk',
            spørsmålid: 'gjelderDetteDeg',
            svarid: 'erSyk',
            tittel: 'dokumentasjon.syk-dinSituasjon.tittel',
          }),
          lagDokumentasjon({
            harSendtInn: false,
            id: 'ARBEIDSFORHOLD_OPPSIGELSE',
            label: 'Dokumentasjon på arbeidsforholdet og årsaken til at du sluttet',
            spørsmålid: 'sagtOppEllerRedusertStilling',
            svarid: 'sagtOpp',
            tittel: 'dokumentasjon.arbeidsforhold-oppsigelse.tittel',
          }),
        ],
        harBekreftet: true,
        locale: '',
        medlemskap: {
          oppholdsland: {
            label: 'Hvor oppholder du og barnet/barna dere?',
            spørsmålid: 'oppholdsland',
            svarid: 'BEL',
            verdi: 'Belgia',
          },
          perioderBoddIUtlandet: [
            lagUtlandsopphold({
              id: '0250d22f-3895-4446-8e00-cca5133a9874',
              adresseEøsLand: {
                label: 'Hva er den siste adressen du bodde på i Belgia?',
                verdi: 'Belgia belgias vei 120',
              },
              begrunnelse: { label: 'Hvorfor oppholdt du deg i Belgia?', verdi: 'Er fra belgia' },
              erEøsLand: true,
              land: {
                label: 'I hvilket land oppholdt du deg i?',
                spørsmålid: 'utenlandsoppholdLand',
                svarid: 'BEL',
                verdi: 'Belgia',
              },
              periode: lagPeriode({
                label: 'Når oppholdt du deg i utlandet?',
                fra: { label: 'Fra', verdi: '2024-08-01' },
                til: { label: 'Til', verdi: '2025-08-25' },
              }),
              personidentEøsLand: {
                label: 'Hva er id-nummeret ditt i Belgia?',
                verdi: '123456789',
              },
            }),
          ],
          søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
            'Har du oppholdt deg i Norge de siste 5 årene?',
            false
          ),
          søkerOppholderSegINorge: lagBooleanFelt(
            'Oppholder du og barnet/barna dere i Norge?',
            false
          ),
        },
        merOmDinSituasjon: {
          begrunnelseSagtOppEllerRedusertStilling: {
            label: 'Hvorfor sa du opp?',
            verdi: 'Ble syk, flyttet til Belgia',
          },
          datoSagtOppEllerRedusertStilling: { label: 'Når sa du opp?', verdi: '2024-08-01' },
          gjelderDetteDeg: {
            alternativer: [
              'Jeg er syk',
              'Barnet mitt er sykt',
              'Jeg har søkt om barnepass, men ikke fått plass enda',
              'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer',
              'Nei',
            ],
            label: 'Gjelder noe av dette deg?',
            spørsmålid: 'gjelderDetteDeg',
            svarid: ['erSyk'],
            verdi: ['Jeg er syk'],
          },
          sagtOppEllerRedusertStilling: {
            label: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene?',
            spørsmålid: 'sagtOppEllerRedusertStilling',
            svarid: 'sagtOpp',
            verdi:
              'Ja, jeg har sagt opp jobben eller tatt frivillig permisjon (ikke foreldrepermisjon)',
          },
          søkerFraBestemtMåned: {
            label: 'Søker du overgangsstønad fra en bestemt måned?',
            spørsmålid: 'søkerFraBestemtMåned',
            svarid: 'ja',
            verdi: true,
          },
          søknadsdato: {
            label: 'Jeg søker overgangsstønad fra og med',
            verdi: '2024-08-01T12:00:00.000Z',
          },
        },
        person: {
          barn: [
            lagIBarn({
              alder: lagTekstfelt({ label: 'Alder', verdi: '4' }),
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
                flyttetFra: { label: 'Når flyttet dere fra hverandre?', verdi: '2024-08-01' },
                fødselsdato: { label: 'Fødselsdato', verdi: '1970-08-11' },
                harAnnenForelderSamværMedBarn: {
                  label: 'Har den andre forelderen samvær med [0]?',
                  spørsmålid: 'harAnnenForelderSamværMedBarn',
                  svarid: 'nei',
                  verdi: 'Nei, den andre forelderen har ikke samvær med barnet',
                },
                hvorMyeSammen: {
                  spørsmålid: 'hvorMyeSammen',
                  svarid: 'kunNårLeveres',
                  label: 'Hvor mye er du sammen med den andre forelderen til [0]?',
                  verdi: 'Vi møtes ikke',
                },
                id: '4de477a1-9880-4c83-8c4e-61eede679922',
                navn: { label: 'Navn', verdi: 'Pappa pappasen' },
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
            sivilstand: 'UGIFT',
            statsborgerskap: 'NORGE',
          },
        },
        sivilstatus: {
          datoEndretSamvær: undefined,
          datoFlyttetFraHverandre: undefined,
          datoForSamlivsbrudd: lagTekstfelt({
            label: 'Dato for samlivsbrudd',
            verdi: '2024-08-01',
          }),
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
          årsakEnslig: lagSpørsmålFelt({
            label: 'Hvorfor er du alene med barn?',
            spørsmålid: 'årsakEnslig',
            svarid: 'samlivsbruddForeldre',
            verdi: 'Samlivsbrudd med den andre forelderen',
          }),
        },
        søkerBorPåRegistrertAdresse: {
          label: 'Bor du på denne adressen?',
          spørsmålid: 'søkerBorPåRegistrertAdresse',
          svarid: 'NEI',
          verdi: false,
        },
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getAllByText('Ja')).toHaveLength(5);
    expect(screen.getAllByText('Nei')).toHaveLength(11);
    expect(screen.getAllByText('4')).toHaveLength(2);
    expect(screen.getAllByText('2024-08-01')).toHaveLength(4);
    expect(screen.getAllByText('Belgia')).toHaveLength(2);
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
    // Nei
    expect(
      screen.getByText('Har du meldt adresseendring til Folkeregisteret?')
    ).toBeInTheDocument();
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
    expect(screen.getByText('Samlivsbrudd med den andre forelderen')).toBeInTheDocument();
    expect(screen.getByText('Dato for samlivsbrudd')).toBeInTheDocument();
    // 2024-08-01
    expect(screen.getByText('Oppholder du og barnet/barna dere i Norge?')).toBeInTheDocument();
    // Nei
    expect(screen.getByText('Hvor oppholder du og barnet/barna dere?')).toBeInTheDocument();
    // Belgia
    expect(screen.getByText('Har du oppholdt deg i Norge de siste 5 årene?')).toBeInTheDocument();
    // Nei
    expect(screen.getByText('Utenlandsperiode')).toBeInTheDocument();
    expect(screen.getByText('Fra')).toBeInTheDocument();
    // 2024-08-01
    expect(screen.getByText('Til')).toBeInTheDocument();
    expect(screen.getByText('2025-08-25')).toBeInTheDocument();
    expect(screen.getByText('Hvorfor oppholdt du deg i Belgia?')).toBeInTheDocument();
    expect(screen.getByText('Er fra belgia')).toBeInTheDocument();
    expect(screen.getByText('I hvilket land oppholdt du deg i?')).toBeInTheDocument();
    // Belgia
    expect(screen.getByText('Hva er id-nummeret ditt i Belgia?')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('Hva er den siste adressen du bodde på i Belgia?')).toBeInTheDocument();
    expect(screen.getByText('Belgia belgias vei 120')).toBeInTheDocument();

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
    expect(screen.getByText('Navn på annen forelder')).toBeInTheDocument();
    expect(screen.getByText('Pappa pappasen')).toBeInTheDocument();
    expect(screen.getByText('Fødselsdato')).toBeInTheDocument();
    expect(screen.getByText('1970-08-11')).toBeInTheDocument();
    expect(
      screen.getByText('Bor RAKRYGGET OVERSKRIFTs andre forelder i Norge?')
    ).toBeInTheDocument();
    // Ja
    expect(
      screen.getByText('Har den andre forelderen samvær med RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Nei, den andre forelderen har ikke samvær med barnet')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bor du og den andre forelderen til RAKRYGGET OVERSKRIFT i samme hus, blokk, gårdstun, kvartal eller vei/gate?'
      )
    ).toBeInTheDocument();
    // Nei
    expect(
      screen.getByText('Har du bodd sammen med den andre forelderen til RAKRYGGET OVERSKRIFT før?')
    ).toBeInTheDocument();
    // Ja
    expect(screen.getByText('Når flyttet dere fra hverandre?')).toBeInTheDocument();
    // 2024-08-01
    expect(
      screen.getByText('Hvor mye er du sammen med den andre forelderen til RAKRYGGET OVERSKRIFT?')
    ).toBeInTheDocument();
    expect(screen.getByText('Vi møtes ikke')).toBeInTheDocument();

    //Arbeidssituasjonen din
    expect(
      screen.getByRole('button', { name: 'Arbeid, utdanning og andre aktiviteter' })
    ).toBeInTheDocument();
    expect(screen.getByText('Hvordan er situasjonen din?')).toBeInTheDocument();
    expect(screen.getByText('Jeg er arbeidssøker')).toBeInTheDocument();
    expect(screen.getByText('Når du er arbeidssøker')).toBeInTheDocument();
    expect(screen.getByText('Er du registrert som arbeidssøker hos Nav?')).toBeInTheDocument();
    // Nei
    expect(
      screen.getByText('Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?')
    ).toBeInTheDocument();
    // Nei
    expect(
      screen.getByText('Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?')
    ).toBeInTheDocument(); // Nei
    expect(screen.getByText('Hvor ønsker du å søke arbeid?')).toBeInTheDocument();
    expect(
      screen.getByText('Kun i bodistriktet mitt, ikke mer enn 1 times reisevei hver vei')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?')
    ).toBeInTheDocument();
    // Nei

    //Mer om situasjonen din
    expect(screen.getByRole('button', { name: 'Mer om situasjonen din' })).toBeInTheDocument();
    expect(screen.getByText('Gjelder noe av dette deg?')).toBeInTheDocument();
    expect(screen.getByText('Jeg er syk')).toBeInTheDocument();
    expect(
      screen.getByText('Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ja, jeg har sagt opp jobben eller tatt frivillig permisjon (ikke foreldrepermisjon)'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Hvorfor sa du opp?')).toBeInTheDocument();
    expect(screen.getByText('Ble syk, flyttet til Belgia')).toBeInTheDocument();
    expect(screen.getByText('Når sa du opp?')).toBeInTheDocument();
    // 2024-08-01
    expect(screen.getByText('Søker du overgangsstønad fra en bestemt måned?')).toBeInTheDocument();
    // Ja

    expect(screen.getByText('Jeg søker overgangsstønad fra og med')).toBeInTheDocument();
    expect(screen.getByText('01.08.2024')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });
});
