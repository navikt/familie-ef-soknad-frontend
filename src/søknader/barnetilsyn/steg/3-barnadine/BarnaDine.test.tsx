import { mockGet, mockMellomlagretSøknadBarnetilsyn } from '../../../../test/axios';
import { navigerTilStegBarnetilsyn } from '../../../../test/actions';
import { expect } from 'vitest';

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

describe('BarnaDine-Steg for barnetilsyn', () => {
  test('Skal navigere til BarnaDine-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barn', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });
});
