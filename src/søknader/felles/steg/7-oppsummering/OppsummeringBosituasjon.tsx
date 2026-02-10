import React from 'react';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { ESøkerDelerBolig, IBosituasjon } from '../../../../models/steg/bosituasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { VisLabelOgSvar } from '../../../../utils/visning';
import { useNavigate } from 'react-router-dom';
import { Heading, VStack } from '@navikt/ds-react';

interface Props {
  bosituasjon: IBosituasjon;
  endreInformasjonPath?: string;
}

const OppsummeringBosituasionenDin: React.FC<Props> = ({ bosituasjon, endreInformasjonPath }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  const samboerDetaljer =
    bosituasjon.samboerDetaljer && VisLabelOgSvar(bosituasjon.samboerDetaljer);
  const vordendeSamboerEktefelle =
    bosituasjon.vordendeSamboerEktefelle && VisLabelOgSvar(bosituasjon.vordendeSamboerEktefelle);

  const lagSamboerOverskrift = () => {
    if (
      bosituasjon.delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
    ) {
      return hentTekst('bosituasjon.tittel.omTidligereSamboer', intl);
    } else if (
      bosituasjon.delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.harEkteskapsliknendeForhold
    ) {
      return hentTekst('bosituasjon.tittel.omSamboer', intl);
    }
  };

  return (
    <VStack gap={'space-32'}>
      {VisLabelOgSvar(bosituasjon)}
      {samboerDetaljer && (
        <VStack gap={'space-8'}>
          <Heading size={'small'} level={'4'}>
            {lagSamboerOverskrift()}
          </Heading>
          {samboerDetaljer}
        </VStack>
      )}

      {vordendeSamboerEktefelle && (
        <VStack>
          <Heading size={'small'} level={'4'}>
            {hentTekst('bosituasjon.tittel.hvemSkalSøkerGifteEllerBliSamboerMed', intl)}
          </Heading>
          {vordendeSamboerEktefelle}
        </VStack>
      )}

      <LenkeMedIkon
        onClick={() =>
          navigate({ pathname: endreInformasjonPath }, { state: { kommerFraOppsummering: true } })
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </VStack>
  );
};

export default OppsummeringBosituasionenDin;
