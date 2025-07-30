import React from 'react';
import { FormProgress } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { SøknadSteg } from './GenerelleSøknadSteg';
import { hentTekst, hentTekstMedFlereVariabler } from '../../../../../../../utils/teksthåndtering';

interface Props {
  steg: SøknadSteg[];
  aktivtSteg: SøknadSteg;
}

export const StegindikatorV2: React.FC<Props> = ({ steg, aktivtSteg }) => {
  const intl = useLokalIntlContext();

  const antallSteg = steg.length;
  const aktivtStegIndex = steg.findIndex((steg) => steg.id === aktivtSteg.id) + 1;

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
      onStepChange={() => {}}
      interactiveSteps={false}
      translations={oversettelse}
    >
      {steg.map((steg) => (
        <FormProgress.Step key={steg.id}>{hentTekst(steg.stegKey, intl)}</FormProgress.Step>
      ))}
    </FormProgress>
  );
};
