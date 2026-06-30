import React from 'react';
import { usePersonContext } from '../../context/PersonContext';
import { useSkolepengerSøknad } from './SkolepengerContext';
import Environment from '../../Environment';
import FortsettSøknad from '../../components/forside/FortsettSøknad';
import { useSpråkValg } from '../../utils/hooks';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, BodyShort, Box, Heading } from '@navikt/ds-react';
import { erNåværendeMånedMellomMåneder, nåværendeÅr } from '../../utils/dato';
import { AlertUnderAtten } from '../../components/forside/AlertUnderAtten';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import SkolepengerInformasjon from './SkolepengerInformasjon';
import { hentHTMLTekst, hentTekst, hentTekstMedEnVariabel } from '../../utils/teksthåndtering';
import { ToggleName } from '../../models/søknad/toggles';
import { useToggles } from '../../context/TogglesContext';

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
  const { toggles } = useToggles();
  const visRegelendring2026Varsel = toggles[ToggleName.overgangsstønadRegelendringer2026];

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
        <Box padding="space-16" className={'forside__panel'}>
          <VeilederBoks />

          {alder < 18 && <AlertUnderAtten />}

          <Heading level="1" size="xlarge">
            {hentTekst('skolepenger.overskrift', intl)}
          </Heading>

          {erDagensDatoMellomMaiOgAugust && !visRegelendring2026Varsel && (
            <Alert variant="info" style={{ marginBottom: '2rem' }}>
              <Heading spacing size="small" level="3">
                {hentTekstMedEnVariabel('skolepenger.søkerFraAugustTittel', intl, `${nåværendeÅr}`)}
              </Heading>
              {hentTekst('skolepenger.søkerFraAugustInnhold', intl)}
            </Alert>
          )}

          {visRegelendring2026Varsel && (
            <Alert variant="info" style={{ marginBottom: '2rem' }}>
              <Heading spacing size="small" level="3">
                {hentTekst('skolepenger.skolepengerRegelendringInfoTittel', intl)}
              </Heading>
              <BodyShort>
                {hentHTMLTekst('skolepenger.skolepengerRegelendringInfoInnhold', intl)}
              </BodyShort>
            </Alert>
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
