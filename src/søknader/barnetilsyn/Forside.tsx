import { Alert, Box, Heading } from '@navikt/ds-react';
import React from 'react';
import Environment from '../../Environment';
import { AlertUnderAtten } from '../../components/forside/AlertUnderAtten';
import FortsettSøknad from '../../components/forside/FortsettSøknad';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { erNåværendeMånedMellomMåneder, nåværendeÅr } from '../../utils/dato';
import { useSpråkValg } from '../../utils/hooks';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import { BarnetilsynInformasjon } from './BarnetilsynInformasjon';
import { hentTekst, hentTekstMedEnVariabel } from '../../utils/teksthåndtering';

const Forside: React.FC = () => {
  const intl = useLokalIntlContext();
  const erDagensDatoMellomMaiOgAugust = erNåværendeMånedMellomMåneder(5, 8);

  const { person } = usePersonContext();
  const {
    mellomlagretBarnetilsyn,
    brukMellomlagretBarnetilsyn,
    nullstillMellomlagretBarnetilsyn,
    søknad,
    settSøknad,
  } = useBarnetilsynSøknad();

  const settBekreftelse = (bekreftelse: boolean) => {
    settSøknad((prevSøknad) => ({
      ...prevSøknad,
      harBekreftet: bekreftelse,
    }));
  };

  const alder = person.søker.alder;

  const kanBrukeMellomlagretSøknad =
    mellomlagretBarnetilsyn !== undefined &&
    mellomlagretBarnetilsyn.søknad.person.hash === person.hash &&
    mellomlagretBarnetilsyn.modellVersjon === Environment().modellVersjon.barnetilsyn;

  const skalViseSpråkValg = !(kanBrukeMellomlagretSøknad && mellomlagretBarnetilsyn);

  useSpråkValg(skalViseSpråkValg);

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="space-16" className={'forside__panel'}>
          <VeilederBoks />

          {alder < 18 && <AlertUnderAtten />}

          <Heading level="1" size="xlarge">
            {hentTekst('barnetilsyn.sidetittel', intl)}
          </Heading>

          {erDagensDatoMellomMaiOgAugust && (
            <Alert variant="info" style={{ marginBottom: '2rem' }}>
              <Heading spacing size="small" level="3">
                {hentTekstMedEnVariabel('barnetilsyn.søkerFraAugustTittel', intl, `${nåværendeÅr}`)}
              </Heading>
              {hentTekst('barnetilsyn.søkerFraAugustInnhold', intl)}
            </Alert>
          )}

          {kanBrukeMellomlagretSøknad && mellomlagretBarnetilsyn ? (
            <FortsettSøknad
              intl={intl}
              gjeldendeSteg={mellomlagretBarnetilsyn.gjeldendeSteg}
              brukMellomlagretSøknad={brukMellomlagretBarnetilsyn}
              nullstillMellomlagretSøknad={nullstillMellomlagretBarnetilsyn}
              skjemanavn={ESkjemanavn.Barnetilsyn}
            />
          ) : (
            alder > 17 && (
              <BarnetilsynInformasjon
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
