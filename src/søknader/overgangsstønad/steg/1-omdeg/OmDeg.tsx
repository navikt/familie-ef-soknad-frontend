import React, { FC } from 'react';
import Medlemskap from '../../../felles/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../felles/steg/1-omdeg/personopplysninger/Personopplysninger';
import Sivilstatus from '../../../felles/steg/1-omdeg/sivilstatus/Sivilstatus';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { useLocation } from 'react-router-dom';
import { logSidevisningOvergangsstonad } from '../../../../utils/amplitude';
import {
  erSivilstandSpørsmålBesvart,
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
  søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring,
} from '../../../../helpers/steg/omdeg';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { hentPathOvergangsstønadOppsummering } from '../../utils';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { SøknadOvergangsstønad } from '../../../../models/søknad/søknad';
import Show from '../../../../utils/showIf';
import { useMount } from '../../../../utils/hooks';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useOmDeg } from '../../../felles/steg/1-omdeg/OmDegContext';

const OmDeg: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreOvergangsstønad,
    settSøknad,
    settDokumentasjonsbehov,
  } = useOvergangsstønadSøknad();
  const { sivilstatus } = søknad;
  const { medlemskap, mellomlagreOmDeg } = useOmDeg();

  const { søker } = søknad.person;

  useMount(() => logSidevisningOvergangsstonad('OmDeg'));

  const settSøkerBorPåRegistrertAdresse = (
    søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSoknad: SøknadOvergangsstønad) => {
      return {
        ...prevSoknad,
        adresseopplysninger: undefined,
        søkerBorPåRegistrertAdresse,
        sivilstatus: {},
        medlemskap: {},
      };
    });
  };

  const settHarMeldtAdresseendring = (
    harMeldtAdresseendring: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSøknad: SøknadOvergangsstønad) => ({
      ...prevSøknad,
      adresseopplysninger: {
        ...prevSøknad.adresseopplysninger,
        harMeldtAdresseendring,
      },
    }));
  };

  const settSivilstatus = (sivilstatus: ISivilstatus) => {
    settSøknad((prevSoknad: SøknadOvergangsstønad) => {
      return {
        ...prevSoknad,
        sivilstatus,
      };
    });
  };

  const erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring =
    søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    søknad.sivilstatus,
    søker.sivilstand,
    medlemskap,
    erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring
  );

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={RoutesOvergangsstonad}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      tilbakeTilOppsummeringPath={hentPathOvergangsstønadOppsummering}
      mellomlagreSøknad={mellomlagreOmDeg}
    >
      <Personopplysninger
        søker={søknad.person.søker}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
        søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
        settSøkerBorPåRegistrertAdresse={settSøkerBorPåRegistrertAdresse}
        harMeldtAdresseendring={
          søknad.adresseopplysninger?.harMeldtAdresseendring
        }
        settHarMeldtAdresseendring={settHarMeldtAdresseendring}
        stønadstype={Stønadstype.overgangsstønad}
      />
      <Show if={erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring}>
        <Sivilstatus
          sivilstatus={søknad.sivilstatus}
          settSivilstatus={settSivilstatus}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
        <Show
          if={
            erSivilstandSpørsmålBesvart(søker.sivilstand, sivilstatus) &&
            erÅrsakEnsligBesvart(sivilstatus)
          }
        >
          <Medlemskap />
        </Show>
      </Show>
    </Side>
  );
};

export default OmDeg;
