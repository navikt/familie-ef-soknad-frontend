import { mockGet, mockMellomlagretSøknadOvergangsstønad } from '../../../../test/axios';
import { describe, expect, test } from 'vitest';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilStegOvergangsstønad,
  skrivFritekst,
} from '../../../../test/aksjoner';
import { dagensDato, formatMånederTilbake } from '../../../../utils/dato';

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

describe('Mer om din situasjon', () => {
  test('Skal navigere til din situasjon-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Mer om situasjonen din' })
    ).toBeInTheDocument();
  });

  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Gjelder noe av dette deg?')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg er syk',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Barnet mitt er sykt',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har søkt om barnepass, men ikke fått plass enda',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Nei' })).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });
  test('Søker er syk', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er syk', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du ikke har sykemelding eller ikke mottar arbeidsavklaringspenger (AAP) eller uføretrygd, må du legge ved dokumentasjon som bekrefter at du er syk.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen fra legen din må vise:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('grunnen til at du ikke kan være i yrkesrettet aktivitet')
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('når du ble syk'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('når legen din regner med at du vil bli frisk'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye du kan arbeide'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Får du allerede overgangsstønad og søker du om å forlenge stønadsperioden utover 3 år fordi du har en sykdom som ikke er varig? Da trenger vi dokumentasjonen fra legen din selv om du har sykemelding.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'At sykdommen ikke er varig betyr i denne sammenhengen at den ikke har vart i mer enn 2 år eller vil vare i mer enn 2 år.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du får muligheten til å laste ned eller skrive ut en huskeliste du kan ta med til legen din for å dokumentere dette når du sender inn søknaden.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
  });
  test('Søkers barn er sykt', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Barnet mitt er sykt', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må legge ved dokumentasjon som bekrefter at barnet ditt er sykt og beskriver din mulighet til å være i yrkesrettet aktivitet.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen fra legen din må vise:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'grunnen til at barnets sykdom påvirker muligheten din til å være i arbeid eller annen yrkesrettet aktivitet'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('når barnet ble sykt'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('når legen regner med at barnet vil bli friskt'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye du kan arbeide'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du får muligheten til å laste ned eller skrive ut en huskeliste du kan ta med til legen din for å dokumentere dette når du sender inn søknaden.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
  });
  test('Søker har søkt om barnepass, men ikke fått plass enda', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg har søkt om barnepass, men ikke fått plass enda', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må legge ved dokumentasjon som bekrefter at du mangler barnepass.')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Det vil si avslag på barnehageplass/SFO-plass eller bekreftelse på at barnet står på venteliste.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen må vise:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('datoen du søkte'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('datoen du ønsket plass fra'))
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
  });
  test('Søker har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox(
      'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må legge ved dokumentasjon som bekrefter at barnet ditt har behov for særlig tilsyn'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen fra lege må bekrefte:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'at barnet har medisinske, psykiske eller store sosiale problemer og trenger tilsyn'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('at dette påvirker muligheten din til å være i yrkesrettet aktivitet')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'Om tilsynsbehovet til Gåen Pc',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Vi trenger opplysninger om:'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hvor mye og hvordan barnet ditt trenger tilsyn'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('hvordan det påvirker muligheten din til å være i yrkesrettet aktivitet')
      )
    ).toBeInTheDocument();

    await skrivFritekst('Om tilsynsbehovet til Gåen Pc', 'Trenger tilsyn', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
  });
  test('Søker har ingen av overnevnte alternativer', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
  });

  test('Søker har sagt opp jobben eller tatt frivillig permisjon (ikke foreldrepermisjon)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Grunnen til at vi spør om dette' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Grunnen til at vi spør om dette' }));

    expect(
      screen.getByText(
        'Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.'
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      'Ja, jeg har sagt opp jobben eller tatt frivillig permisjon (ikke foreldrepermisjon)',
      screen,
      user
    );
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må legge ved dokumentasjon om arbeidsforholdet og grunnen til at du sluttet. Dokumentasjonen må vise:'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getAllByText((tekst) => tekst.includes('arbeidsforholdet'))).toHaveLength(2);
    expect(
      screen.getAllByText((tekst) => tekst.includes('grunnen til at du sluttet'))
    ).toHaveLength(2);
    expect(
      screen.getByText((tekst) =>
        tekst.includes('datoen du sa opp eller avtalte frivillig permisjon')
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Hvorfor sa du opp?' })).toBeInTheDocument();

    await skrivFritekst('Hvorfor sa du opp?', 'En eller annen grunn', screen, user);

    expect(screen.getByRole('textbox', { name: 'Når sa du opp?' })).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).not.toBeInTheDocument();

    await skrivFritekst('Når sa du opp?', '28.07.2025', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Har du sagt opp jobben uten rimelig grunn, kan du først ha rett til stønaden 6 måneder etter at du sa opp.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).toBeInTheDocument();
  });
  test('Søker har redusert arbeidstiden', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      'Ja, jeg har redusert arbeidstiden',
      screen,
      user
    );
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må legge ved dokumentasjon på arbeidsforholdet og grunnen til at du reduserte arbeidstiden.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen må vise:'))
    ).toBeInTheDocument();
    expect(screen.getAllByText((tekst) => tekst.includes('arbeidsforholdet'))).toHaveLength(2);
    expect(
      screen.getAllByText((tekst) => tekst.includes('grunnen til at du reduserte arbeidstiden'))
    ).toHaveLength(2);
    expect(
      screen.getByText((tekst) => tekst.includes('datoen du avtalte reduksjon i arbeidstiden'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hvorfor reduserte du arbeidstiden?' })
    ).toBeInTheDocument();

    await skrivFritekst('Hvorfor reduserte du arbeidstiden?', 'En eller annen grunn', screen, user);

    expect(
      screen.getByRole('textbox', { name: 'Når reduserte du arbeidstiden?' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).not.toBeInTheDocument();

    await skrivFritekst('Når reduserte du arbeidstiden?', '28.07.2025', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Har du redusert arbeidstiden uten rimelig grunn, kan du først ha rett til stønaden 6 måneder etter at du sa opp.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).toBeInTheDocument();
  });
  test('Søker har ikke sagt opp jobben eller redusert arbeidstiden de siste 6 månedene', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      })
    ).toBeInTheDocument();
  });

  test('Søker søker overgangsstønad fra en bestemt måned', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Nei', screen, user);
    await klikkRadioknapp(
      'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Om å søke fra et bestemt tidspunkt' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Om å søke fra et bestemt tidspunkt' }));

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          `Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med ${formatMånederTilbake(dagensDato, 3)}.`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          `Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med ${formatMånederTilbake(dagensDato, 5)}`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.'
        )
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      'Ja',
      screen,
      user
    );

    expect(screen.getByText('Når søker du stønad fra?')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Jeg søker overgangsstønad fra og med' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Åpne månedsvelger' }));
    await user.click(screen.getByRole('option', { name: '2025' }));
    await user.click(screen.getByRole('button', { name: 'januar' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
  test('Nav kan vurdere fra hvilken måned søker har rett til stønad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/din-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Nei', screen, user);
    await klikkRadioknapp(
      'Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene? Grunnen til at vi spør om dette Har du sagt opp jobben uten rimelig grunn, kan du som hovedregel først ha rett til stønaden 6 måneder etter at du sa opp. Det samme gjelder hvis du har redusert arbeidstiden til under 50 prosent.',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByRole('button', { name: 'Om å søke fra et bestemt tidspunkt' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Om å søke fra et bestemt tidspunkt' }));

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          `Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med ${formatMånederTilbake(dagensDato, 3)}.`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          `Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med ${formatMånederTilbake(dagensDato, 5)}`
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkRadioknapp(
      'Søker du overgangsstønad fra en bestemt måned? Om å søke fra et bestemt tidspunkt Du kan få overgangsstønad fra og med måneden etter at du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med september 2025. Hvis du er gravid, kan du ha rett til overgangsstønad fra måneden før fødsel. Hvis du har fått barn i løpet av de siste 3 månedene, kan du få stønad i inntil 5 måneder før du søker. Det vil si fra og med juli 2025. Selv om du søker fra en bestemt måned vil vi vurdere om du har rett til stønad fra denne måneden eller senere.',
      'Nei, Nav kan vurdere fra hvilken måned jeg har rett til stønad',
      screen,
      user
    );

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});
