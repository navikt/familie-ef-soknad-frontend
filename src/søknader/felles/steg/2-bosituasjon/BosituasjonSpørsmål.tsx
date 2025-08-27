import React, { FC } from 'react';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
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
  const visTidligereSamboerBorPåSammeAdresseAlert =
    delerBoligMedAndreVoksne.svarid ===
    ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse;
  const visEkteskapLignendeForhold =
    delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.harEkteskapsliknendeForhold;

  return (
    <VStack gap={'6'}>
      <MultiSvarSpørsmål
        key={hovedSpørsmål.søknadid}
        spørsmål={hovedSpørsmål}
        valgtSvar={delerBoligMedAndreVoksne.verdi}
        settSpørsmålOgSvar={oppdaterDelerBoligMedAndreVoksne}
      />

      {valgtSvar && valgtSvar.alert_tekstid && (
        <VStack>
          {visTidligereSamboerBorPåSammeAdresseAlert ? (
            <Alert variant={'info'} size={'small'} inline>
              {hentHTMLTekst(valgtSvar.alert_tekstid, intl)}
            </Alert>
          ) : (
            <Alert variant={'warning'} size={'small'} inline>
              {hentTekst(valgtSvar.alert_tekstid, intl)}
            </Alert>
          )}
        </VStack>
      )}

      {visOmTidligereSamboer && <OmTidligereSamboer />}

      {visPlanerOmÅFlytteSammenEllerFåSamboer && <SøkerSkalFlytteSammenEllerFåSamboer />}

      {visEkteskapLignendeForhold && <EkteskapsliknendeForhold />}
    </VStack>
  );
};
