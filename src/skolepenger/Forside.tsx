import React from 'react';
import { usePersonContext } from '../context/PersonContext';
import { useSkolepengerSøknad } from './SkolepengerContext';
import Environment from '../Environment';
import FortsettSøknad from '../søknad/forside/FortsettSøknad';
import LocaleTekst from '../language/LocaleTekst';
import { logSidevisningSkolepenger } from '../utils/amplitude';
import { useMount } from '../utils/hooks';
import { ESkjemanavn } from '../utils/skjemanavn';
import { FnrOgDnrTilAlder } from '../overgangsstønad/utils';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { Alert, Panel, Heading } from '@navikt/ds-react';
import { isIE } from 'react-device-detect';
import styled from 'styled-components';
import { erNåværendeMånedMellomMåneder, nåværendeÅr } from '../utils/dato';
import { AlertIE } from '../components/forside/AlertIE';
import { AlertUnderAtten } from '../components/forside/AlertUnderAtten';
import { VeilederBoks } from '../components/forside/VeilederBoks';
import SkolepengerInformasjon from './SkolepengerInformasjon';

const StyledAlert = styled(Alert)`
  margin-bottom: 2rem;
`;

const Forside: React.FC = () => {
  const { person } = usePersonContext();
  const intl = useLokalIntlContext();
  const {
    mellomlagretSkolepenger,
    brukMellomlagretSkolepenger,
    nullstillMellomlagretSkolepenger,
    søknad,
    settSøknad,
  } = useSkolepengerSøknad();
  const erDagensDatoMellomMaiOgAugust = erNåværendeMånedMellomMåneder(5, 8);

  useMount(() => {
    if (!(kanBrukeMellomlagretSøknad && mellomlagretSkolepenger))
      logSidevisningSkolepenger('Forside');
    else {
      logSidevisningSkolepenger('FortsettMedMellomlagret');
    }
  });

  const settBekreftelse = (bekreftelse: boolean) => {
    settSøknad({
      ...søknad,
      harBekreftet: bekreftelse,
    });
  };

  const alder = FnrOgDnrTilAlder(person.søker.fnr);

  const kanBrukeMellomlagretSøknad =
    mellomlagretSkolepenger !== undefined &&
    mellomlagretSkolepenger.søknad.person.hash === person.hash &&
    mellomlagretSkolepenger.modellVersjon ===
      Environment().modellVersjon.skolepenger;

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Panel className={'forside__panel'}>
          <VeilederBoks />

          {alder < 18 && <AlertUnderAtten />}

          {isIE && <AlertIE />}

          <Heading level="1" size="xlarge">
            <LocaleTekst tekst={'skolepenger.overskrift'} />
          </Heading>

          {erDagensDatoMellomMaiOgAugust && (
            <StyledAlert variant="info">
              <Heading spacing size="small" level="3">
                Søker du om stønad til skolepenger fra august {nåværendeÅr}?
              </Heading>
              For å få stønad for nytt skoleår må du kunne dokumentere utgiftene
              til skolepenger med faktura. Vi anbefaler derfor at du venter med
              å søke frem til du får fakturaen.
            </StyledAlert>
          )}

          {kanBrukeMellomlagretSøknad && mellomlagretSkolepenger ? (
            <FortsettSøknad
              intl={intl}
              gjeldendeSteg={mellomlagretSkolepenger.gjeldendeSteg}
              brukMellomlagretSøknad={brukMellomlagretSkolepenger}
              nullstillMellomlagretSøknad={nullstillMellomlagretSkolepenger}
              skjemanavn={ESkjemanavn.Skolepenger}
            />
          ) : (
            alder > 17 && (
              <SkolepengerInformasjon
                person={person}
                harBekreftet={søknad.harBekreftet}
                settBekreftelse={settBekreftelse}
              />
            )
          )}
        </Panel>
      </div>
    </div>
  );
};

export default Forside;
