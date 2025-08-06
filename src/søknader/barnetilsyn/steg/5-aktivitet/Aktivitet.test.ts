import { mockGet, mockMellomlagretSøknadBarnetilsyn } from '../../../../test/axios';
import { describe, expect, test } from 'vitest';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilStegBarnetilsyn,
  skrivFritekst,
} from '../../../../test/actions';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'barnetilsyn')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Aktivitet-Steg for barnetilsyn', () => {
  test('Skal navigere til Aktivitet-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Arbeidssituasjonen din' })
    ).toBeInTheDocument();
  });

  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByRole('group', {
        name: 'Er du i arbeid?',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du ikke er i arbeid, men er registrert som arbeidssøker hos Nav eller tar utdanning som Nav har godkjent, har du som hovedregel ikke rett til denne stønaden. Da kan du i stedet søke om'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'stønad til pass av barn' })).toHaveAttribute(
      'href',
      'https://www.nav.no/tilleggsstonader-enslig'
    );

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Søker er ikke i arbeid fordi hen er syk', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    await klikkRadioknapp(
      'Er du i arbeid?',
      'Nei, jeg er ikke i arbeid fordi jeg er syk',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du kan få stønaden i inntil ett år når du har en sykdom som ikke er varig, og sykdommen gjør at du ikke kan være i arbeid.'
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
          'Det er en forutsetning at barnepassordningen ble opprettet fordi du var i eller skulle begynne i arbeid, og at den fortsetter i den perioden du er syk.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Vi trenger dokumentasjon fra legen din som viser:')
      )
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
      screen.getByText((tekst) =>
        tekst.includes(
          'Du får muligheten til å laste ned eller skrive ut en huskeliste du kan ta med til legen din for å dokumentere dette når du sender inn søknaden.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker er i arbeid', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    expect(screen.getByRole('group', { name: 'Hvordan er situasjonen din?' })).toBeInTheDocument();
    expect(screen.getByText('Du kan velge flere alternativer')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg er selvstendig næringsdrivende eller frilanser med enkeltpersonforetak',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg er selvstendig næringsdrivende og ansatt i mitt eget aksjeselskap (AS)',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg etablerer egen virksomhet',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Søker er i arbeid (og/eller lønnsmottaker som frilanser), Fast stilling', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Hva slags ansettelsesforhold har du?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Hva slags ansettelsesforhold har du?', 'Fast stilling', screen, user);

    expect(screen.getByText('Har du flere arbeidssteder?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et arbeidssted' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
  test('Søker er arbeidstaker (og/eller lønnsmottaker som frilanser), Midlertidig stilling', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Hva slags ansettelsesforhold har du?' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Hva slags ansettelsesforhold har du?',
      'Midlertidig stilling',
      screen,
      user
    );

    expect(screen.getByRole('group', { name: 'Har du en sluttdato?' }));

    await klikkRadioknapp('Har du en sluttdato?', 'Nei', screen, user);

    expect(screen.getByText('Har du flere arbeidssteder?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et arbeidssted' })).toBeInTheDocument();
    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp('Har du en sluttdato?', 'Ja', screen, user);

    expect(screen.queryByText('Har du flere arbeidssteder?')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Legg til et arbeidssted' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'Når skal du slutte?' }));

    await skrivFritekst('Når skal du slutte?', '28.07.2040', screen, user);

    expect(screen.getByText('Har du flere arbeidssteder?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et arbeidssted' })).toBeInTheDocument();
    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
  test('Søker er arbeidstaker (og/eller lønnsmottaker som frilanser), Lærling', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Hva slags ansettelsesforhold har du?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Hva slags ansettelsesforhold har du?', 'Lærling', screen, user);

    expect(screen.getByText('Du må legge ved lærlingkontrakten din')).toBeInTheDocument();
    expect(screen.getByText('Har du flere arbeidssteder?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et arbeidssted' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
  test('Søker er arbeidstaker (og/eller lønnsmottaker som frilanser), Tilkallingsvikar eller liknende', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Hva slags ansettelsesforhold har du?' })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Hva slags ansettelsesforhold har du?',
      'Tilkallingsvikar eller liknende',
      screen,
      user
    );

    expect(screen.getByText('Har du flere arbeidssteder?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et arbeidssted' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker er selvstendig næringsdrivende eller frilanser med enkeltpersonforetak', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox(
      'Jeg er selvstendig næringsdrivende eller frilanser med enkeltpersonforetak',
      screen,
      user
    );

    expect(screen.getByText('Om firmaet du driver')).toBeInTheDocument();
    expect(screen.getByText('Firma')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på firma',
      })
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    await skrivFritekst('Navn på firma', 'Nav', screen, user);

    expect(screen.getByRole('textbox', { name: 'Organisasjonsnummer' })).toBeInTheDocument();
    await skrivFritekst('Organisasjonsnummer', '123456789', screen, user);
    expect(screen.queryByText('Organisasjonsnummeret må ha 9 siffer')).not.toBeInTheDocument();
    await user.click(screen.getByRole('textbox', { name: 'Navn på firma' })); //Må unfokusere orgnr-tekstboks for å gå videre

    expect(screen.getByRole('textbox', { name: 'Når etablerte du firmaet?' })).toBeInTheDocument();
    await skrivFritekst('Når etablerte du firmaet?', '27.07.2025', screen, user);

    expect(
      screen.getByRole('textbox', { name: 'Beskriv arbeidsuken i virksomheten din' })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi trenger konkrete opplysninger om arbeidsoppgavene dine og hvor mange timer du jobber i snitt per uke.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('spinbutton', {
        name: 'Hva forventer du at overskuddet i virksomheten din blir før skatt i 2025?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Overskuddet er summen av inntektene dine, minus de utgiftene du har. Hvis du ikke forventer et overskudd, oppgir du 0 kroner i feltet.'
        )
      )
    ).toBeInTheDocument();

    await skrivFritekst('Beskriv arbeidsuken i virksomheten din', 'Veldig travel', screen, user);
    await user.type(
      screen.getByRole('spinbutton', {
        name: 'Hva forventer du at overskuddet i virksomheten din blir før skatt i 2025?',
      }),
      '1500'
    );

    expect(screen.getByText('Har du flere firmaer?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til firma' })).toBeInTheDocument();

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker er selvstendig næringsdrivende og ansatt i mitt eget aksjeselskap (AS)', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox(
      'Jeg er selvstendig næringsdrivende og ansatt i mitt eget aksjeselskap (AS)',
      screen,
      user
    );

    expect(screen.getByText('Om aksjeselskapet ditt')).toBeInTheDocument();
    expect(screen.getByText('Aksjeselskap')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på aksjeselskapet ditt',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await skrivFritekst('Navn på aksjeselskapet ditt', 'Aksje as', screen, user);

    expect(screen.getByText('Har du flere egne aksjeselskap?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et aksjeselskap' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker etablerer egen virksomhet', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/aktivitet', {});
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Om virksomheten du etablerer',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er du i arbeid?', 'Ja', screen, user);

    await klikkCheckbox('Jeg etablerer egen virksomhet', screen, user);

    expect(screen.getByText('Om virksomheten du etablerer')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Beskriv virksomheten' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Får du ikke dagpenger mens du etablerer egen virksomhet, må du skaffe næringsfaglig vurdering fra kommunen eller fylkeskommunen. Du kan også bruke en annen faglig kompetanse.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi trenger denne vurderingen når vi skal ta stilling til om virksomheten kan godkjennes som yrkesrettet aktivitet.'
        )
      )
    ).toBeInTheDocument();

    await skrivFritekst('Beskriv virksomheten', 'En lovende virksomhet', screen, user);

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});
