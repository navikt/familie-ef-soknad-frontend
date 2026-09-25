import React from 'react';
import { formaterFilstørrelse } from './utils';
import { IVedlegg } from '../../models/steg/vedlegg';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { PaperclipIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

interface Props {
  filliste: IVedlegg[];
  slettVedlegg: (vedlegg: IVedlegg) => void;
}

const OpplastedeFiler: React.FC<Props> = ({ filliste, slettVedlegg }) => {
  const intl = useLokalIntlContext();
  return (
    <>
      {filliste.map((fil: IVedlegg, index: number) => (
        <VStack key={fil.dokumentId}>
          <HStack key={fil.dokumentId} align={'center'} justify={'space-between'}>
            <HStack gap={'space-8'}>
              <PaperclipIcon aria-hidden={'true'} fontSize="1.5rem" />
              <BodyShort size="small" style={{ wordBreak: 'break-all' }}>
                {fil.navn} ({formaterFilstørrelse(fil.størrelse)})
              </BodyShort>
            </HStack>
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
          </HStack>
          {index === filliste.length - 1 ? (
            <br />
          ) : (
            <hr style={{ width: '100%', marginLeft: 0, marginRight: 0 }} />
          )}
        </VStack>
      ))}
    </>
  );
};

export default OpplastedeFiler;
