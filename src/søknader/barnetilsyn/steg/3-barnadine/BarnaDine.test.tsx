import { mockGet, mockMellomlagretSøknadBarnetilsyn } from '../../../../test/axios';
import {
  klikkCheckbox,
  klikkKomponentMedId,
  navigerTilStegBarnetilsyn,
} from '../../../../test/actions';
import { expect } from 'vitest';
import {
  lagBooleanFelt,
  lagIBarn,
  lagIMedforelder,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagTekstfelt,
} from '../../../../test/domeneUtils';
import { dagensIsoDatoMinusMåneder } from '../../../../utils/dato';

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
    mockMellomlagretSøknadBarnetilsyn('/barnetilsyn/barn', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Initielle tekster er til stede', async () => {
    mockMellomlagretSøknadBarnetilsyn('/barnetilsyn/barn', {});
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByText('Hvilke barn skal være med i søknaden?')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Dette sier regelverket om hvilke barn du kan få stønad til barnetilsyn for',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hovedregelen er at du kan få stønad til barnetilsyn frem til barnet ditt har fullført 4. skoleår.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'På dette alderstrinnet er barn normalt blitt tilstrekkelig selvhjulpne og modne slik at de klarer seg utenfor skoletiden både i hjemmet og i sitt vanlige nærmiljø i den tiden du er fraværende på grunn av arbeid.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'I noen tilfeller kan du få stønad til barnetilsyn etter at barnet ditt er ferdig med 4. skoleår:'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du har barn som trenger vesentlig mer pass enn jevnaldrende. Du må dokumentere behovet med uttalelse fra lege, spesialist eller annet helsepersonell.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du har en jobb som medfører at du må være borte fra hjemmet i lengre perioder. For at fraværet skal anses som mer langvarig enn vanlig, må det overstige 10 timer per dag. Du må dokumentere arbeidstiden.'
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis du har uregelmessig arbeidstid, for eksempel om kvelden og natten, skiftarbeid, helgearbeid, turnustjeneste, pendlerforhold og arbeid til sjøs. Du må dokumentere arbeidstiden.'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Informasjonen er hentet fra Folkeregisteret og viser barna dine under 19 år. Hvis noe ikke stemmer, kan du endre informasjonen hos Folkeregisteret.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Hvis du skal søke stønad for barn du har overtatt foreldreansvaret for på grunn av dødsfall, eller hvis du har barn med adressebeskyttelse, kan du ikke bruke denne digitale søknaden. Bruk dette'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'skjemaet for å søke om stønad til barnetilsyn.' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });
  test('Skal rendre riktig data fra barn', async () => {
    mockMellomlagretSøknadBarnetilsyn(
      '/barnetilsyn/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
              fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(65) }),
              ident: lagTekstfelt({ verdi: '18877598140' }),
              født: lagSpørsmålBooleanFelt({ verdi: true }),
              alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
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
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(screen.getByRole('heading', { level: 3, name: 'GÅEN PC' })).toBeInTheDocument();

    expect(screen.getByText('Fødselsnummer')).toBeInTheDocument();
    expect(screen.getByText('188775 98140')).toBeInTheDocument();

    expect(screen.getByText('Alder')).toBeInTheDocument();
    expect(screen.getByText('5 år')).toBeInTheDocument();

    expect(screen.getByText('Bosted')).toBeInTheDocument();
    expect(screen.getByText('Registrert på adressen din')).toBeInTheDocument();

    expect(screen.getByText('Annen forelder')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', { name: 'Søk om stønad til barnetilsyn for barnet' })
    ).toBeInTheDocument();
  });
  test('Velge barn', async () => {
    mockMellomlagretSøknadBarnetilsyn(
      '/barnetilsyn/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
              fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(65) }),
              ident: lagTekstfelt({ verdi: '18877598140' }),
              født: lagSpørsmålBooleanFelt({ verdi: true }),
              alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
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
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByRole('checkbox', { name: 'Søk om stønad til barnetilsyn for barnet' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkCheckbox('Søk om stønad til barnetilsyn for barnet', screen, user);

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
  });
  test('Velge flere barn', async () => {
    mockMellomlagretSøknadBarnetilsyn(
      '/barnetilsyn/barn',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
              fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(65) }),
              ident: lagTekstfelt({ verdi: '18877598140' }),
              født: lagSpørsmålBooleanFelt({ verdi: true }),
              alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
              harSammeAdresse: lagBooleanFelt('', true),
              medforelder: {
                label: '',
                verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
              },
            }),
            lagIBarn({
              id: '123',
              navn: lagTekstfelt({ label: 'Navn', verdi: 'KJEMPEKUL SEKK' }),
              fødselsdato: lagTekstfelt({ verdi: dagensIsoDatoMinusMåneder(45) }),
              ident: lagTekstfelt({ verdi: '09521467514' }),
              født: lagSpørsmålBooleanFelt({ verdi: true }),
              alder: lagTekstfelt({ label: 'Alder', verdi: '3' }),
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
    const { screen, user } = await navigerTilStegBarnetilsyn();

    expect(screen.getByTestId('avhuk-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkKomponentMedId('avhuk-0', screen, user);

    await klikkKomponentMedId('avhuk-1', screen, user);

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(
      screen.queryByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).not.toBeInTheDocument();
  });
  test('Søker har ingen barn', async () => {
    mockMellomlagretSøknadBarnetilsyn(
      '/barnetilsyn/barn',
      {},
      {
        person: lagPerson({
          barn: [],
        }),
      }
    );
    const { screen } = await navigerTilStegBarnetilsyn();

    expect(
      screen.getByText((tekst) => tekst.includes('Du har ingen barn registrert i Folkeregisteret.'))
    ).toBeInTheDocument();

    expect(
      screen.getByText('Du må svare på alle spørsmålene før du kan gå videre til neste steg')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });
});
