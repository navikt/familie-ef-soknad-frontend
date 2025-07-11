import React from 'react';
import { usePersonContext } from '../../context/PersonContext';
import { useSkolepengerSøknad } from './SkolepengerContext';
import Environment from '../../Environment';
import FortsettSøknad from '../../components/forside/FortsettSøknad';
import LocaleTekst from '../../language/LocaleTekst';
import { logSidevisningSkolepenger } from '../../utils/amplitude';
import { useMount, useSpråkValg } from '../../utils/hooks';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, Box, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { erNåværendeMånedMellomMåneder, nåværendeÅr } from '../../utils/dato';
import { AlertUnderAtten } from '../../components/forside/AlertUnderAtten';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
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

  const alder = person.søker.alder;

  const kanBrukeMellomlagretSøknad =
    mellomlagretSkolepenger !== undefined &&
    mellomlagretSkolepenger.søknad.person.hash === person.hash &&
    mellomlagretSkolepenger.modellVersjon === Environment().modellVersjon.skolepenger;

  const skalViseSpråkValg = !(kanBrukeMellomlagretSøknad && mellomlagretSkolepenger);

  useSpråkValg(skalViseSpråkValg);

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="4" className={'forside__panel'}>
          <VeilederBoks />

          {alder < 18 && <AlertUnderAtten />}

          <Heading level="1" size="xlarge">
            <LocaleTekst tekst={'skolepenger.overskrift'} />
          </Heading>

          {erDagensDatoMellomMaiOgAugust && (
            <StyledAlert variant="info">
              <Heading spacing size="small" level="3">
                <LocaleTekst
                  tekst={'skolepenger.søkerFraAugustTittel'}
                  replaceArgument0={`${nåværendeÅr}`}
                />
              </Heading>
              <LocaleTekst tekst={'skolepenger.søkerFraAugustInnhold'} />
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
        </Box>
      </div>
    </div>
  );
};

export default Forside;
