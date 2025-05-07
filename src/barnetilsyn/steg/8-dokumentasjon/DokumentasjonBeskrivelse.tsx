import React from 'react';
import { ReadMore } from '@navikt/ds-react';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import styled from 'styled-components';
import { hentTekst } from '../../../utils/søknad';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import LocaleTekst from '../../../language/LocaleTekst';

const ReadMoreMedPadding = styled(ReadMore)`
  padding: 1rem 0;
`;

const SeksjonsGruppeMindrePadding = styled(SeksjonGruppe)`
  padding-bottom: 50px;
`;

interface Props {
  harDokumentasjonsbehov: boolean;
}

export const DokumentasjonBeskrivelse: React.FC<Props> = ({
  harDokumentasjonsbehov,
}) => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonsGruppeMindrePadding>
      {harDokumentasjonsbehov ? (
        <>
          <LocaleTekst tekst={'dokumentasjon.beskrivelse'} />
          <ReadMoreMedPadding
            header={hentTekst('dokumentasjon.beskrivelseBilderHeader', intl)}
          >
            <LocaleTekst tekst={'dokumentasjon.beskrivelseBilderInnhold'} />
          </ReadMoreMedPadding>
          <LocaleTekst tekst={'dokumentasjon.beskrivelseSlutt'} />
        </>
      ) : (
        <LocaleTekst
          tekst={'dokumentasjon.ingenDokumentasjonsbehov.beskrivelse'}
        />
      )}
    </SeksjonsGruppeMindrePadding>
  );
};
