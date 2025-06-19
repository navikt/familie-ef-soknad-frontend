import { describe, expect, test, vi } from 'vitest';
import { mockGet } from '../../../../test/axios';
import axios from 'axios';
import { TestContainer } from '../../../../test/TestContainer';
import App from '../../../../App';
import { waitFor, within } from '@testing-library/dom';
import { render } from '../../../../test/render';
import Environment from '../../../../Environment';
import {
  lagMellomlagretSøknadOvergangsstønad,
  lagPerson,
  lagSøker,
  lagSøknadOvergangsstønad,
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

vi.mock('../assets/FilIkon.tsx', async () => {
  const React = await import('react');
  return {
    ReactComponent: () =>
      React.createElement('div', { 'data-testid': 'mock-fil-ikon' }),
  };
});

describe('OmDegSteg', () => {
  test('Skal navigere til om-deg fra mellomlagret søknad', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
        return Promise.resolve({
          data: lagMellomlagretSøknadOvergangsstønad({
            søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
            gjeldendeSteg: '/om-deg',
          }),
        });
      }
      return mockGet(url, 'overgangsstonad');
    });

    const { screen, user } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Søknad om overgangsstønad',
        })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Fortsett på søknaden',
      })
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Om deg' })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål om uformelt gift dersom bruker er ugift og borPåAdresse er ja', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
        return Promise.resolve({
          data: lagMellomlagretSøknadOvergangsstønad({
            søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
            gjeldendeSteg: '/om-deg',
          }),
        });
      }
      return mockGet(url, 'overgangsstonad');
    });

    const { screen, user } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Søknad om overgangsstønad',
        })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Fortsett på søknaden',
      })
    );
    const borDuPåDenneAdressenGruppe = screen.getByRole('group', {
      name: 'Bor du på denne adressen?',
    });

    await user.click(
      within(borDuPåDenneAdressenGruppe).getByRole('radio', { name: 'Ja' })
    );

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer spørsmål om separasjon dersom bruker er gift og borPåAdresse er ja', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
        return Promise.resolve({
          data: lagMellomlagretSøknadOvergangsstønad({
            søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
            gjeldendeSteg: '/om-deg',
          }),
        });
      }
      if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
        return Promise.resolve({
          data: lagPerson({ søker: lagSøker({ sivilstand: 'GIFT' }) }),
        });
      }

      return mockGet(url, 'overgangsstonad');
    });

    const { screen, user } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Søknad om overgangsstønad',
        })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Fortsett på søknaden',
      })
    );
    const borDuPåDenneAdressenGruppe = screen.getByRole('group', {
      name: 'Bor du på denne adressen?',
    });

    await user.click(
      within(borDuPåDenneAdressenGruppe).getByRole('radio', { name: 'Ja' })
    );

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål og info om adresseendring dersom borPåAdresse er nei', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
        return Promise.resolve({
          data: lagMellomlagretSøknadOvergangsstønad({
            søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
            gjeldendeSteg: '/om-deg',
          }),
        });
      }
      return mockGet(url, 'overgangsstonad');
    });

    const { screen, user } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: 'Søknad om overgangsstønad',
        })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole('button', {
        name: 'Fortsett på søknaden',
      })
    );
    const borDuPåDenneAdressenGruppe = screen.getByRole('group', {
      name: 'Bor du på denne adressen?',
    });

    await user.click(
      within(borDuPåDenneAdressenGruppe).getByRole('radio', { name: 'Nei' })
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).toBeInTheDocument();

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'Har du meldt adresseendring til Folkeregisteret?',
        })
      ).getByRole('radio', { name: 'Ja' })
    );

    expect(
      screen.getByText(
        'Du må legge ved dokumentasjon på at du har meldt flytting til Folkeregisteret. Dokumentasjonen må vise at det er du som har endret adresse, hvilken adresse du har meldt flytting til og hvilken dato du flyttet.'
      )
    ).toBeInTheDocument();

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'Har du meldt adresseendring til Folkeregisteret?',
        })
      ).getByRole('radio', { name: 'Nei' })
    );

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).toBeInTheDocument();
  });
});
