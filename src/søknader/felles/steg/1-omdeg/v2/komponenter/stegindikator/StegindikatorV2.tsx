import React from 'react';
import { FormProgress } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { SøknadSteg } from './GenerelleSøknadSteg';

interface Props {
  steg: SøknadSteg[];
  aktivtSteg: SøknadSteg;
}

export const StegindikatorV2: React.FC<Props> = ({ steg, aktivtSteg }) => {
  const intl = useLokalIntlContext();

  const antallSteg = steg.length;
  const aktivtStegIndex = steg.findIndex((steg) => steg.id === aktivtSteg.id) + 1;

  // TODO: Husk å sette oversettelser.

  return (
    <FormProgress
      totalSteps={antallSteg}
      activeStep={aktivtStegIndex}
      onStepChange={() => {}}
      interactiveSteps={false}
    >
      {steg.map((steg) => (
        <FormProgress.Step key={steg.id}>{hentTekst(steg.stegKey, intl)}</FormProgress.Step>
      ))}
    </FormProgress>
  );
};
