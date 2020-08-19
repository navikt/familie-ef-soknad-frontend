import React, { FC } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { useLocation } from 'react-router-dom';
import {
  erStegFerdigUtfylt,
  erSøknadsBegrunnelseBesvart,
  harSøkerTlfnr,
} from '../../../helpers/steg/omdeg';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import Medlemskap from '../../../søknad/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../søknad/steg/1-omdeg/personopplysninger/Personopplysninger';
import { ISøker } from '../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';
import Sivilstatus from '../../../søknad/steg/1-omdeg/sivilstatus/Sivilstatus';
import { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { hentPathBarnetilsynOppsummering } from '../../utils';

const OmDeg: FC<{ intl: IntlShape }> = ({ intl }) => {
  const location = useLocation();
  const kommerFraOppsummering: string = location.state?.kommerFraOppsummering;
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreBarnetilsyn,
    settSøknad,
    settDokumentasjonsbehov,
  } = useBarnetilsynSøknad();

  const { harSøktSeparasjon } = søknad.sivilstatus;

  const settMedlemskap = (medlemskap: IMedlemskap) => {
    settSøknad((prevSoknad) => {
      return {
        ...prevSoknad,
        medlemskap: medlemskap,
      };
    });
  };

  const settSøker = (søker: ISøker) => {
    settSøknad((prevSoknad) => {
      return {
        ...prevSoknad,
        person: { ...søknad.person, søker: søker },
      };
    });
  };

  const settSøkerBorPåRegistrertAdresse = (
    søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSoknad) => {
      return {
        ...prevSoknad,
        søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
        sivilstatus: {},
        medlemskap: {},
        person: {
          ...prevSoknad.person,
          søker: { ...prevSoknad.person.søker, kontakttelefon: '' },
        },
      };
    });
  };

  const settSivilstatus = (sivilstatus: ISivilstatus) => {
    settSøknad((prevSoknad) => {
      return {
        ...prevSoknad,
        sivilstatus: sivilstatus,
      };
    });
  };

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    søknad.person,
    søknad.sivilstatus,
    søknad.medlemskap
  );

  return (
    <Side
      stønadTittelTekstid={'banner.tittel.barnetilsyn'}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={hentPathBarnetilsynOppsummering}
    >
      <Personopplysninger
        søker={søknad.person.søker}
        settSøker={settSøker}
        søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
        settSøkerBorPåRegistrertAdresse={settSøkerBorPåRegistrertAdresse}
      />

      {søknad.søkerBorPåRegistrertAdresse &&
        søknad.søkerBorPåRegistrertAdresse.verdi === true &&
        harSøkerTlfnr(søknad.person) && (
          <>
            <Sivilstatus
              sivilstatus={søknad.sivilstatus}
              settSivilstatus={settSivilstatus}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
            />

            {harSøktSeparasjon ||
            harSøktSeparasjon === false ||
            erSøknadsBegrunnelseBesvart(søknad.sivilstatus) ? (
              <Medlemskap
                medlemskap={søknad.medlemskap}
                settMedlemskap={settMedlemskap}
              />
            ) : null}
          </>
        )}
    </Side>
  );
};

export default injectIntl(OmDeg);
