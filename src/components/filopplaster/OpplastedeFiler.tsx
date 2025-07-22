import React from 'react';
import vedlegg from '../../assets/vedlegg.svg';
import { formaterFilstørrelse } from './utils';
import { IVedlegg } from '../../models/steg/vedlegg';
import { BodyShort, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import { TrashFillIcon } from '@navikt/aksel-icons';
import { hentTekst } from '../../utils/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

interface Props {
  filliste: IVedlegg[];
  slettVedlegg: (vedlegg: IVedlegg) => void;
}

const Filrad = styled.div`
  display: grid;
  grid-template-columns: 1.5rem 1fr auto;
  gap: 1rem;
  align-items: center;
  word-break: break-all;
`;

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
  const intl = useLokalIntlContext();
  return (
    <>
      {filliste.map((fil: IVedlegg, index: number) => (
        <div key={fil.dokumentId}>
          <Filrad>
            <img src={vedlegg} alt="Vedleggsikon" />
            <BodyShort size="small">
              {fil.navn} ({formaterFilstørrelse(fil.størrelse)})
            </BodyShort>
            <Button
              size="small"
              variant="tertiary"
              icon={<TrashFillIcon />}
              iconPosition="right"
              onClick={() => {
                slettVedlegg(fil);
              }}
            >
              {hentTekst('dokumentasjon.knapp.slett', intl)}
            </Button>
          </Filrad>
          {index === filliste.length - 1 ? <br /> : <hr />}
        </div>
      ))}
    </>
  );
};

export default OpplastedeFiler;
