import { mockGet, mockMellomlagretSøknad } from '../../../../test/axios';
import { klikkSvarRadioknapp, navigerTilSteg } from '../../../../test/actions';
import { expect } from 'vitest';
import {
  lagBooleanFelt,
  lagIBarn,
  lagIMedforelder,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagTekstfelt,
} from '../../../../test/utils';
import { dagensDato, dagensIsoDatoMinusMåneder, formatDate } from '../../../../utils/dato';
import { addDays } from 'date-fns';

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
    mockMellomlagretSøknad('overgangsstonad', '/barn', {});
    const { screen } = await navigerTilSteg();

    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Skal rendre riktig data fra barn', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt('Navn', 'GÅEN PC'),
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(65)),
              ident: lagTekstfelt('', '18877598140'),
              født: lagSpørsmålBooleanFelt('', '', '', true),
              alder: lagTekstfelt('Alder', '5'),
              harSammeAdresse: lagBooleanFelt('', true),
              medforelder: {
                label: '',
                verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
              },
            }),
          ],
        }),
      }
    );
    const { screen } = await navigerTilSteg();

    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();

    expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
    expect(screen.getByText('188775 98140')).toBeInTheDocument();

    expect(screen.getByText('Alder')).toBeInTheDocument();
    expect(screen.getByText('5 år')).toBeInTheDocument();

    expect(screen.getByText('Bosted')).toBeInTheDocument();
    expect(screen.getByText('Registrert på adressen din')).toBeInTheDocument();

    expect(screen.getByText('Annen forelder')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Legge til nytt barn lager nytt barnekort', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt('Navn', 'GÅEN PC'),
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(65)),
              ident: lagTekstfelt('', '18877598140'),
              født: lagSpørsmålBooleanFelt('', '', '', true),
              alder: lagTekstfelt('Alder', '5'),
              harSammeAdresse: lagBooleanFelt('', true),
              medforelder: {
                label: '',
                verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
              },
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    await user.click(screen.getByRole('button', { name: 'Legg til barn' }));
    expect(screen.getByRole('textbox', { name: 'Termindato' })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Termindato' }), formatDate(dagensDato));
    expect(screen.getByRole('group', { name: 'Skal barnet bo hos deg?' })).toBeInTheDocument();

    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Nei', screen, user);
    expect(
      screen.getByText(
        'Når barnet ikke skal bo hos deg, har du ikke rett til stønad til enslig mor eller far'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('leggTilBarnModal')).toBeInTheDocument();

    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Ja', screen, user);
    expect(
      screen.queryByText(
        'Når barnet ikke skal bo hos deg, har du ikke rett til stønad til enslig mor eller far'
      )
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('leggTilBarnModal')).toBeInTheDocument();

    await user.click(screen.getByTestId('leggTilBarnModal'));

    expect(screen.getByRole('heading', { level: 3, name: 'Barn' })).toBeInTheDocument();
    expect(screen.getAllByText('Alder').length).equal(2);
    expect(screen.getByText('Ufødt')).toBeInTheDocument();
    expect(screen.getAllByText('Bosted').length).equal(2);
    expect(screen.getByText('Skal bo hos deg')).toBeInTheDocument();
  });

  test('Endre terminbarn', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt('Navn', 'GÅEN PC'),
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(65)),
              ident: lagTekstfelt('', '18877598140'),
              født: lagSpørsmålBooleanFelt('', '', '', true),
              alder: lagTekstfelt('Alder', '5'),
              harSammeAdresse: lagBooleanFelt('', true),
              medforelder: {
                label: '',
                verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
              },
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    await user.click(screen.getByRole('button', { name: 'Legg til barn' }));
    await user.type(screen.getByRole('textbox', { name: 'Termindato' }), formatDate(dagensDato));
    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Ja', screen, user);
    await user.click(screen.getByTestId('leggTilBarnModal'));

    expect(screen.getByRole('heading', { level: 3, name: 'Barn' })).toBeInTheDocument();
    expect(screen.getByText(formatDate(dagensDato))).toBeInTheDocument();
    expect(screen.getAllByText('Alder').length).equal(2);
    expect(screen.getByText('Ufødt')).toBeInTheDocument();
    expect(screen.getAllByText('Bosted').length).equal(2);
    expect(screen.getByText('Skal bo hos deg')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Endre' }));

    expect(screen.getByRole('textbox', { name: 'Termindato' })).toHaveValue('');
    expect(screen.getByText('Du må legge ved terminbekreftelse')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Skal barnet bo hos deg?' })).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Termindato' }),
      formatDate(addDays(dagensDato, 1))
    );
    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Nei', screen, user);
    await user.click(screen.getByTestId('leggTilBarnModal'));

    expect(screen.getByRole('heading', { level: 3, name: 'Barn' })).toBeInTheDocument();
    expect(screen.getByText(formatDate(addDays(dagensDato, 1)))).toBeInTheDocument();
    expect(screen.getAllByText('Alder').length).equal(2);
    expect(screen.getByText('Ufødt')).toBeInTheDocument();
    expect(screen.getAllByText('Bosted').length).equal(2);
    expect(screen.getByText('Skal ikke bo hos deg')).toBeInTheDocument();
  });

  test('Fjerne terminbarn', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt('Navn', 'GÅEN PC'),
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(65)),
              ident: lagTekstfelt('', '18877598140'),
              født: lagSpørsmålBooleanFelt('', '', '', true),
              alder: lagTekstfelt('Alder', '5'),
              harSammeAdresse: lagBooleanFelt('', true),
              medforelder: {
                label: '',
                verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
              },
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    await user.click(screen.getByRole('button', { name: 'Legg til barn' }));
    await user.type(screen.getByRole('textbox', { name: 'Termindato' }), formatDate(dagensDato));
    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Ja', screen, user);
    await user.click(screen.getByTestId('leggTilBarnModal'));

    expect(screen.getByRole('heading', { level: 3, name: 'Barn' })).toBeInTheDocument();
    expect(screen.getAllByText('Alder').length).equal(2);
    expect(screen.getByText('Ufødt')).toBeInTheDocument();
    expect(screen.getAllByText('Bosted').length).equal(2);
    expect(screen.getByText('Skal bo hos deg')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fjern fra søknad' }));

    expect(screen.queryByRole('heading', { level: 3, name: 'Barn' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Alder').length).equal(1);
    expect(screen.queryByText('Ufødt')).not.toBeInTheDocument();
    expect(screen.getAllByText('Bosted').length).equal(1);
    expect(screen.queryByText('Skal bo hos deg')).not.toBeInTheDocument();
  });

  test('Ikke vise neste-knapp dersom bruker ikke har barn, vise den dersom de har terminbarn', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barn',
      {},
      {
        person: lagPerson({
          barn: [],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Legg til barn' }));
    await user.type(screen.getByRole('textbox', { name: 'Termindato' }), formatDate(dagensDato));
    await klikkSvarRadioknapp('Skal barnet bo hos deg?', 'Ja', screen, user);
    await user.click(screen.getByTestId('leggTilBarnModal'));

    expect(screen.queryByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });
});
