import React, { useState } from 'react';
import { FormProgress } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';
import { useSpråkContext } from '../../context/SpråkContext';
import { LocaleType } from '../../language/typer';

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
  const [activeStep, setActiveStep] = useState(aktivtSteg + 1);
  const [locale] = useSpråkContext();
  const erEngelskSpråk = locale === LocaleType.en;

  const translations = erEngelskSpråk
    ? {
        step: `Step ${activeStep} of ${steg.length}`,
        showAllSteps: 'Show all steps',
        hideAllSteps: 'Hide all steps',
      }
    : {
        step: `Steg ${activeStep} av ${steg.length}`,
        showAllSteps: 'Vis alle steg',
        hideAllSteps: 'Skjul alle steg',
      };

  return (
    <FormProgress
      className="stegindikator"
      totalSteps={steg.length}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      interactiveSteps={false}
      translations={translations}
    >
      {steg.map((steg) => (
        <FormProgress.Step key={steg.label}>
          {steg?.localeTeskt ? hentTekst(steg?.localeTeskt, intl) : steg.label}
        </FormProgress.Step>
      ))}
    </FormProgress>
  );
};
