import { describe, expect, test, vi } from 'vitest';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { render } from '../../../../test/render';
import OmDeg from './OmDeg';
import { OmDegProvider } from './OmDegContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import ContextProviders from '../../../../context/ContextProviders';
import { SpråkProvider } from '../../../../context/SpråkContext';
import React from 'react';
import { within } from '@testing-library/dom';

// Må tunes på, kun ment som inspirasjon
describe('OmDegSteg', () => {
  test('Første test', async () => {
    const { screen, user } = render(
      <SpråkProvider>
        <ContextProviders>
          <Router basename={'/'}>
            <Routes>
              <Route
                path={'/om-deg'}
                element={
                  <OmDegProvider stønadstype={Stønadstype.overgangsstønad}>
                    <OmDeg />
                  </OmDegProvider>
                }
              />
              <Route path={'*'} element={<Navigate to={'/om-deg'} />} />
            </Routes>
          </Router>
        </ContextProviders>
      </SpråkProvider>
    );
    // const sideTittel = screen.getByRole('heading', {
    //   level: 1,
    //   name: 'Søknad om overgangsstønad',
    // });
    // const stegindikator = screen.getByText('Steg 1 av 8');
    // const personopplysningerTittel = screen.getByRole('heading', {
    //   level: 2,
    //   name: 'Om deg',
    // });
    // const personopplysningerInfostripe = screen.getByText(
    //   'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.'
    // );
    // //TODO: Disse burde ikke være heading level 3 eller label
    // const fødselsnummer = screen.getByRole('heading', {
    //   level: 1,
    //   name: 'Fødselsnummer eller d-nummer',
    // });
    // const statsborgerskap = screen.getByRole('heading', {
    //   level: 1,
    //   name: 'Statsborgerskap',
    // });
    // const sivilstatus = screen.getByRole('heading', {
    //   level: 1,
    //   name: 'Sivilstatus',
    // });
    // const adresse = screen.getByRole('heading', {
    //   level: 1,
    //   name: 'Adresse',
    // });
    //
    // expect(sideTittel).toBeInTheDocument();
    // expect(stegindikator).toBeInTheDocument();
    // expect(personopplysningerTittel).toBeInTheDocument();
    // expect(personopplysningerInfostripe).toBeInTheDocument();
    // expect(fødselsnummer).toBeInTheDocument();
    // expect(statsborgerskap).toBeInTheDocument();
    // expect(sivilstatus).toBeInTheDocument();
    // expect(adresse).toBeInTheDocument();
    //
    // const borDuPåDenneAdrssenGruppe = screen.getByRole('group', {
    //   name: 'Bor du på denne adressen?',
    // });
    // const radioJa = within(borDuPåDenneAdrssenGruppe).getByRole('radio', {
    //   name: 'Ja',
    // });
    // await user.click(radioJa);
  });
});
