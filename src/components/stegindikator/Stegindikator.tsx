import React from 'react';
import { FormProgress } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst, hentTekstMedFlereVariabler } from '../../utils/teksthåndtering';

export interface SøknadSteg {
  label: string;
  index: number;
  localeTeskt?: string;
}

interface Props {
  steg: SøknadSteg[];
  aktivtSteg: number;
}

export const Stegindikator: React.FC<Props> = ({ steg, aktivtSteg }) => {
  const intl = useLokalIntlContext();

  const antallSteg = steg.length;
  const aktivtStegIndex = steg.findIndex((steg) => steg.index === aktivtSteg) + 1;

  const stepTekst = hentTekstMedFlereVariabler('stegindikator.nåværendeSteg', intl, {
    0: aktivtStegIndex.toString(),
    1: antallSteg.toString(),
  });
  const showAllStepsTekst = hentTekst('stegindikator.visAlleSteg', intl);
  const hideAllStepsTekst = hentTekst('stegindikator.skjulAlleSteg', intl);

  const oversettelse = {
    step: stepTekst,
    showAllSteps: showAllStepsTekst,
    hideAllSteps: hideAllStepsTekst,
  };

  return (
    <FormProgress
      totalSteps={antallSteg}
      activeStep={aktivtStegIndex}
      interactiveSteps={false}
      translations={oversettelse}
    >
      {steg.map((steg) => (
        <FormProgress.Step key={steg.label}>
          {steg?.localeTeskt ? hentTekst(steg?.localeTeskt, intl) : steg.label}
        </FormProgress.Step>
      ))}
    </FormProgress>
  );
};
