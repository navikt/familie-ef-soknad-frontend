import { mockGet, mockMellomlagretSøknadSkolepenger } from '../../../../test/axios';
import { describe, expect, test } from 'vitest';
import {
  klikkRadioknapp,
  navigerTilStegSkolepenger,
  skrivFritekst,
  skrivFritekstTilKomponentMedId,
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

describe('Utdanningen-Steg for barnetilsyn', () => {
  test('Skal navigere til Aktivitet-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadSkolepenger('/skolepenger/utdanning', {});
    const { screen } = await navigerTilStegSkolepenger();

    expect(screen.getByRole('heading', { level: 2, name: 'Utdanningen din' })).toBeInTheDocument();
  });

  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknadSkolepenger('/skolepenger/utdanning', {});
    const { screen } = await navigerTilStegSkolepenger();

    expect(
      screen.getByRole('button', {
        name: 'Utdanning du kan få stønad til',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'For å få rett til stønad til skolepenger, må denne utdanningen være nødvendig for at du skal kunne komme i jobb og forsørge deg selv.'
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('Vi vurderer:'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('hvilket mål du har for å skaffe eller beholde inntektsgivende arbeid')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('om det er nødvendig med utdanning for å kunne nå målet ditt')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'om den aktuelle utdanningen er hensiktsmessig. Da vurderer vi blant annet arbeidsmarkedets behov og dine muligheter.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Vi vurderer utdanningen du vil ta når du søker om stønad.')
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'Skole / utdanningssted' })).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Søker tar eller skal ta utdanning', async () => {
    mockMellomlagretSøknadSkolepenger('/skolepenger/utdanning', {});
    const { screen, user } = await navigerTilStegSkolepenger();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
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
      screen.queryByRole('heading', { level: 3, name: 'Utgifter til skolepenger' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: 'Semesteravgift' })).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: 'Studieavgift' })).not.toBeInTheDocument();
    expect(screen.queryByRole('spinbutton', { name: 'Semesteravgift' })).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) =>
        tekst.includes(
          'Du må legge ved faktura i ditt navn som viser utgiftene dine til studieavgift, semesteravgift og/eller eksamensgebyr'
        )
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) =>
        tekst.includes('Har du andre utgifter i forbindelse med utdanningen?')
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) => tekst.includes('Tilleggsstønader kan dekke utgifter til:'))
    ).not.toBeInTheDocument();
    expect(screen.queryByText((tekst) => tekst.includes('barnepass'))).not.toBeInTheDocument();
    expect(screen.queryByText((tekst) => tekst.includes('læremidler'))).not.toBeInTheDocument();
    expect(screen.queryByText((tekst) => tekst.includes('daglig reise'))).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) => tekst.includes('reise til samling'))
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) =>
        tekst.includes('reise på grunn av oppstart, avslutning eller hjemreise')
      )
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) => tekst.includes('bolig og overnatting'))
    ).not.toBeInTheDocument();
    expect(screen.queryByText((tekst) => tekst.includes('flytting'))).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) =>
        tekst.includes(
          'Vi viser deg videre til søknad om tilleggsstønader når du er ferdig med denne søknaden. Du kan kun få tilleggsstønader hvis du kvalifiserer til overgangsstønad.'
        )
      )
    ).not.toBeInTheDocument();

    await skrivFritekst('Hva er målet med utdanningen?', 'Å bli utdannet', screen, user);

    expect(screen.getByText('Utgifter til skolepenger')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Semesteravgift' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Studieavgift' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Semesteravgift' })).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Du må legge ved faktura i ditt navn som viser utgiftene dine til studieavgift, semesteravgift og/eller eksamensgebyr'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Har du andre utgifter i forbindelse med utdanningen?')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) => tekst.includes('Tilleggsstønader kan dekke utgifter til:'))
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('barnepass'))).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('læremidler'))).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('daglig reise'))).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('reise til samling'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('reise på grunn av oppstart, avslutning eller hjemreise')
      )
    ).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('bolig og overnatting'))).toBeInTheDocument();
    expect(screen.getByText((tekst) => tekst.includes('flytting'))).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Vi viser deg videre til søknad om tilleggsstønader når du er ferdig med denne søknaden. Du kan kun få tilleggsstønader hvis du kvalifiserer til overgangsstønad.'
        )
      )
    ).toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Semesteravgift' }), '200');
    expect(screen.getByText((tekst) => tekst.includes('Tidligere utdanning'))).toBeInTheDocument();
    await user.clear(screen.getByRole('spinbutton', { name: 'Semesteravgift' }));
    expect(
      screen.queryByText((tekst) => tekst.includes('Tidligere utdanning'))
    ).not.toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Studieavgift' }), '200');
    expect(screen.getByText((tekst) => tekst.includes('Tidligere utdanning'))).toBeInTheDocument();
    await user.clear(screen.getByRole('spinbutton', { name: 'Studieavgift' }));
    expect(
      screen.queryByText((tekst) => tekst.includes('Tidligere utdanning'))
    ).not.toBeInTheDocument();

    await user.type(screen.getByRole('spinbutton', { name: 'Eksamensgebyr' }), '200');

    //Tidligere utdanning

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
  }, 20000);
});
