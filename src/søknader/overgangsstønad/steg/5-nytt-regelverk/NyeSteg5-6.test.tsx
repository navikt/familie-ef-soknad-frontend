import { mockMellomlagretSøknadOvergangsstønad } from '../../../../test/axios';
import { describe, expect, test, vi } from 'vitest';
import { klikkCheckbox, navigerTilStegOvergangsstønad } from '../../../../test/aksjoner';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('NyeSteg5-6: Aktivitet og situasjon', () => {
  test('Viser spørsmål 1 ved oppstart', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByText('Hva er situasjonen din?')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg har barn under 14 måneder' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg har barn som trenger særlig tilsyn på grunn av fysiske, psykiske eller store sosiale problemer',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Barnet mitt har en sykdom som ikke er varig' })
    ).toBeInTheDocument();
  });

  test('Spørsmål 2 vises etter å ha svart på spørsmål 1', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(screen.queryByText('Har du inntekt?')).not.toBeInTheDocument();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);

    expect(screen.getByText('Har du inntekt?')).toBeInTheDocument();
  });

  test('Spørsmål 2 er flervalg med alle alternativer', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);

    expect(
      screen.getByRole('checkbox', { name: 'Ja, jeg har inntekt som arbeidstaker' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Ja, jeg har inntekt som selvstendig næringsdrivende',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Ja, jeg får annen stønad fra Nav' })
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Nei' })).toBeInTheDocument();
  });

  test('Viser spørsmål 3 (sagt opp) ved valg av arbeidstaker', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);
    await klikkCheckbox('Ja, jeg har inntekt som arbeidstaker', screen, user);

    expect(
      screen.getByRole('group', {
        name: /Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene/,
      })
    ).toBeInTheDocument();
  });

  test('Viser spørsmål 3 ved valg av nei (ingen inntekt)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);
    await klikkCheckbox('Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: /Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene/,
      })
    ).toBeInTheDocument();
  });

  test('Viser IKKE spørsmål 3 ved kun selvstendig næringsdrivende', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);
    await klikkCheckbox('Ja, jeg har inntekt som selvstendig næringsdrivende', screen, user);

    expect(
      screen.queryByRole('group', {
        name: /Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene/,
      })
    ).not.toBeInTheDocument();
  });

  test('Viser IKKE spørsmål 3 når selvstendig + arbeidstaker er valgt uten utfylt firma', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Jeg har barn under 14 måneder', screen, user);
    await klikkCheckbox('Ja, jeg har inntekt som selvstendig næringsdrivende', screen, user);
    await klikkCheckbox('Ja, jeg har inntekt som arbeidstaker', screen, user);

    expect(
      screen.queryByRole('group', {
        name: /Har du sagt opp jobben eller redusert arbeidstiden de siste 6 månedene/,
      })
    ).not.toBeInTheDocument();
  });

  test('Viser dokumentasjons-alert ved sykdom ikke varig', async () => {
    mockMellomlagretSøknadOvergangsstønad('/aktivitet-og-situasjon', {});
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkCheckbox('Barnet mitt har en sykdom som ikke er varig', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må legge ved dokumentasjon som bekrefter at barnet ditt er sykt')
      )
    ).toBeInTheDocument();
  });
});
