import { describe, expect, test, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknadBarnetilsyn, mockPost } from '../../../../test/axios';
import {
  klikkRadioknapp,
  navigerTilStegBarnetilsyn,
  skrivFritekst,
} from '../../../../test/actions';
import { dagensDato, formatMånederTilbake } from '../../../../utils/dato';
import { prettyDOM } from '@testing-library/dom';

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

describe('Barnepass-Steg', () => {
  test('Skal navigere til barnepass-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Om barnepassordningen' })
    ).toBeInTheDocument();
  });
  test('Initielle tekster er tilstede', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Om barnepassordningen' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Hva slags barnepassordning har GÅEN PC?' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  test('Barnet er i barnehage, SFO eller lignende', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(
      screen.queryByRole('textbox', { name: 'Navn på barnepassordningen' })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Hva slags barnepassordning har GÅEN PC?',
      'Barnehage, SFO eller liknende',
      screen,
      user
    );
    expect(screen.getByRole('textbox', { name: 'Navn på barnepassordningen' })).toBeInTheDocument();

    expect(
      screen.queryByText('I hvilken periode har GÅEN PC denne barnepassordningen?')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Stønad til barnetilsyn gis normalt for 1 år av gangen, og du må søke på nytt og dokumentere utgiftene hvert år. Du trenger bare oppgi perioden du søker for nå.'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Startdato' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Sluttdato' })).not.toBeInTheDocument();
    await skrivFritekst('Navn på barnepassordningen', 'Barnehage', screen, user);
    expect(
      screen.getByText('I hvilken periode har GÅEN PC denne barnepassordningen?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stønad til barnetilsyn gis normalt for 1 år av gangen, og du må søke på nytt og dokumentere utgiftene hvert år. Du trenger bare oppgi perioden du søker for nå.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Startdato' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Sluttdato' })).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Startdato', '01.06.2025', screen, user);
    expect(
      screen.queryByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Sluttdato', '01.12.2025', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stønaden bidrar til utgifter du har til opphold. Utgifter til kost, bleier og lignende dekkes ikke.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Du må legge ved faktura fra barnepassordningen.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Vi må ha ny faktura for hvert barnehage-/skoleår. Det er ikke tilstrekkelig at du har levert faktura for tidligere år. Fakturaen må stå i ditt navn, og utgifter til opphold må være spesifisert.'
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Har du flere barnepassordninger for GÅEN PC?')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Legg til en barnepassordning' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      })
    ).not.toBeInTheDocument();
    await skrivFritekst('Beløp pr måned (ikke inkludert kost)', '150', screen, user);
    expect(screen.getByText('Har du flere barnepassordninger for GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Legg til en barnepassordning' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });
  test('Dagmamma eller annen privat ordning', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(
      screen.queryByRole('textbox', { name: 'Navn på barnepassordningen' })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Hva slags barnepassordning har GÅEN PC?',
      'Dagmamma eller annen privat ordning',
      screen,
      user
    );
    expect(
      screen.getByRole('textbox', {
        name: 'Navn på barnepassordningen eller personen som passer GÅEN PC',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('I hvilken periode har GÅEN PC denne barnepassordningen?')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Stønad til barnetilsyn gis normalt for 1 år av gangen, og du må søke på nytt og dokumentere utgiftene hvert år. Du trenger bare oppgi perioden du søker for nå.'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Startdato' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Sluttdato' })).not.toBeInTheDocument();
    await skrivFritekst(
      'Navn på barnepassordningen eller personen som passer GÅEN PC',
      'Barnehage',
      screen,
      user
    );
    expect(
      screen.getByText('I hvilken periode har GÅEN PC denne barnepassordningen?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stønad til barnetilsyn gis normalt for 1 år av gangen, og du må søke på nytt og dokumentere utgiftene hvert år. Du trenger bare oppgi perioden du søker for nå.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Startdato' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Sluttdato' })).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Startdato', '01.06.2025', screen, user);
    expect(
      screen.queryByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Sluttdato', '01.12.2025', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Beløp pr måned (ikke inkludert kost)' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stønaden bidrar til utgifter du har til opphold. Utgifter til kost, bleier og lignende dekkes ikke.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må legge ved avtalen du har med barnepasseren. Her er et')
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: 'forslag til hvordan en privat avtale om barnepass kan se ut',
      })
    ).toHaveAttribute('href', '/familie/alene-med-barn/soknad/filer/Avtale_privat_barnepass.pdf');
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
      screen.queryByText('Har du flere barnepassordninger for GÅEN PC?')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Legg til en barnepassordning' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      })
    ).not.toBeInTheDocument();
    await skrivFritekst('Beløp pr måned (ikke inkludert kost)', '150', screen, user);
    expect(screen.getByText('Har du flere barnepassordninger for GÅEN PC?')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Legg til en barnepassordning' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
  });

  test('Nav kan vurdere hva hvilken måned søker har rett til stønad', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen, user } = await navigerTilStegBarnetilsyn();

    await klikkRadioknapp(
      'Hva slags barnepassordning har GÅEN PC?',
      'Barnehage, SFO eller liknende',
      screen,
      user
    );
    await skrivFritekst('Navn på barnepassordningen', 'Barnehage', screen, user);
    await skrivFritekst('Startdato', '01.06.2025', screen, user);
    await skrivFritekst('Sluttdato', '01.12.2025', screen, user);
    await skrivFritekst('Beløp pr måned (ikke inkludert kost)', '150', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          `Du kan få stønad til barnetilsyn fra og med den måneden du har rett til stønaden. Du kan ha rett til stønad i inntil 3 måneder før du søker. Det vil si fra og med ${formatMånederTilbake(dagensDato, 3)}.`
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
      'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      'Nei, Nav kan vurdere fra hvilken måned jeg har rett til stønad',
      screen,
      user
    );

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
  test('Søker fra bestemt måned', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen, user } = await navigerTilStegBarnetilsyn();

    await klikkRadioknapp(
      'Hva slags barnepassordning har GÅEN PC?',
      'Barnehage, SFO eller liknende',
      screen,
      user
    );
    await skrivFritekst('Navn på barnepassordningen', 'Barnehage', screen, user);
    await skrivFritekst('Startdato', '01.06.2025', screen, user);
    await skrivFritekst('Sluttdato', '01.12.2025', screen, user);
    await skrivFritekst('Beløp pr måned (ikke inkludert kost)', '150', screen, user);

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(screen.queryByText('Når søker du stønad fra?')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Jeg søker stønad til barnetilsyn fra og med' })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      'Ja',
      screen,
      user
    );
    expect(screen.getByText('Når søker du stønad fra?')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Jeg søker stønad til barnetilsyn fra og med' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Åpne månedsvelger' }));
    await user.click(screen.getByRole('button', { name: 'august' }));

    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Kan navigere seg til neste', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barnetilsyn/barnepass');
    const { screen, user } = await navigerTilStegBarnetilsyn();

    await klikkRadioknapp(
      'Hva slags barnepassordning har GÅEN PC?',
      'Barnehage, SFO eller liknende',
      screen,
      user
    );
    await skrivFritekst('Navn på barnepassordningen', 'Barnehage', screen, user);
    await skrivFritekst('Startdato', '01.06.2025', screen, user);
    await skrivFritekst('Sluttdato', '01.12.2025', screen, user);
    await skrivFritekst('Beløp pr måned (ikke inkludert kost)', '150', screen, user);
    await klikkRadioknapp(
      'Søker du om stønad til barnetilsyn fra en bestemt måned?',
      'Nei, Nav kan vurdere fra hvilken måned jeg har rett til stønad',
      screen,
      user
    );
    await user.click(screen.getByRole('button', { name: 'Neste' }));

    console.log(prettyDOM(undefined, Infinity));

    expect(screen.getByRole('heading', { level: 2, name: 'Oppsummering' })).toBeInTheDocument();
  });
});

//Barn som er over 4.klassetrinn-test trengs. Se gift, 2 barn for eksempeltekst. Er både ekstra hjelpetekst og et ekstra spørsmål
