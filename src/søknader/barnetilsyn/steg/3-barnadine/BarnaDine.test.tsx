import { mockGet, mockMellomlagretSøknadBarnetilsyn } from '../../../../test/axios';
import { navigerTilStegBarnetilsyn } from '../../../../test/actions';

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

describe('BarnaDine-Steg for barnetilsyn', () => {
  test('Skal navigere til BarnaDine-steg fra mellomlagret søknad, barnetilsyn', async () => {
    mockMellomlagretSøknadBarnetilsyn('barnetilsyn', '/barn', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });
  //
  // test('Skal rendre riktig data fra barn, barnetilsyn', async () => {
  //   mockMellomlagretSøknadBarnetilsyn(
  //     'barnetilsyn',
  //     '/barn',
  //     {},
  //     {
  //       person: lagPerson({
  //         barn: [
  //           lagIBarn({
  //             navn: lagTekstfelt('Navn', 'GÅEN PC'),
  //             fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(65)),
  //             ident: lagTekstfelt('', '18877598140'),
  //             født: lagSpørsmålBooleanFelt('', '', '', true),
  //             alder: lagTekstfelt('Alder', '5'),
  //             harSammeAdresse: lagBooleanFelt('', true),
  //             medforelder: {
  //               label: '',
  //               verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
  //             },
  //           }),
  //         ],
  //       }),
  //     }
  //   );
  //   const { screen } = await navigerTilSteg('overgangsstonad');
  //
  //   console.log(prettyDOM(undefined, Infinity));
  //
  //   expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();
  //
  //   expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
  //   expect(screen.getByText('188775 98140')).toBeInTheDocument();
  //
  //   expect(screen.getByText('Alder')).toBeInTheDocument();
  //   expect(screen.getByText('5 år')).toBeInTheDocument();
  //
  //   expect(screen.getByText('Bosted')).toBeInTheDocument();
  //   expect(screen.getByText('Registrert på adressen din')).toBeInTheDocument();
  //
  //   expect(screen.getByText('Annen forelder')).toBeInTheDocument();
  //   expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();
  //
  //   expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  // });
});
