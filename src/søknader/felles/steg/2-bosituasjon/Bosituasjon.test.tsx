import { describe, expect, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknad } from '../../../../test/axios';
import { navigerTilSteg } from '../../../../test/actions';

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

describe('BosituasjonSteg', () => {
  test('Skal navigere til bosituasjonsteg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen } = await navigerTilSteg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Bosituasjonen din' })
    ).toBeInTheDocument();
  });
});
