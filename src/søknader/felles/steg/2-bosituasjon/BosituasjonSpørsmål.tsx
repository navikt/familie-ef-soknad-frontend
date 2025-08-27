import React, { FC } from 'react';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { ESøkerDelerBolig } from '../../../../models/steg/bosituasjon';
import { SøkerSkalFlytteSammenEllerFåSamboer } from './SøkerSkalFlytteSammenEllerFåSamboer';
import { EkteskapsliknendeForhold } from './EkteskapsliknendeForhold';
import { OmTidligereSamboer } from './OmTidligereSamboer';
import { ISvar } from '../../../../models/felles/spørsmålogsvar';
import { erValgtSvarLiktSomSvar, harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { Alert, VStack } from '@navikt/ds-react';
import { useBosituasjon } from './BosituasjonContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const BosituasjonSpørsmål: FC = () => {
  const intl = useLokalIntlContext();

  const { bosituasjon, oppdaterDelerBoligMedAndreVoksne, hovedSpørsmål } = useBosituasjon();
  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetFraHverandre } = bosituasjon;

  const valgtSvar: ISvar | undefined = hovedSpørsmål.svaralternativer.find((svar) =>
    erValgtSvarLiktSomSvar(delerBoligMedAndreVoksne.verdi, svar.svar_tekst)
  );

  const harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer =
    samboerDetaljer?.kjennerIkkeIdent || harValgtSvar(samboerDetaljer?.ident?.verdi);

  const ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse =
    delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse &&
    harValgtSvar(samboerDetaljer?.navn?.verdi) &&
    harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer &&
    harValgtSvar(datoFlyttetFraHverandre?.verdi);

  const visOmTidligereSamboer =
    delerBoligMedAndreVoksne.svarid ===
    ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse;
  const visPlanerOmÅFlytteSammenEllerFåSamboer =
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.borAleneMedBarnEllerGravid ||
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.delerBoligMedAndreVoksne ||
    ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse;
  const visEkteskapLignendeForhold =
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.harEkteskapsliknendeForhold;

  return (
    <VStack>
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
              {hentHTMLTekst(valgtSvar.alert_tekstid, intl)}
            </AlertStripeDokumentasjon>
          ) : (
            <Alert size="small" variant="warning" inline>
              {hentTekst(valgtSvar.alert_tekstid, intl)}
            </Alert>
          )}
        </FeltGruppe>
      )}

      {visOmTidligereSamboer && <OmTidligereSamboer />}

      {visPlanerOmÅFlytteSammenEllerFåSamboer && <SøkerSkalFlytteSammenEllerFåSamboer />}

      {visEkteskapLignendeForhold && <EkteskapsliknendeForhold />}
    </VStack>
  );
};
