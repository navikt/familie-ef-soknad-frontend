import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { hentTekstMedEnVariabel } from '../../utils/teksthåndtering';
import { GuidePanel } from '@navikt/ds-react';

export interface VeilederBoksProps {
  navn?: string;
}

export const VeilederBoks: React.FC<VeilederBoksProps> = ({ navn }) => {
  const intl = useLokalIntlContext();
  const { person } = usePersonContext();

  const søkerNavn = navn ? navn : person.søker.forkortetNavn;
  return (
    <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      {/*
      z-index er -1 slik at språkvelgeren legger seg øverst, så det er mulig å velge språk på mindre skjermer.
      */}
      <GuidePanel poster={true} style={{ zIndex: -1 }}>
        {hentTekstMedEnVariabel('skjema.hei', intl, søkerNavn)}
      </GuidePanel>
    </div>
  );
};
