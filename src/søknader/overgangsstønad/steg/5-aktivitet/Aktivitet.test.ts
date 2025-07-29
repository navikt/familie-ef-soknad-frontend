import { mockGet, mockMellomlagretSøknad } from '../../../../test/axios';
import { describe, expect, test } from 'vitest';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilSteg,
  skrivFritekst,
  skrivFritekstTilKomponentMedId,
} from '../../../../test/actions';
import { prettyDOM } from '@testing-library/dom';

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

describe('Aktivitet-Steg for overgangsstønad', () => {
  test('Skal navigere til Aktivitet-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen } = await navigerTilSteg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Arbeid, utdanning og andre aktiviteter' })
    ).toBeInTheDocument();
  });

  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText('Hvordan er situasjonen din?')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Grunnen til at vi spør om dette',
      })
    ).toBeInTheDocument();
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
      screen.getByRole('checkbox', { name: 'Jeg har fått tilbud om jobb' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg etablerer egen virksomhet' })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Jeg er arbeidssøker' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg tar eller skal ta utdanning' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg er ikke i arbeid, utdanning eller arbeidssøker' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Grunnen til at vi spør om dette' }));

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi trenger opplysninger om hvilken aktivitet du er i for å vurdere om du har rett til stønad. Du må som hovedregel være i minst 50 prosent yrkesrettet aktivitet etter at det yngste barnet ditt har fylt 1 år. I noen tilfeller kan vi gjøre unntak fra aktivitetsplikten.'
        )
      )
    );

    expect(screen.getByText((tekst) => tekst.includes('Du kan lese mer om aktivitetsplikten på')));

    expect(
      screen.getByRole('link', {
        name: 'nav.no/overgangsstonad-enslig#aktivitet',
      })
    ).toHaveAttribute('href', 'https://www.nav.no/overgangsstonad-enslig#aktivitet');
  });

  test('Søker er arbeidstaker (og/eller lønnsmottaker som frilanser), Fast stilling', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis arbeidskontrakten din sier noe annet enn hvor mye du faktisk jobber, oppgir du hvor mye du faktisk jobber.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis det varierer fra måned til måned hvor mye du jobber, anslår du omtrent hvor mye du regner med å jobbe fremover'
        )
      )
    ).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

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
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis arbeidskontrakten din sier noe annet enn hvor mye du faktisk jobber, oppgir du hvor mye du faktisk jobber.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis det varierer fra måned til måned hvor mye du jobber, anslår du omtrent hvor mye du regner med å jobbe fremover'
        )
      )
    ).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

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
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis arbeidskontrakten din sier noe annet enn hvor mye du faktisk jobber, oppgir du hvor mye du faktisk jobber.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis det varierer fra måned til måned hvor mye du jobber, anslår du omtrent hvor mye du regner med å jobbe fremover'
        )
      )
    ).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

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
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er arbeidstaker (og/eller lønnsmottaker som frilanser)', screen, user);

    expect(screen.getByText('Om arbeidsforholdet ditt')).toBeInTheDocument();
    expect(screen.getByText('Arbeidssted')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn på arbeidssted', 'Nav', screen, user);

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis arbeidskontrakten din sier noe annet enn hvor mye du faktisk jobber, oppgir du hvor mye du faktisk jobber.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis det varierer fra måned til måned hvor mye du jobber, anslår du omtrent hvor mye du regner med å jobbe fremover'
        )
      )
    ).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

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
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

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

    console.log(prettyDOM(undefined, Infinity));

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

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
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på arbeidssted',
      })
    ).not.toBeInTheDocument();

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

    expect(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' })).toBeInTheDocument();
    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye jobber du?' }), '100');

    expect(screen.getByText('Har du flere egne aksjeselskap?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til et aksjeselskap' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker har fått tilbud om jobb', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkCheckbox('Jeg har fått tilbud om jobb', screen, user);

    expect(
      screen.getByText('Du må legge ved arbeidskontrakt som viser at du har fått tilbud om jobb.')
    ).toBeInTheDocument();
    expect(screen.getByText('Dokumentasjonen må tydelig vise:')).toBeInTheDocument();
    expect(screen.getByText('navn på arbeidssted')).toBeInTheDocument();
    expect(screen.getByText('stillingsprosent')).toBeInTheDocument();
    expect(screen.getByText('datoen du begynner i jobben')).toBeInTheDocument();
    expect(screen.getByText('datoen du fikk tilbudet')).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', { name: 'Når skal du starte i ny jobb?' })
    ).toBeInTheDocument();

    await skrivFritekst('Når skal du starte i ny jobb?', '28.07.2040', screen, user);

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker etablerer egen virksomhet', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Om virksomheten du etablerer',
      })
    ).not.toBeInTheDocument();

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

  test('Søker er arbeidssøker', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Når du er arbeidssøker',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg er arbeidssøker', screen, user);

    expect(screen.getByText('Når du er arbeidssøker')).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Er du registrert som arbeidssøker hos Nav?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Om å være registrert som arbeidssøker hos Nav' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
      })
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', {
        name: 'Om å være registrert som arbeidssøker hos Nav',
      })
    );

    await klikkRadioknapp('Er du registrert som arbeidssøker hos Nav?', 'Nei', screen, user);
    expect(
      screen.getByText(
        'Du kan registrere deg etter at du har sendt inn denne søknaden. Da hjelper vi deg videre til registreringen.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp('Er du registrert som arbeidssøker hos Nav?', 'Ja', screen, user);
    expect(
      screen.getByRole('group', {
        name: 'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
      })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
      'Nei',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Hvis det er helsemessige grunner som hindrer deg fra å ta ethvert arbeid, må du dokumentere det med legeattest'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Du må være tilgjengelig og raskt kunne ta stilling til tilbud om arbeid eller arbeidsmarkedstiltak. Du må derfor kunne skaffe barnepass på kort varsel.'
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Er du villig til å ta imot tilbud om arbeid eller arbeidsmarkedstiltak?',
      'Ja',
      screen,
      user
    );
    expect(
      screen.queryByText(
        'Hvis det er helsemessige grunner som hindrer deg fra å ta ethvert arbeid, må du dokumentere det med legeattest'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Hvor ønsker du å søke arbeid?',
      })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
      'Nei',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Når du ikke kan begynne i jobb innen èn uke etter at du har fått tilbud, har du ikke rett til overgangsstønad.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Hvor ønsker du å søke arbeid?',
      })
    ).toBeInTheDocument();
    await klikkRadioknapp(
      'Kan du begynne i arbeid senest én uke etter at du har fått tilbud om jobb?',
      'Ja',
      screen,
      user
    );
    expect(
      screen.queryByText(
        'Når du ikke kan begynne i jobb innen èn uke etter at du har fått tilbud, har du ikke rett til overgangsstønad.'
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Hvor ønsker du å søke arbeid?',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Dette betyr 1 times reisevei' })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dette betyr 1 times reisevei' }));
    expect(
      screen.getByText(
        '1 times reisevei vil si at reisetiden med transportmiddel mellom hjem og arbeidssted ikke er over 1 time hver vei. Det inkuderer ikke gangtid mellom bolig og transportmiddel, og transportmiddel og arbeidssted.'
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
      })
    ).not.toBeInTheDocument();
    await klikkRadioknapp('Hvor ønsker du å søke arbeid?', 'Hvor som helst i landet', screen, user);
    expect(
      screen.getByRole('group', {
        name: 'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
      })
    ).toBeInTheDocument();
    await klikkRadioknapp(
      'Hvor ønsker du å søke arbeid?',
      'Kun i bodistriktet mitt, ikke mer enn 1 times reisevei hver vei',
      screen,
      user
    );
    expect(
      screen.getByRole('group', {
        name: 'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Du kan søke heltidsjobb, men som enslig mor eller far holder det at du jobber minst 50 prosent. Det er heller ikke krav om at du må jobbe kvelds-, natt-, helg- og skiftarbeid.'
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
      'Nei',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Når du er arbeidssøker til mindre enn 50 prosent stilling, har du ikke rett til overgangsstønad.'
      )
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Ønsker du å stå som arbeidssøker til minst 50 prosent stilling?',
      'Ja',
      screen,
      user
    );
    expect(
      screen.queryByText(
        'Når du er arbeidssøker til mindre enn 50 prosent stilling, har du ikke rett til overgangsstønad.'
      )
    ).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker tar eller skal ta utdanning', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Utdanningen du tar eller skal ta',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg tar eller skal ta utdanning', screen, user);

    expect(screen.getByText('Utdanningen du tar eller skal ta')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Utdanning du kan få stønad til' })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Utdanning du kan få stønad til' }));
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'For å få rett til overgangsstønad under utdanning, må Nav vurdere utdanningen din som nødvendig for at du skal kunne komme i jobb og forsørge deg selv.'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('Da vurderer vi:'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('hva som er målet med utdanningen din'))
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('om det er nødvendig med utdanning for å kunne nå målet ditt')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'om utdanningen er hensiktsmessig. Da vurderer vi blant annet både arbeidsmarkedets behov og dine muligheter.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Når du søker om overgangsstønad vil vi vurdere utdanningen din.')
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'Skole / utdanningssted' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Linje / kurs / grad' })).not.toBeInTheDocument();

    await skrivFritekst('Skole / utdanningssted', 'NTNU', screen, user);

    expect(screen.getByRole('textbox', { name: 'Linje / kurs / grad' })).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Er utdanningen offentlig eller privat?' })
    ).not.toBeInTheDocument();

    await skrivFritekst('Linje / kurs / grad', 'Informatikk', screen, user);

    expect(
      screen.getByRole('button', { name: 'Om godkjenning av privat utdanning' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Er utdanningen offentlig eller privat?' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Om godkjenning av privat utdanning' }));
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi godkjenner kun privat utdanning dersom det offentlige skoleverket ikke har det samme tilbudet.'
        )
      )
    );
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi kan godta privat utdanning dersom det er særlige grunner, for eksempel at du ikke har kommet inn ved offentlig skole eller at du har begynt på den private utdanningen før du ble enslig mor eller far.'
        )
      )
    );

    expect(screen.queryByText('Når skal du være elev/student?')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Fra' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Til' })).not.toBeInTheDocument();
    await klikkRadioknapp('Er utdanningen offentlig eller privat?', 'Privat', screen, user);
    expect(screen.getByText('Når skal du være elev/student?')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Fra' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Til' })).toBeInTheDocument();

    await klikkRadioknapp('Er utdanningen offentlig eller privat?', 'Offentlig', screen, user);
    expect(screen.getByText('Når skal du være elev/student?')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Fra' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Til' })).toBeInTheDocument();

    expect(
      screen.queryByRole('group', { name: 'Er utdanningen på heltid eller deltid?' })
    ).not.toBeInTheDocument();

    await skrivFritekst('Fra', '01.08.2019', screen, user);
    await skrivFritekst('Til', '01.08.2024', screen, user);

    expect(
      screen.getByRole('group', { name: 'Er utdanningen på heltid eller deltid?' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('spinbutton', { name: 'Hvor mye skal du studere?' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Er utdanningen på heltid eller deltid?', 'Deltid', screen, user);
    expect(
      screen.getByRole('spinbutton', { name: 'Hvor mye skal du studere?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Hva er målet med utdanningen?' })
    ).not.toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Hvor mye skal du studere?' }), '50');
    expect(
      screen.getByRole('textbox', { name: 'Hva er målet med utdanningen?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Er utdanningen på heltid eller deltid?', 'Heltid', screen, user);
    expect(
      screen.queryByRole('spinbutton', { name: 'Hvor mye skal du studere?' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hva er målet med utdanningen?' })
    ).toBeInTheDocument();
    expect(screen.getByText('Du må legge ved dokumentasjon på utdanningen du tar eller skal ta'));
    expect(
      screen.getByText((tekst) => tekst.includes('Dokumentasjonen må vise:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('navn på studiested'))).toBeInTheDocument();
    expect(screen.getAllByText((tekst) => tekst.includes('navn på studie'))).toHaveLength(2); //Må sjekke slik siden det er en substring av teksten over
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

    await skrivFritekst('Hva er målet med utdanningen?', 'Å bli utdannet', screen, user);

    expect(screen.getByText((tekst) => tekst.includes('Tidligere utdanning'))).toBeInTheDocument();
    expect(screen.getByTestId('grunn-til-spørsmål-om-tidligere-utdanning')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dette regnes som grunnskolen' })
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('grunn-til-spørsmål-om-tidligere-utdanning'));
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi spør om tidligere utdanning for å kunne vurdere om utdanningen du skal ta er nødvendig for at du skal kunne komme i jobb og forsørge deg selv.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Har du allerede en utdanning som gjør deg kvalifisert til et yrke eller som kan benyttes i flere yrker, vil du som hovedregel ikke få støtte til mer utdanning.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi kan gjøre unntak hvis du har en utdanning eller yrkeserfaring som ikke lenger er relevant i dagens arbeidsmarked. Høgskole eller universitetsutdanning blir ikke utdatert.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi kan også gjøre unntak fra denne regelen hvis utdanningen din/yrket ditt ikke er forenlig med omsorgen for barn. Dette gjelder ikke vanlig turnusarbeid.'
        )
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dette regnes som grunnskolen' }));
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Grunnskolen er barne- og ungdomsskole, det vil si til og med 10. klasse.')
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', { name: 'Har du tatt utdanning etter grunnskolen?' })
    ).toBeInTheDocument();

    await klikkRadioknapp('Har du tatt utdanning etter grunnskolen?', 'Nei', screen, user);

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp('Har du tatt utdanning etter grunnskolen?', 'Ja', screen, user);
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 4, name: 'Utdanning' })).toBeInTheDocument();
    expect(screen.getByTestId('tidligereUtdanning-linje')).toBeInTheDocument();
    expect(screen.queryByText('Når var du elev / student?')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tidligereutdanning-fra')).not.toBeInTheDocument();
    expect(screen.queryByRole('tidligereutdanning-til')).not.toBeInTheDocument();

    await skrivFritekstTilKomponentMedId('tidligereUtdanning-linje', 'Informatikk', screen, user);
    expect(screen.getByText('Når var du elev / student?')).toBeInTheDocument();
    expect(screen.getByTestId('tidligereutdanning-fra')).toBeInTheDocument();
    expect(screen.queryByTestId('tidligereutdanning-til')).toBeInTheDocument();
    expect(screen.queryByText('Har du tatt mer utdanning?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Legg til en utdanning' })).not.toBeInTheDocument();

    await skrivFritekstTilKomponentMedId('tidligereutdanning-fra', '01.01.2020', screen, user);
    await skrivFritekstTilKomponentMedId('tidligereutdanning-til', '01.01.2021', screen, user);

    expect(screen.getByText('Har du tatt mer utdanning?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til en utdanning' })).toBeInTheDocument();

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Søker er ikke i arbeid, utdanning eller arbeidssøker', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/aktivitet', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();

    await klikkCheckbox('Jeg er ikke i arbeid, utdanning eller arbeidssøker', screen, user);

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});
