import { describe, expect, test, vi } from 'vitest';
import React from 'react';
import { waitFor } from '@testing-library/dom';
import { render } from '../../test/render';
import { TestContainer } from '../../test/TestContainer';
import { mockGet } from '../../test/axios';
import axios from 'axios';
import { lagPersonData, lagSistInnsendteSøknad, lagSøker } from '../../test/domeneUtils';
import Environment from '../../Environment';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import SkolepengerApp from './SkolepengerApp';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'skolepenger')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Forside for stønad om skolepenger', () => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'skolepenger'}`) {
      return Promise.resolve({
        data: undefined,
      });
    }
    return mockGet(url, 'skolepenger');
  });

  test('skal vise statiske tekster', async () => {
    const { screen } = render(
      <TestContainer>
        <SkolepengerApp />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(screen.getByText('Hei, Ola Nordmann!')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Søknad om stønad til skolepenger',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Stønaden dekker de faktiske utgiftene du har til studieavgift, semesteravgift og eksamensgebyr når du er enslig mor eller far som tar utdanning. Stønaden dekker utgiftene dine opp til en maksimumsats.'
      )
    ).toBeInTheDocument();
  });

  test('skal vise infotekst for personer under 18 år', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
        return Promise.resolve({
          data: lagPersonData({
            søker: lagSøker({ forkortetNavn: 'Kari Nordmann', alder: 16 }),
          }),
        });
      }
      if (url === `${Environment().mellomlagerProxyUrl + 'skolepenger'}`) {
        return Promise.resolve({
          data: undefined,
        });
      }
      return mockGet(url, 'skolepenger');
    });

    const { screen } = render(
      <TestContainer>
        <SkolepengerApp />
      </TestContainer>
    );

    await waitFor(async () => {
      const velkomsthilsen = screen.getByText('Hei, Kari Nordmann!');
      expect(velkomsthilsen).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'Stønaden dekker de faktiske utgiftene du har til studieavgift, semesteravgift og eksamensgebyr når du er enslig mor eller far som tar utdanning. Stønaden dekker utgiftene dine opp til en maksimumsats.'
      )
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'skjemaet',
      })
    ).toHaveAttribute(
      'href',
      'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.01/brev'
    );
  });

  test('skal vise varsel om tidligere innsendt søknad', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`) {
        return Promise.resolve({
          data: [
            lagSistInnsendteSøknad({
              søknadsdato: '2025-05-17',
              stønadType: Stønadstype.skolepenger,
            }),
          ],
        });
      }
      if (url === `${Environment().mellomlagerProxyUrl + 'skolepenger'}`) {
        return Promise.resolve({
          data: undefined,
        });
      }
      return mockGet(url, 'skolepenger');
    });

    const { screen } = render(
      <TestContainer>
        <SkolepengerApp />
      </TestContainer>
    );

    await waitFor(async () => {
      expect(screen.getByText('Hei, Ola Nordmann!')).toBeInTheDocument();

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: 'Du har nylig sendt inn en søknad til oss',
        })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Du søkte om SKOLEPENGER den 17.05.2025.')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Stønaden dekker de faktiske utgiftene du har til studieavgift, semesteravgift og eksamensgebyr når du er enslig mor eller far som tar utdanning. Stønaden dekker utgiftene dine opp til en maksimumsats.'
      )
    ).toBeInTheDocument();
  });

  test('skal navigere videre til neste steg', async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url === `${Environment().mellomlagerProxyUrl + 'skolepenger'}`) {
        return Promise.resolve({
          data: undefined,
        });
      }
      return mockGet(url, 'skolepenger');
    });

    const { screen, user } = render(
      <TestContainer>
        <SkolepengerApp />
      </TestContainer>
    );

    await waitFor(async () => {
      const velkomsthilsen = screen.getByText('Hei, Ola Nordmann!');
      expect(velkomsthilsen).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: 'Start søknad' })).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Jeg, Ola Nordmann, bekrefter at jeg vil gi riktige og fullstendige opplysninger',
      })
    );
    expect(screen.getByRole('button', { name: 'Start søknad' })).toBeEnabled();

    expect(screen.queryByRole('heading', { level: 2, name: 'Om deg' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start søknad' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Om deg' })).toBeInTheDocument();
  });
});
