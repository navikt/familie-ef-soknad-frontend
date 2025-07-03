import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
  erSivilstandSpørsmålBesvart,
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
} from '../../../../helpers/steg/omdeg';
import Medlemskap from '../../../felles/steg/1-omdeg/medlemskap/Medlemskap';
import Sivilstatus from '../../../felles/steg/1-omdeg/sivilstatus/Sivilstatus';
import Side, { ESide } from '../../../../components/side/Side';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOmDeg } from './OmDegContext';
import { Personopplysninger } from './personopplysninger/Personopplysninger';
import { VStack } from '@navikt/ds-react';

const OmDeg: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

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

  const SkalViseSivilstatusdialog =
    søkerBorPåRegistrertAdresse?.verdi === true ||
    adresseopplysninger?.harMeldtAdresseendring?.verdi === true ||
    søker?.erStrengtFortrolig;

  const skalViseMedlemskapsdialog =
    erSivilstandSpørsmålBesvart(søker.sivilstand, sivilstatus) && erÅrsakEnsligBesvart(sivilstatus);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    sivilstatus,
    søker.sivilstand,
    medlemskap,
    SkalViseSivilstatusdialog
  );

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={routes}
      tilbakeTilOppsummeringPath={pathOppsummering}
      mellomlagreSteg={mellomlagreSteg}
    >
      <VStack gap={'6'}>
        <Personopplysninger />
        {SkalViseSivilstatusdialog && <Sivilstatus />}
        {skalViseMedlemskapsdialog && <Medlemskap />}
      </VStack>
    </Side>
  );
};

export default OmDeg;
