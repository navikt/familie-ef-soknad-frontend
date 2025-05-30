import React from 'react';
import { Spørsmål, SpørsmålSvarInputType } from './Spørsmål';
import { RadioInputKomponent } from './input/RadioInput';
import { DatoInputKomponent } from './input/DatoInputKomponent';

interface SpørsmålRendererProps {
  spørsmål: Spørsmål;
  verdi: any;
  onChange: (value: any) => void;
}

export const SpørsmålRenderer: React.FC<SpørsmålRendererProps> = ({
  spørsmål,
  verdi,
  onChange,
}) => {
  switch (spørsmål.spørsmålSvarInputType) {
    case SpørsmålSvarInputType.RADIO:
      return (
        <RadioInputKomponent
          spørsmålId={spørsmål.id}
          svarAlternativer={spørsmål.svarAlternativer}
          svarAlternativRetning={spørsmål.svarAlternativRetning}
          verdi={verdi}
          onChange={onChange}
        />
      );

    case SpørsmålSvarInputType.DATO:
    case SpørsmålSvarInputType.DATO_PERIODE:
      return (
        <DatoInputKomponent
          label={'label'} // TODO: fiks denne.
          verdi={verdi}
          onChange={onChange}
          tillaterDatoTilbakeITid={spørsmål.tillaterDatoTilbakeITid}
        />
      );

    case SpørsmålSvarInputType.TEKST:
      return (
        <input
          type="text"
          value={verdi}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case SpørsmålSvarInputType.INGEN_INPUT:
    default:
      return null;
  }
};
