import { describe, expect, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknad, mockPost } from '../../../../test/axios';
import { klikkRadioknapp, navigerTilSteg } from '../../../../test/actions';

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

describe('BosituasjonSteg', () => {
  test('Skal navigere til bosituasjonsteg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen } = await navigerTilSteg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Bosituasjonen din' })
    ).toBeInTheDocument();
    expect(screen.getByText('Barna dine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Bruker bor sammen med en hen har eller venter barn med', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen, user } = await navigerTilSteg();

    expect(
      screen.queryByText(
        'Når du bor sammen med en du har eller venter barn med, har du ikke rett til stønad til enslig mor eller far'
      )
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Ja, jeg bor sammen med en jeg har eller venter barn med',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Når du bor sammen med en du har eller venter barn med, har du ikke rett til stønad til enslig mor eller far'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });
});
