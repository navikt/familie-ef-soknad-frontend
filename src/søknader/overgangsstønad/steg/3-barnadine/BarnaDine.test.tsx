import { mockGet, mockMellomlagretSøknad } from '../../../../test/axios';
import { navigerTilSteg } from '../../../../test/actions';
import { lagBooleanFelt, lagTekstfelt } from '../../../../test/utils';

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

describe('BarnaDine-Steg for overgangsstønad og skolepenger', () => {
  test('Skal navigere til BarnaDine-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        alder: lagTekstfelt('Alder', '4'),
        fødselsdato: lagTekstfelt('Fødselsdato', '2021-05-09'),
        harSammeAdresse: lagBooleanFelt('Har barnet samme adresse som deg?', true),
        id: '1234',
        ident: lagTekstfelt('Fødselsnummer eller d-nummer', '09452195418'),
        navn: lagTekstfelt('Navn', 'LIVSGLAD PARFYME'),
      }
    );
    const { screen } = await navigerTilSteg();

    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });
});
