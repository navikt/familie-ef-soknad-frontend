/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC } from 'react';
import DatoForSamlivsbrudd from './DatoForSamlivsbrudd';
import EndringISamvær from './EndringISamvær';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../../../components/spørsmål/MultiSvarSpørsmål';
import NårFlyttetDereFraHverandre from './NårFlyttetDereFraHverandre';
import { begrunnelseSpørsmål } from '../SivilstatusConfig';
import FeltGruppe from '../../../../../../components/gruppe/FeltGruppe';
import {
  hentSvarAlertFraSpørsmål,
  hentTekst,
} from '../../../../../../utils/søknad';
import {
  EBegrunnelse,
  ISivilstatus,
} from '../../../../../../models/steg/omDeg/sivilstatus';
import {
  ISpørsmål,
  ISvar,
} from '../../../../../../models/felles/spørsmålogsvar';
import LocaleTekst from '../../../../../../language/LocaleTekst';
import { harFyltUtSamboerDetaljer } from '../../../../../../utils/person';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import FormattedHtmlMessage from '../../../../../../language/FormattedHtmlMessage';
import { Alert, Heading } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../../../components/TextFieldMedBredde';
import { useOmDeg } from '../../OmDegContext';
import OmDenTidligereSamboerenDin from './OmDenTidligereSamboerenDin';

const ÅrsakEnslig: FC = () => {
  const intl = useLokalIntlContext();
  const spørsmål: ISpørsmål = begrunnelseSpørsmål(intl);
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();

  const {
    årsakEnslig,
    datoForSamlivsbrudd,
    datoFlyttetFraHverandre,
    datoEndretSamvær,
    tidligereSamboerDetaljer,
  } = sivilstatus;

  const settNavn = (e: React.FormEvent<HTMLInputElement>) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        navn: {
          label: hentTekst('person.navn', intl),
          verdi: e.currentTarget.value,
        },
      },
    });
  };

  const erBegrunnelse = (svaralternativ: EBegrunnelse): boolean => {
    return årsakEnslig?.svarid === svaralternativ;
  };
  const samlivsbruddAndre: boolean = erBegrunnelse(
    EBegrunnelse.samlivsbruddAndre
  );

  const settÅrsakEnslig = (spørsmål: ISpørsmål, svar: ISvar) => {
    const spørsmålTekst: string = hentTekst(spørsmål.tekstid, intl);

    const nyttSivilstatusObjekt = fjernIrrelevanteSøknadsfelter(svar);

    settSivilstatus({
      ...nyttSivilstatusObjekt,
      årsakEnslig: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: spørsmålTekst,
        verdi: svar.svar_tekst,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar);
  };

  if (!samlivsbruddAndre) {
    delete sivilstatus.tidligereSamboerDetaljer;
  }

  const fjernIrrelevanteSøknadsfelter = (svar: ISvar): ISivilstatus => {
    const nySivilStatusObjekt = sivilstatus;
    if (svar.id !== EBegrunnelse.samlivsbruddForeldre && datoForSamlivsbrudd) {
      delete nySivilStatusObjekt.datoForSamlivsbrudd;
    }
    if (svar.id !== EBegrunnelse.samlivsbruddAndre && datoFlyttetFraHverandre) {
      delete nySivilStatusObjekt.datoFlyttetFraHverandre;
    }

    if (svar.id !== EBegrunnelse.endringISamværsordning && datoEndretSamvær) {
      delete nySivilStatusObjekt.datoEndretSamvær;
    }
    return nySivilStatusObjekt;
  };

  const alertTekstForDødsfall = hentSvarAlertFraSpørsmål(
    EBegrunnelse.dødsfall,
    spørsmål
  );

  const harBrukerFyltUtSamboerDetaljer = harFyltUtSamboerDetaljer(
    tidligereSamboerDetaljer ?? { kjennerIkkeIdent: false },
    false
  );

  return (
    <div aria-live="polite">
      <KomponentGruppe>
        <MultiSvarSpørsmål
          key={spørsmål.tekstid}
          spørsmål={spørsmål}
          valgtSvar={sivilstatus.årsakEnslig?.verdi}
          settSpørsmålOgSvar={settÅrsakEnslig}
        />
      </KomponentGruppe>

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre && (
        <DatoForSamlivsbrudd />
      )}

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddAndre && (
        <KomponentGruppe>
          <FeltGruppe>
            <Heading size="small" level="3">
              <LocaleTekst tekst={'sivilstatus.tittel.samlivsbruddAndre'} />
            </Heading>
          </FeltGruppe>
          <FeltGruppe>
            <TextFieldMedBredde
              key={'navn'}
              label={hentTekst('person.navn', intl)}
              type="text"
              bredde={'L'}
              onChange={(e) => settNavn(e)}
              value={tidligereSamboerDetaljer?.navn?.verdi}
            />
          </FeltGruppe>
          <FeltGruppe>
            <OmDenTidligereSamboerenDin />
          </FeltGruppe>
          {harBrukerFyltUtSamboerDetaljer && <NårFlyttetDereFraHverandre />}
        </KomponentGruppe>
      )}

      {årsakEnslig?.svarid === EBegrunnelse.endringISamværsordning && (
        <EndringISamvær />
      )}

      {årsakEnslig?.svarid === EBegrunnelse.dødsfall && (
        <KomponentGruppe>
          <Alert size="small" variant="info" inline>
            <FormattedHtmlMessage id={alertTekstForDødsfall} />
          </Alert>
        </KomponentGruppe>
      )}
    </div>
  );
};

export default ÅrsakEnslig;
