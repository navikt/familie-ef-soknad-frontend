import React from 'react';
import { ReadMore } from '@navikt/ds-react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import styled from 'styled-components';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
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
            {hentHTMLTekst('dokumentasjon.beskrivelseBilderInnhold', intl)}
          </ReadMoreMedPadding>
          {hentHTMLTekst('dokumentasjon.beskrivelseSlutt', intl)}
        </>
      ) : (
        hentTekst('dokumentasjon.ingenDokumentasjonsbehov.beskrivelse', intl)
      )}
    </SeksjonsGruppeMindrePadding>
  );
};
