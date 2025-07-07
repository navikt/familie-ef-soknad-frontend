import React, { FC } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { ESøkerDelerBolig } from '../../../../models/steg/bosituasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import { SøkerSkalFlytteSammenEllerFåSamboer } from './SøkerSkalFlytteSammenEllerFåSamboer';
import { EkteskapsliknendeForhold } from './EkteskapsliknendeForhold';
import { OmTidligereSamboer } from './OmTidligereSamboer';
import { ISvar } from '../../../../models/felles/spørsmålogsvar';
import { erValgtSvarLiktSomSvar, harValgtSvar } from '../../../../utils/spørsmålogsvar';
import FormattedHtmlMessage from '../../../../language/FormattedHtmlMessage';
import { Alert } from '@navikt/ds-react';
import { useBosituasjon } from './BosituasjonContext';

export const BosituasjonSpørsmål: FC = () => {
  const { bosituasjon, oppdaterDelerBoligMedAndreVoksne, hovedSpørsmål } = useBosituasjon();

  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetFraHverandre } = bosituasjon;

  const valgtSvar: ISvar | undefined = hovedSpørsmål.svaralternativer.find((svar) =>
    erValgtSvarLiktSomSvar(delerBoligMedAndreVoksne.verdi, svar.svar_tekst)
  );

  const harEkteskapsliknendeForhold =
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.harEkteskapsliknendeForhold;

  const harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer =
    samboerDetaljer?.kjennerIkkeIdent || harValgtSvar(samboerDetaljer?.ident?.verdi);

  const ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse =
    delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse &&
    harValgtSvar(samboerDetaljer?.navn?.verdi) &&
    harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer &&
    harValgtSvar(datoFlyttetFraHverandre?.verdi);

  const visPlanerOmÅFlytteSammenEllerFåSamboer =
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.borAleneMedBarnEllerGravid ||
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.delerBoligMedAndreVoksne ||
    ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse;

  return (
    <>
      <SeksjonGruppe>
        <MultiSvarSpørsmål
          key={hovedSpørsmål.søknadid}
          spørsmål={hovedSpørsmål}
          valgtSvar={delerBoligMedAndreVoksne.verdi}
          settSpørsmålOgSvar={oppdaterDelerBoligMedAndreVoksne}
        />
        {valgtSvar && valgtSvar.alert_tekstid && (
          <FeltGruppe>
            {delerBoligMedAndreVoksne.svarid ===
            ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse ? (
              <AlertStripeDokumentasjon>
                <FormattedHtmlMessage id={valgtSvar.alert_tekstid} />
              </AlertStripeDokumentasjon>
            ) : (
              <Alert size="small" variant="warning" inline>
                <LocaleTekst tekst={valgtSvar.alert_tekstid} />
              </Alert>
            )}
          </FeltGruppe>
        )}
      </SeksjonGruppe>

      {delerBoligMedAndreVoksne.svarid ===
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse && (
        <SeksjonGruppe>
          <OmTidligereSamboer />
        </SeksjonGruppe>
      )}

      {visPlanerOmÅFlytteSammenEllerFåSamboer && (
        <SeksjonGruppe>
          <SøkerSkalFlytteSammenEllerFåSamboer />
        </SeksjonGruppe>
      )}

      {harEkteskapsliknendeForhold && <EkteskapsliknendeForhold />}
    </>
  );
};
