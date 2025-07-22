import React from 'react';
import { ReadMore } from '@navikt/ds-react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import styled from 'styled-components';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const ReadMoreMedPadding = styled(ReadMore)`
  padding: 1rem 0;
`;

const SeksjonsGruppeMindrePadding = styled(SeksjonGruppe)`
  padding-bottom: 50px;
`;

interface Props {
  harDokumentasjonsbehov: boolean;
}

export const DokumentasjonBeskrivelse: React.FC<Props> = ({ harDokumentasjonsbehov }) => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonsGruppeMindrePadding>
      {harDokumentasjonsbehov ? (
        <>
          {hentTekst('dokumentasjon.beskrivelse', intl)}
          <ReadMoreMedPadding header={hentTekst('dokumentasjon.beskrivelseBilderHeader', intl)}>
            {hentTekst('dokumentasjon.beskrivelseBilderInnhold', intl)}
          </ReadMoreMedPadding>
          {hentTekst('dokumentasjon.beskrivelseSlutt', intl)}
        </>
      ) : (
        hentTekst('dokumentasjon.ingenDokumentasjonsbehov.beskrivelse', intl)
      )}
    </SeksjonsGruppeMindrePadding>
  );
};
