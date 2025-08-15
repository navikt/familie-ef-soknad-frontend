import { describe, expect, test, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknadOvergangsstønad } from '../../../../../../test/axios';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilStegOvergangsstønad,
} from '../../../../../../test/actions';

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

describe('OmDenTidligereSamboerenDin', () => {
  const gåTilSamlivsbruddMedNoenAndre = async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn?',
      'Samlivsbrudd med noen andre',
      screen,
      user
    );

    return { screen, user };
  };

  test('Rendrer initiale felt når årsak er "Samlivsbrudd med noen andre"', async () => {
    const { screen } = await gåTilSamlivsbruddMedNoenAndre();

    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).toBeInTheDocument();
  });

  test('Viser feilmelding for ugyldig ident og viser flyttedato-velger ved navn + ugyldig ident', async () => {
    const { screen, user } = await gåTilSamlivsbruddMedNoenAndre();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Bink Bonk');
    await user.type(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' }),
      '1234'
    );

    expect(screen.getByText('Ugyldig fødselsnummer eller d-nummer')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();
  });

  test('Vis fødseldato velger når brukerIkkeIdent er satt og disabler ident-felt', async () => {
    const { screen, user } = await gåTilSamlivsbruddMedNoenAndre();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Bink Bonk');

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);

    const identFelt = screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' });
    expect(identFelt).toHaveValue('');
    expect(identFelt).toBeDisabled();

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();
  });

  test('Viser flyttedato velger når navn og ident har gyldig verdi', async () => {
    const { screen, user } = await gåTilSamlivsbruddMedNoenAndre();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Bink Bonk');
    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);

    await user.type(screen.getByRole('textbox', { name: 'Fødselsdato' }), '02.06.1990');

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();
  });
});
