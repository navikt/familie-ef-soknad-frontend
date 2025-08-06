/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC } from 'react';
import DatoForSamlivsbrudd from './DatoForSamlivsbrudd';
import EndringISamvær from './EndringISamvær';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../../../components/spørsmål/MultiSvarSpørsmål';
import { begrunnelseSpørsmål } from '../SivilstatusConfig';
import FeltGruppe from '../../../../../../components/gruppe/FeltGruppe';
import { hentSvarAlertFraSpørsmål } from '../../../../../../utils/søknad';
import { EBegrunnelse } from '../../../../../../models/steg/omDeg/sivilstatus';
import { ISpørsmål, ISvar } from '../../../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { Alert, Heading } from '@navikt/ds-react';
import { useOmDeg } from '../../OmDegContext';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';
import { hentHTMLTekst, hentTekst } from '../../../../../../utils/teksthåndtering';

const ÅrsakEnslig: FC = () => {
  const intl = useLokalIntlContext();
  const spørsmål: ISpørsmål = begrunnelseSpørsmål(intl);
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();

  const { årsakEnslig } = sivilstatus;

  const settÅrsakEnslig = (spørsmål: ISpørsmål, svar: ISvar) => {
    settSivilstatus({
      ...sivilstatus,
      årsakEnslig: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
    });

    settDokumentasjonsbehov(spørsmål, svar);
  };

  const alertTekstForDødsfall = hentSvarAlertFraSpørsmål(EBegrunnelse.dødsfall, spørsmål);

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

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre && <DatoForSamlivsbrudd />}

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddAndre && (
        <KomponentGruppe>
          <FeltGruppe>
            <Heading size="small" level="3">
              {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
            </Heading>
          </FeltGruppe>
          <FeltGruppe>
            <OmDenTidligereSamboerenDin />
          </FeltGruppe>
        </KomponentGruppe>
      )}

      {årsakEnslig?.svarid === EBegrunnelse.endringISamværsordning && <EndringISamvær />}

      {årsakEnslig?.svarid === EBegrunnelse.dødsfall && (
        <KomponentGruppe>
          <Alert size="small" variant="info" inline>
            {hentHTMLTekst(alertTekstForDødsfall, intl)}
          </Alert>
        </KomponentGruppe>
      )}
    </div>
  );
};

export default ÅrsakEnslig;
