/* eslint-disable react-hooks/rules-of-hooks */
import React, { FC } from 'react';
import DatoForSamlivsbrudd from './DatoForSamlivsbrudd';
import EndringISamvær from './EndringISamvær';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../../../components/spørsmål/MultiSvarSpørsmål';
import NårFlyttetDereFraHverandre from './NårFlyttetDereFraHverandre';
import { begrunnelseSpørsmål } from '../SivilstatusConfig';
import FeltGruppe from '../../../../../../components/gruppe/FeltGruppe';
import { hentSvarAlertFraSpørsmål, hentTekst } from '../../../../../../utils/søknad';
import { EBegrunnelse } from '../../../../../../models/steg/omDeg/sivilstatus';
import { ISpørsmål, ISvar } from '../../../../../../models/felles/spørsmålogsvar';
import { harFyltUtSamboerDetaljer } from '../../../../../../utils/person';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { Alert, Heading } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../../../components/TextFieldMedBredde';
import { useOmDeg } from '../../OmDegContext';
import OmDenTidligereSamboerenDin from './OmDenTidligereSamboerenDin';
import { hentHTMLTekst } from '../../../../../../utils/teksthåndtering';

const ÅrsakEnslig: FC = () => {
  const intl = useLokalIntlContext();
  const spørsmål: ISpørsmål = begrunnelseSpørsmål(intl);
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();

  const { årsakEnslig, tidligereSamboerDetaljer } = sivilstatus;

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

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre && <DatoForSamlivsbrudd />}

      {årsakEnslig?.svarid === EBegrunnelse.samlivsbruddAndre && (
        <KomponentGruppe>
          <FeltGruppe>
            <Heading size="small" level="3">
              {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
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
