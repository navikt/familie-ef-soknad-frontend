import React from 'react';
import InputLabelGruppe from '../../../../../components/gruppe/InputLabelGruppe';
import { EUtdanning, UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, VStack } from '@navikt/ds-react';
import styled from 'styled-components';

const StudereProsentVarsel = styled(Alert)`
  margin-top: 0.5rem;
`;

interface Props {
  utdanning: UnderUtdanning;
  oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
}

export const StudieArbeidsmengde: React.FC<Props> = ({ utdanning, oppdaterUtdanning }) => {
  const intl = useLokalIntlContext();

  const settInputFelt = (
    nøkkel: EUtdanning,
    label: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    oppdaterUtdanning(nøkkel, label, e.currentTarget.value);
  };

  const arbeidsmengdeLabel = hentTekst('utdanning.label.arbeidsmengde', intl);

  const erIkkeUndefinedOgMerEnnNittiNiProsent =
    utdanning?.arbeidsmengde?.verdi !== undefined && Number(utdanning?.arbeidsmengde?.verdi) > 99;

  return (
    <VStack gap={'1'}>
      <InputLabelGruppe
        label={arbeidsmengdeLabel}
        nøkkel={EUtdanning.arbeidsmengde}
        type={'number'}
        bredde={'XXS'}
        settInputFelt={(e) => settInputFelt(EUtdanning.arbeidsmengde, arbeidsmengdeLabel, e)}
        beskrivendeTekst={'%'}
        value={utdanning?.arbeidsmengde?.verdi ? utdanning?.arbeidsmengde?.verdi : ''}
      />
      {erIkkeUndefinedOgMerEnnNittiNiProsent && (
        <StudereProsentVarsel size="small" variant="error">
          {hentTekst('utdanning.alert.arbeidsmengde', intl)}
        </StudereProsentVarsel>
      )}
    </VStack>
  );
};
