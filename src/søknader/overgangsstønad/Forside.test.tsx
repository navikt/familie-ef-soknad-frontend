import { describe, expect, test, vi } from 'vitest';
import React from 'react';
import { waitFor } from '@testing-library/dom';
import Environment from '../../Environment';
import {
  lagMellomlagretSøknadOvergangsstønad,
  lagPersonData,
  lagSøker,
} from '../../test/utils';
import { render } from '../../test/render';
import App from '../../App';
import { TestContainer } from '../../test/TestContainer';
import axios from 'axios';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url) => {
        if (url === `${Environment().apiProxyUrl}/api/innlogget`) {
          return Promise.resolve({ status: 200 });
        }
        if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
          return Promise.resolve({
            data: lagPersonData({
              søker: lagSøker({ forkortetNavn: 'Kjell Gunnar Midtlyng' }),
            }),
          });
        }
        if (
          url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`
        ) {
          return Promise.resolve({
            data: lagMellomlagretSøknadOvergangsstønad(),
          });
        }
        if (
          url ===
          `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`
        ) {
          return Promise.resolve({
            data: [],
          });
        }
        return Promise.resolve({ data: {} });
      }),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('Forside for overgangsstønad', () => {
  test('skal vise statiske tekster', async () => {
    const { screen } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      const velkomsthilsen = screen.getByText('Hei, Kjell Gunnar Midtlyng!');
      expect(velkomsthilsen).toBeInTheDocument();
    });

    const sideTittel = screen.getByRole('heading', {
      level: 1,
      name: 'Søknad om overgangsstønad',
    });
    expect(sideTittel).toBeInTheDocument();

    const førsteAvsnitt = screen.getByText(
      'Er du enslig mor eller far og har barn under 8 år, vil overgangsstønaden sikre deg inntekt i inntil 3 år. I noen tilfeller kan vi forlenge denne perioden. Inntekten din avgjør hvor mye du har rett til i stønad.'
    );
    expect(førsteAvsnitt).toBeInTheDocument();
  });

  test('skal ikke vise alert under atten', async () => {
    const { screen } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      const velkomsthilsen = screen.getByText('Hei, Kjell Gunnar Midtlyng!');
      expect(velkomsthilsen).toBeInTheDocument();
    });

    const infoAlert = screen.queryByRole('heading', {
      level: 3,
      name: 'Du har nylig sendt inn en søknad til oss',
    });
    expect(infoAlert).not.toBeInTheDocument();
  });

  test('skal vise alert under atten', async () => {
    const { screen } = render(
      <TestContainer>
        <App />
      </TestContainer>
    );

    await waitFor(async () => {
      const velkomsthilsen = screen.getByText('Hei, Kjell Gunnar Midtlyng!');
      expect(velkomsthilsen).toBeInTheDocument();
    });

    const infoAlert = screen.queryByRole('heading', {
      level: 3,
      name: 'Du har nylig sendt inn en søknad til oss',
    });
    expect(infoAlert).not.toBeInTheDocument();
  });
});
