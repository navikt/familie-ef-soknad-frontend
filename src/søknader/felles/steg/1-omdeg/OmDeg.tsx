import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  erSivilstandSpørsmålBesvart,
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
} from '../../../../helpers/steg/omdeg';
import { Medlemskap } from './medlemskap/Medlemskap';
import { Personopplysninger } from './personopplysninger/Personopplysninger';
import { Sivilstatus } from './sivilstatus/Sivilstatus';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOmDeg } from './OmDegContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { Button, Heading, VStack } from '@navikt/ds-react';

// TODO: Fjern SentryTestPanel når preprod-verifisering av Sentry-oppsettet er ferdig.
const SentryTestPanel: FC = () => {
  const [krasjRender, settKrasjRender] = useState(false);
  if (krasjRender) {
    throw new Error('Sentry ErrorBoundary-test ' + Date.now());
  }

  return (
    <VStack gap="space-8">
      <Heading size="xsmall" level="3">
        Sentry-testknapper (midlertidig — slett etter test)
      </Heading>
      <Button
        variant="secondary"
        size="small"
        onClick={() => {
          throw new Error('Sentry kildekart-test ' + Date.now());
        }}
      >
        Trigg event handler-feil
      </Button>
      <Button variant="secondary" size="small" onClick={() => settKrasjRender(true)}>
        Trigg render-feil (ErrorBoundary)
      </Button>
    </VStack>
  );
};

const OmDeg: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const {
    sivilstatus,
    medlemskap,
    mellomlagreSteg,
    stønadstype,
    routes,
    pathOppsummering,
    søknad,
    søkerBorPåRegistrertAdresse,
    adresseopplysninger,
  } = useOmDeg();

  const { søker } = søknad.person;

  const skalViseSivilstatusdialog =
    søkerBorPåRegistrertAdresse?.verdi === true ||
    adresseopplysninger?.harMeldtAdresseendring?.verdi === true ||
    søker?.erStrengtFortrolig;

  const skalViseMedlemskapsdialog =
    skalViseSivilstatusdialog &&
    erSivilstandSpørsmålBesvart(søker.sivilstand, sivilstatus) &&
    erÅrsakEnsligBesvart(sivilstatus);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    sivilstatus,
    søker.sivilstand,
    medlemskap,
    skalViseSivilstatusdialog
  );

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('stegtittel.omDeg', intl)}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      navigasjonState={navigasjonState}
      routesStønad={routes}
      tilbakeTilOppsummeringPath={pathOppsummering}
      mellomlagreSteg={mellomlagreSteg}
    >
      <SentryTestPanel />
      <Personopplysninger />
      {skalViseSivilstatusdialog && <Sivilstatus />}
      {skalViseMedlemskapsdialog && <Medlemskap />}
    </Side>
  );
};

export default OmDeg;
