import { mockGet, mockMellomlagretSøknad } from '../../../../test/axios';
import { klikkCheckbox, klikkSvarRadioknapp, navigerTilSteg } from '../../../../test/actions';
import { expect } from 'vitest';
import {
  lagBooleanFelt,
  lagIBarn,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagTekstfelt,
} from '../../../../test/utils';
import { dagensDato, dagensIsoDatoMinusMåneder, formatDate } from '../../../../utils/dato';

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

describe('BarnasBosted-Steg for overgangsstønad og skolepenger', () => {
  test('Skal navigere til BarnasBosted-steg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/barnas-bosted', {});
    const { screen } = await navigerTilSteg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Den andre forelderen og samvær' })
    ).toBeInTheDocument();
  });

  test('Personalia-spm om medforelder dukker opp v terminbarn (oppgir ikke den andre forelderen, annet)', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barnas-bosted',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(0)),
              født: lagSpørsmålBooleanFelt('', '', '', false),
              harSammeAdresse: lagBooleanFelt('', true),
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kan ikke oppgi den andre forelderen', screen, user);

    expect(
      screen.getByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Hvorfor kan du ikke oppgi den andre forelderen?',
      'Annet',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' }),
      'Ymse'
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Personalia-spm om medforelder dukker opp v terminbarn (oppgir ikke den andre forelderen, donor)', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barnas-bosted',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(0)),
              født: lagSpørsmålBooleanFelt('', '', '', false),
              harSammeAdresse: lagBooleanFelt('', true),
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kan ikke oppgi den andre forelderen', screen, user);

    expect(
      screen.getByRole('group', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Hvorfor kan du ikke oppgi den andre forelderen?' })
    ).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Hvorfor kan du ikke oppgi den andre forelderen?',
      'Donor',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
  });

  test('Personalia-spm om medforelder dukker opp v terminbarn ', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barnas-bosted',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(0)),
              født: lagSpørsmålBooleanFelt('', '', '', false),
              harSammeAdresse: lagBooleanFelt('', true),
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kan ikke oppgi den andre forelderen' })
    ).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Ola Nordmann');

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '1234'
    );

    expect(screen.getByText('Ugyldig fødselsnummer eller d-nummer')).toBeInTheDocument();

    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '09469425085'
    );

    expect(
      screen.getByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    );

    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);

    expect(
      screen.getByRole('textbox', { name: 'Fødselsdato (kun hvis du vet)' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).toBeInTheDocument();
  });

  test('Barnets adresse-spm dersom terminbarn ikke skal bo hos søker', async () => {
    mockMellomlagretSøknad(
      'overgangsstonad',
      '/barnas-bosted',
      {},
      {
        person: lagPerson({
          barn: [
            lagIBarn({
              fødselsdato: lagTekstfelt('', dagensIsoDatoMinusMåneder(0)),
              født: lagSpørsmålBooleanFelt('', '', '', false),
              harSammeAdresse: lagBooleanFelt('', false),
            }),
          ],
        }),
      }
    );
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText(`Barn med termin ${formatDate(dagensDato)}`)).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Skal barnet ha adresse hos deg?' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Bor barnets andre forelder i Norge?' })
    ).not.toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Ja, og vi har eller skal registrere adressen i Folkeregisteret',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Du må oppdatere adressen i Folkeregisteret så fort som mulig, slik at vi kan behandle søknaden din med riktig informasjon.'
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Ja, men den andre forelderen samarbeider ikke om adresseendring',
      screen,
      user
    );
    expect(
      screen.getByText((tekst) =>
        tekst.includes(
          'Hvis barnet faktisk bor hos deg, må du ta kontakt med Folkeregisteret for å få hjelp til å registrere riktig adresse.'
        )
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Skal barnet ha adresse hos deg?',
      'Nei, barnet har adresse hos den andre forelderen fordi vi har avtale om delt fast bosted',
      screen,
      user
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    await klikkSvarRadioknapp('Skal barnet ha adresse hos deg?', 'Nei', screen, user);
    expect(
      screen.getByText(
        'Når barnet ikke bor hos deg, har du ikke rett til stønad til enslig mor eller far.'
      )
    );
    expect(screen.getByText('Barnets andre forelder')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
  });

  test('Medforelder bor ikke i Norge', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/barnas-bosted', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText('GÅEN PC')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await klikkSvarRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Nei', screen, user);

    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvilket land bor den andre forelderen i?',
      }),
      'Belgia'
    );

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).toBeInTheDocument();
  });

  test('Medforelder bor i Norge', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/barnas-bosted', {});
    const { screen, user } = await navigerTilSteg();

    expect(screen.getByText('GÅEN PC')).toBeInTheDocument();
    expect(screen.getByText('GÅEN SKADE')).toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).not.toBeInTheDocument();

    await klikkSvarRadioknapp('Bor GÅEN PCs andre forelder i Norge?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', { name: 'Har den andre forelderen samvær med GÅEN PC?' })
    ).toBeInTheDocument();
  });
});
