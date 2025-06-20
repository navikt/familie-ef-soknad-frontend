import { describe, expect, test, vi } from 'vitest';
import { mockGet } from '../../../../test/axios';
import {
  klikkSvarRadioknapp,
  navigerTilOmDeg,
  settOppMellomlagretSøknad,
} from '../../../../test/utils';

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

describe('OmDegSteg', () => {
  test('Skal navigere til om-deg fra mellomlagret søknad', async () => {
    settOppMellomlagretSøknad();
    const { screen } = await navigerTilOmDeg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Om deg' })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål om uformelt gift dersom bruker er ugift og borPåAdresse er ja', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer spørsmål om separasjon dersom bruker er gift og borPåAdresse er ja', async () => {
    settOppMellomlagretSøknad({ sivilstand: 'GIFT' });
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål og info om adresseendring dersom borPåAdresse er nei', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har du meldt adresseendring til Folkeregisteret?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByText(
        'Du må legge ved dokumentasjon på at du har meldt flytting til Folkeregisteret. Dokumentasjonen må vise at det er du som har endret adresse, hvilken adresse du har meldt flytting til og hvilken dato du flyttet.'
      )
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har du meldt adresseendring til Folkeregisteret?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).toBeInTheDocument();
  });
});
