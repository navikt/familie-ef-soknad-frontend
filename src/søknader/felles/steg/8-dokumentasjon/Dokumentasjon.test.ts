import { describe, expect, test } from 'vitest';
import { mockGet, mockMellomlagretSøknadOvergangsstønad } from '../../../../test/axios';
import { navigerTilStegOvergangsstønad } from '../../../../test/aksjoner';
import { lagDokumentasjon } from '../../../../test/domeneUtils';
import {
  AdresseopplysningerDokumentasjon,
  AktivitetDokumentasjon,
  BarnasBostedDokumentasjon,
  BarnDokumentasjon,
  BarnetilsynDokumentasjon,
  BosituasjonDokumentasjon,
  OmDegDokumentasjon,
  SituasjonDokumentasjon,
} from '../../../../models/steg/dokumentasjon';
import { EArbeidssøker } from '../../../../models/steg/aktivitet/arbeidssøker';
import { ESvar } from '../../../../models/felles/spørsmålogsvar';
import { EAktivitet, EArbeidssituasjon } from '../../../../models/steg/aktivitet/aktivitet';
import { EUtdanning } from '../../../../models/steg/aktivitet/utdanning';
import {
  DinSituasjonType,
  ESagtOppEllerRedusertStilling,
  ESituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { EArbeidsgiver, EStilling } from '../../../../models/steg/aktivitet/arbeidsgiver';
import { EBarn } from '../../../../models/steg/barn';
import {
  EBarnepass,
  ETypeBarnepassOrdning,
  EÅrsakBarnepass,
} from '../../../barnetilsyn/models/barnepass';
import { EBosituasjon, ESøkerDelerBolig } from '../../../../models/steg/bosituasjon';
import { EForelder } from '../../../../models/steg/forelder';
import {
  EHarSkriftligSamværsavtale,
  ESkalBarnetBoHosSøker,
} from '../../../../models/steg/barnasbosted';
import { EBegrunnelse, ESivilstatusSøknadid } from '../../../../models/steg/omDeg/sivilstatus';
import { EAdresseopplysninger } from '../../../../models/steg/adresseopplysninger';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'overgangsstonad')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Dokumentasjons-Steg for overgangsstønad', () => {
  test('Skal navigere til dokumentasjon-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/dokumentasjon');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Last opp dokumentasjon' })
    ).toBeInTheDocument();
  });

  test('Initielle tekster er til stedet dersom det ikke er dokumentasjonsbehov', async () => {
    mockMellomlagretSøknadOvergangsstønad('/dokumentasjon');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText(
        'Det ser ikke ut til at du må sende inn noe dokumentasjon. Hvis vi likevel trenger dokumentasjon fra deg, tar vi kontakt.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Initielle tekster er til stedet ved dokumentasjonsbehov', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            beskrivelse: 'dokumentasjon.meldtAdresseendring.beskrivelse',
            harSendtInn: false,
            id: 'MELDT_ADRESSEENDRING',
            label: 'Dokumentasjon på adresseendring',
            spørsmålid: 'harMeldtAdresseendring',
            svarid: 'JA',
            tittel: 'dokumentasjon.meldtAdresseendring.tittel',
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må laste opp dokumentasjon som bekrefter opplysningene i søknaden. Du får raskere svar på søknaden din hvis vi har all dokumentasjon når vi starter behandlingen. Du kan bruke filformatene PDF, jpg og png.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Slik bruker du bilder som vedlegg til søknaden' })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Ta bilde av dokumentet med smarttelefon eller nettbrett')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Sjekk at dokumentet er lett å lese'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('Last opp bildene her'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Mangler du noe av dokumentasjonen? Da kan du sende inn det du har og ettersende resten.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Har du sendt inn denne dokumentasjonen til Nav tidligere? Da trenger du ikke å sende den på nytt.'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon på ikke villig til arbeid', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.IKKE_VILLIG_TIL_ARBEID,
            spørsmålid: EArbeidssøker.villigTilÅTaImotTilbudOmArbeid,
            svarid: ESvar.NEI,
            label: '',
            tittel: 'dokumentasjon.ikke.villig.til.arbeid.tittel',
            beskrivelse: 'dokumentasjon.ikke.villig.til.arbeid.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Dokumentasjon som beskriver grunnen til at du ikke kan ta ethvert arbeid')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Hvis det er helsemessige grunner som hindrer deg fra å ta ethvert arbeid, må du dokumentere det med legeattest'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon på at søker er syk', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AktivitetDokumentasjon.FOR_SYK_TIL_Å_JOBBE,
            spørsmålid: EArbeidssituasjon.erDuIArbeid,
            svarid: ESvar.NEI,
            label: '',
            tittel: 'dokumentasjon.syk-arbeid.tittel',
            beskrivelse: 'dokumentasjon.syk-arbeid.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på at du er syk')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen fra legen din må tydelig vise:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('når du ble syk'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('når legen din regner med at du vil bli frisk'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon om virksomheten som etableres', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AktivitetDokumentasjon.ETABLERER_VIRKSOMHET,
            spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
            svarid: EAktivitet.etablererEgenVirksomhet,
            label: '',
            tittel: 'dokumentasjon.etablererEgenVirksomhet.tittel',
            beskrivelse: 'dokumentasjon.etablererEgenVirksomhet.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Næringsfaglig vurdering av virksomheten du etablerer')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Får du ikke dagpenger mens du etablerer egen virksomhet, må du skaffe næringsfaglig vurdering fra kommunen eller fylkeskommunen. Du kan også bruke en annen faglig kompetanse.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon om utgifter til utdanning', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AktivitetDokumentasjon.UTGIFTER_UTDANNING,
            spørsmålid: EUtdanning.semesteravgift,
            svarid: EAktivitet.tarUtdanning,
            label: '',
            tittel: 'utdanning.label.utgifter',
            beskrivelse: 'utdanning.label.utgifter.dokumentasjon',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Utgifter til skolepenger')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon på utgiftene dine til studieavgift, semesteravgift og/eller eksamensgebyr.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Det dokumenterer du med faktura i ditt navn.'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon på utdanning', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AktivitetDokumentasjon.UTDANNING,
            spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
            svarid: EAktivitet.tarUtdanning,
            label: '',
            tittel: 'dokumentasjon.utdanning.tittel',
            beskrivelse: 'dokumentasjon.utdanning.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Dokumentasjon på utdanningen du tar eller skal ta')
    ).toBeInTheDocument();

    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen må vise:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('navn på studiested'))).toBeInTheDocument();
    expect(screen.getAllByText((tekst) => tekst.includes('navn på studie'))).toHaveLength(2);
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye du skal studere'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('perioden du skal studere'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Dokumentasjonen må vise tydelig hvem det gjelder.')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Får du allerede overgangsstønad og søker om å forlenge stønadsperioden fordi du har fått tilbud om studieplass? Da må dokumentasjonen også vise datoen du takket ja til tilbudet.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon arbeidskontrakt', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.ARBEIDSKONTRAKT,
            spørsmålid: ESituasjon.gjelderDetteDeg,
            svarid: EAktivitet.harFåttJobbTilbud,
            label: '',
            tittel: 'dokumentasjon.arbeidskontrakt.tittel',
            beskrivelse: 'dokumentasjon.arbeidskontrakt.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Du må legge ved arbeidskontrakt som viser at du har fått tilbud om jobb.')
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen må tydelig vise:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('navn på arbeidssted'))).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('stillingsprosent'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('datoen du begynner i jobben'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('datoen du fikk tilbudet'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon lærling', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AktivitetDokumentasjon.LÆRLING,
            spørsmålid: EArbeidsgiver.ansettelsesforhold,
            svarid: EStilling.lærling,
            label: '',
            tittel: 'dokumentasjon.lærling.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Lærlingkontrakt')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon terminbekreftelse', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnDokumentasjon.TERMINBEKREFTELSE,
            spørsmålid: EBarn.født,
            svarid: ESvar.NEI,
            label: '',
            tittel: 'dokumentasjon.terminbekreftelse.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Terminbekreftelse')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon faktura fra barnepassordning', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnetilsynDokumentasjon.FAKTURA_BARNEPASSORDNING,
            spørsmålid: EBarnepass.hvaSlagsBarnepassOrdning,
            label: '',
            svarid: ETypeBarnepassOrdning.barnehageOgLiknende,
            tittel: 'dokumentasjon.barnehageOgLiknende.tittel',
            beskrivelse: 'dokumentasjon.barnehageOgLiknende.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Faktura fra barnepassordningen for perioden du søker om nå')
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi må ha ny faktura for hvert barnehage-/skoleår. Det er ikke tilstrekkelig at du har levert faktura for tidligere år.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Fakturaen må stå i ditt navn, og utgifter til opphold må være spesifisert.')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Husk å legge ved tidligere fakturaer hvis du søker stønad tilbake i tid.')
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  }); //TODO sjekke etter opplastingsknapp

  test('Dokumentasjon avtale med barnepasser', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnetilsynDokumentasjon.AVTALE_BARNEPASSER,
            spørsmålid: EBarnepass.hvaSlagsBarnepassOrdning,
            label: '',
            svarid: ETypeBarnepassOrdning.privat,
            tittel: 'dokumentasjon.privatBarnepass.tittel',
            beskrivelse: 'dokumentasjon.privatBarnepass.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Avtalen du har med barnepasseren')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Avtalen må inneholde:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('ditt navn, fødseslnummer og adresse'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('barnepasserens navn og adresse'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('navn og fødselsnummer for barnet/barna som passes')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('perioden avtalen gjelder for'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('dager i uken og klokkeslett for barnepass'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('hvor mye du betaler for barnepass per måned, ikke inkludert kostpenger')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('signaturer fra deg og barnepasser'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon mer pass enn gjevnaldrede', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnetilsynDokumentasjon.TRENGER_MER_PASS_ENN_JEVNALDREDE,
            spørsmålid: EBarnepass.årsakBarnepass,
            label: '',
            svarid: EÅrsakBarnepass.trengerMerPassEnnJevnaldrede,
            tittel: 'dokumentasjon.trengerMerPassEnnJevnaldrede.tittel',
            beskrivelse: 'dokumentasjon.trengerMerPassEnnJevnaldrede.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText(
        'Dokumentasjon på at barnet ditt har behov for vesentlig mer pass enn det som er vanlig for jevnaldrende'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Det dokumenterer du med uttalelse fra lege, spesialist eller annet helsepersonell.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon barnepass utenom vanlig arbeidstid', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnetilsynDokumentasjon.ARBEIDSTID,
            spørsmålid: EBarnepass.årsakBarnepass,
            label: '',
            svarid: EÅrsakBarnepass.utenomVanligArbeidstid,
            tittel: 'dokumentasjon.barnepassRoterendeArbeidstid.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText(
        'Dokumentasjon på at du jobber turnus eller skift, og jobber på tider utenom vanlig arbeidstid'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon mye borte pga. jobb', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnetilsynDokumentasjon.ROTERENDE_ARBEIDSTID,
            spørsmålid: EBarnepass.årsakBarnepass,
            label: '',
            svarid: EÅrsakBarnepass.myeBortePgaJobb,
            tittel: 'dokumentasjon.barnepassArbeidstid.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText(
        'Dokumentasjon på at du må være borte fra hjemmet i lengre perioder på grunn av jobb'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon bor på ulike adresser', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BosituasjonDokumentasjon.BOR_PÅ_ULIKE_ADRESSER,
            spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
            svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
            label: '',
            tittel: 'dokumentasjon.ulikeAdresser.tittel',
            beskrivelse: 'dokumentasjon.ulikeAdresser.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Dokumentasjon på at du og tidligere samboer bor på ulike adresser')
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon på at du og tidligere samboer bor på ulike adresser, for eksempel:'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Informasjon om hvor den tidligere samboeren bor nå')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Kopi av flyttemelding/tips til folkeregisteret'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Husleiekontrakt for begge parter'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon på at tidligere felles bolig er overdratt til en av partene. Dette kan være skifte og/eller dokumentasjon på hvem som er låntaker for boligen du bor i.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Bekreftelse fra eksempel barnehage, skole, barnevern, helsestasjon eller lignende.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon på separate bo- og husholdningsutgifter. Dette kan være kontoutskrifter som viser betalt husleie, eller andre faste boutgifter slik som strøm og kommunale avgifter.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon barn bor hos søker', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnasBostedDokumentasjon.BARN_BOR_HOS_SØKER,
            spørsmålid: EForelder.skalBarnetBoHosSøker,
            svarid: ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke,
            label: '',
            tittel: 'dokumentasjon.barnBorHosSøker.tittel',
            beskrivelse: 'dokumentasjon.barnBorHosSøker.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på at barn bor hos deg')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Dokumentasjon på at barn bor hos deg, for eksempel:')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Redegjørelse for årsaken til manglende adresseendring for barnet')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Kopi av flyttemelding/tips til Folkeregisteret'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Bekreftelse fra for eksempel barnehage/skole, barnevern eller helsestasjon')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon samværsavtale med konkrete tidspunkter', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnasBostedDokumentasjon.SAMVÆRSAVTALE,
            spørsmålid: EForelder.harDereSkriftligSamværsavtale,
            svarid: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
            label: '',
            tittel: 'dokumentasjon.samværsavtale.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Samværsavtale')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon samværsavtale uten konkrete tidspunkter', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: BarnasBostedDokumentasjon.SAMVÆRSAVTALE,
            spørsmålid: EForelder.harDereSkriftligSamværsavtale,
            svarid: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
            label: '',
            tittel: 'dokumentasjon.samværsavtale.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Samværsavtale')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon sykdom', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.SYKDOM,
            spørsmålid: ESituasjon.gjelderDetteDeg,
            svarid: DinSituasjonType.erSyk,
            label: '',
            tittel: 'dokumentasjon.syk-dinSituasjon.tittel',
            beskrivelse: 'dokumentasjon.syk-dinSituasjon.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på at du er syk')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du ikke har sykemelding eller ikke mottar arbeidsavklaringspenger (AAP) eller uføretrygd, må du legge ved dokumentasjon på at du er syk.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen fra legen din må tydelig vise:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('årsaken til at du ikke kan være i yrkesrettet aktivitet')
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('når du ble syk'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye du kan arbeide'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('når legen din regner med at du vil bli frisk'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Får du allerede overgangsstønad og søker du om å forlenge stønadsperioden utover 3 år fordi du har en sykdom som ikke er varig? Da trenger vi dokumentasjonen fra legen din selv om du har sykemelding.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon sykt barn', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.SYKT_BARN,
            spørsmålid: ESituasjon.gjelderDetteDeg,
            svarid: DinSituasjonType.harSyktBarn,
            label: '',
            tittel: 'dokumentasjon.syktBarn.tittel',
            beskrivelse: 'dokumentasjon.syktBarn.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på barnets sykdom')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon som bekrefter at barnet ditt er sykt og beskriver din mulighet til å være i yrkesrettet aktivitetDokumentasjonen fra lege må tydelig vise:'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'årsaken til at barnets sykdom påvirker muligheten din til å være i arbeid eller annen yrkesrettet aktivitet'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('når barnet ble sykt'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('når legen regner med at barnet vil bli friskt'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye kan du arbeide'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon barnepass mangel', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.BARNEPASS,
            spørsmålid: ESituasjon.gjelderDetteDeg,
            svarid: DinSituasjonType.harSøktBarnepassOgVenterEnnå,
            label: '',
            tittel: 'dokumentasjon.barnepass.tittel',
            beskrivelse: 'dokumentasjon.barnepass.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på at du mangler barnepass')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Det vil si avslag på barnehageplass/SFO-plass eller bekreftelse på at barnet står på venteliste.Dokumentasjonen må tydelig vise'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('datoen du søkte'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('datoen du ønsket plass fra'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon barnetilsynbehov', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.BARNETILSYN_BEHOV,
            spørsmålid: ESituasjon.gjelderDetteDeg,
            svarid: DinSituasjonType.harBarnMedSærligeBehov,
            label: '',
            tittel: 'dokumentasjon.barnetilsynsbehov.tittel',
            beskrivelse: 'dokumentasjon.barnetilsynsbehov.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på barnets tilsynsbehov')).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon fra legen din som bekrefter at barnet har medisinske, psykiske eller store sosiale problemer og trenger tilsyn.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Dokumentasjon som beskriver behovet barnet ditt har for tilsyn og hvordan dette påvirker muligheten din til å være i arbeid eller yrkesrettet aktivitet.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon arbeidsforhold oppsigelsesårsak', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.ARBEIDSFORHOLD_OPPSIGELSE,
            spørsmålid: ESituasjon.sagtOppEllerRedusertStilling,
            svarid: ESagtOppEllerRedusertStilling.sagtOpp,
            label: '',
            tittel: 'dokumentasjon.arbeidsforhold-oppsigelse.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Dokumentasjon på arbeidsforholdet og årsaken til at du sluttet')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon arbeidsforhold redusert arbeidstid', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: SituasjonDokumentasjon.ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID,
            spørsmålid: ESituasjon.sagtOppEllerRedusertStilling,
            svarid: ESagtOppEllerRedusertStilling.redusertStilling,
            label: '',
            tittel: 'dokumentasjon.arbeidsforhold-redusert.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText(
        'Dokumentasjon på arbeidsforholdet og årsaken til at du reduserte arbeidstiden'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon erklæring samlivsbrudd', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: OmDegDokumentasjon.SAMLIVSBRUDD,
            spørsmålid: ESivilstatusSøknadid.årsakEnslig,
            svarid: EBegrunnelse.samlivsbruddForeldre,
            label: '',
            tittel: 'dokumentasjon.begrunnelse.tittel',
            beskrivelse: 'dokumentasjon.begrunnelse.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByText('Bekreftelse på samlivsbrudd med den andre forelderen')
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis dere ikke er separert eller skilt, må du legge ved bekreftelse på samlivsbruddet. Bekreftelsen må være signert av dere begge og vise dato for bruddet.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du får lenke til et forslag til hvordan bekreftelsen kan se ut når du sender inn søknaden slik at du kan ettersende dette hvis du ikke allerede har en bekreftelse.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Dette er ikke meklingsattesten fra familievernkontoret.')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon inngått ekteskap', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: OmDegDokumentasjon.INNGÅTT_EKTESKAP,
            spørsmålid: ESivilstatusSøknadid.erUformeltGift,
            svarid: ESvar.JA,
            label: '',
            tittel: 'dokumentasjon.inngåttEkteskap.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på inngått ekteskap')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon uformelt separert eller skilt', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: OmDegDokumentasjon.UFORMELL_SEPARASJON_ELLER_SKILSMISSE,
            spørsmålid: ESivilstatusSøknadid.erUformeltSeparertEllerSkilt,
            svarid: ESvar.JA,
            label: '',
            tittel: 'dokumentasjon.separasjonEllerSkilsmisse.tittel',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på separasjon eller skilsmisse')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon bekreftelse separasjon', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: OmDegDokumentasjon.SEPARASJON_ELLER_SKILSMISSE,
            spørsmålid: ESivilstatusSøknadid.harSøktSeparasjon,
            svarid: ESvar.JA,
            label: '',
            tittel: 'dokumentasjon.søktSeparasjon.tittel',
            beskrivelse: 'dokumentasjon.søktSeparasjon.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på separasjon eller skilsmisse')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Bekreftelse fra Fylkesmannen eller domstolen på søknad om separasjon, søknad om skilsmisse eller at det er reist sak for domstolen'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });

  test('Dokumentasjon meldt adresseendring', async () => {
    mockMellomlagretSøknadOvergangsstønad(
      '/dokumentasjon',
      {},
      {
        dokumentasjonsbehov: [
          lagDokumentasjon({
            id: AdresseopplysningerDokumentasjon.MELDT_ADRESSEENDRING,
            spørsmålid: EAdresseopplysninger.harMeldtAdresseendring,
            svarid: ESvar.JA,
            label: '',
            tittel: 'dokumentasjon.meldtAdresseendring.tittel',
            beskrivelse: 'dokumentasjon.meldtAdresseendring.beskrivelse',
            harSendtInn: false,
          }),
        ],
      }
    );
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Dokumentasjon på adresseendring')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Du må legge ved dokumentasjon på at du har meldt flytting til Folkeregisteret. Dokumentasjonen må vise at det er du som har endret adresse, hvilken adresse du har meldt flytting til og hvilken dato du flyttet.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har sendt inn denne dokumentasjonen til Nav tidligere',
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Send søknad' })).toBeInTheDocument();
  });
});
