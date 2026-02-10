import React from 'react';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { hentTekstMedEnVariabel } from '../../utils/teksthåndtering';

export interface VeilederBoksProps {
  navn?: string;
}

export const VeilederBoks: React.FC<VeilederBoksProps> = ({ navn }) => {
  const intl = useLokalIntlContext();
  const { person } = usePersonContext();

  const søkerNavn = navn ? navn : person.søker.forkortetNavn;
  return (
    <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'center' }}>
      <VeilederSnakkeboble tekst={hentTekstMedEnVariabel('skjema.hei', intl, søkerNavn)} />
    </div>
  );
};
