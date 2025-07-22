import React from 'react';
import { usePersonContext } from '../../context/PersonContext';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import FortsettSøknad from '../../components/forside/FortsettSøknad';
import Environment from '../../Environment';
import { logSidevisningOvergangsstonad } from '../../utils/amplitude';
import { useMount, useSpråkValg } from '../../utils/hooks';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Box, Heading } from '@navikt/ds-react';
import { OvergangsstønadInformasjon } from './OvergangsstønadInformasjon';
import { AlertUnderAtten } from '../../components/forside/AlertUnderAtten';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import { hentTekst } from '../../utils/søknad';

const Forside: React.FC = () => {
  useMount(() => {
    if (!(kanBrukeMellomlagretSøknad && mellomlagretOvergangsstønad))
      logSidevisningOvergangsstonad('Forside');
    else {
      logSidevisningOvergangsstonad('FortsettMedMellomlagret');
    }
  });

  const intl = useLokalIntlContext();
  const { person } = usePersonContext();
  const {
    mellomlagretOvergangsstønad,
    brukMellomlagretOvergangsstønad,
    nullstillMellomlagretOvergangsstønad,
    søknad,
    settSøknad,
  } = useOvergangsstønadSøknad();

  const settBekreftelse = (bekreftelse: boolean) => {
    settSøknad({
      ...søknad,
      harBekreftet: bekreftelse,
    });
  };

  const kanBrukeMellomlagretSøknad =
    mellomlagretOvergangsstønad !== undefined &&
    mellomlagretOvergangsstønad.søknad.person.hash === person.hash &&
    mellomlagretOvergangsstønad.modellVersjon === Environment().modellVersjon.overgangsstønad;

  const alder = person.søker.alder;

  const skalViseSpråkValg = !(kanBrukeMellomlagretSøknad && mellomlagretOvergangsstønad);

  useSpråkValg(skalViseSpråkValg);

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="4" className={'forside__panel'}>
          <VeilederBoks />

          {alder < 18 && <AlertUnderAtten />}

          <Heading level="1" size="xlarge">
            {hentTekst('banner.tittel.overgangsstønad', intl)}
          </Heading>
          {kanBrukeMellomlagretSøknad && mellomlagretOvergangsstønad ? (
            <FortsettSøknad
              intl={intl}
              gjeldendeSteg={mellomlagretOvergangsstønad.gjeldendeSteg}
              brukMellomlagretSøknad={brukMellomlagretOvergangsstønad}
              nullstillMellomlagretSøknad={nullstillMellomlagretOvergangsstønad}
              skjemanavn={ESkjemanavn.Overgangsstønad}
            />
          ) : (
            alder > 17 && (
              <OvergangsstønadInformasjon
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
