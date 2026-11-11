import React, { type FC } from 'react';
import { useLocation } from 'react-router';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { erSivilstandSpørsmålBesvart, erStegFerdigUtfylt, erÅrsakEnsligBesvart } from '../../../../helpers/steg/omdeg';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { Medlemskap } from './medlemskap/Medlemskap';
import { useOmDeg } from './OmDegContext';
import { Personopplysninger } from './personopplysninger/Personopplysninger';
import { Sivilstatus } from './sivilstatus/Sivilstatus';

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
            <Personopplysninger />
            {skalViseSivilstatusdialog && <Sivilstatus />}
            {skalViseMedlemskapsdialog && <Medlemskap />}
        </Side>
    );
};

export default OmDeg;
