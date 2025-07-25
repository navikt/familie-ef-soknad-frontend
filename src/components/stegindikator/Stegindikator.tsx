import React, { useState } from 'react';
import { FormProgress } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';
import { useSpråkContext } from '../../context/SpråkContext';
import { LocaleType } from '../../language/typer';

export interface ISteg {
  label: string;
  index: number;
  localeTeskt?: string;
}

interface IStegIndikatorProps {
  stegListe: ISteg[];
  aktivtSteg: number;
}

const Stegindikator: React.FC<IStegIndikatorProps> = ({ stegListe, aktivtSteg }) => {
  const intl = useLokalIntlContext();
  const [activeStep, setActiveStep] = useState(aktivtSteg + 1);
  const [locale] = useSpråkContext();
  const erEngelskSpråk = locale === LocaleType.en;

  const translations = erEngelskSpråk
    ? {
        step: `Step ${activeStep} of ${stegListe.length}`,
        showAllSteps: 'Show all steps',
        hideAllSteps: 'Hide all steps',
      }
    : {
        step: `Steg ${activeStep} av ${stegListe.length}`,
        showAllSteps: 'Vis alle steg',
        hideAllSteps: 'Skjul alle steg',
      };

  return (
    <FormProgress
      className="stegindikator"
      totalSteps={stegListe.length}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      interactiveSteps={false}
      translations={translations}
    >
      {stegListe.map((steg) => (
        <FormProgress.Step key={steg.label}>
          {steg?.localeTeskt ? hentTekst(steg?.localeTeskt, intl) : steg.label}
        </FormProgress.Step>
      ))}
    </FormProgress>
  );
};

export default Stegindikator;
