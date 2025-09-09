import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { RadioTile } from '../panel/RadioTile';

interface Props {
  spørsmål: ISpørsmål;
  valgtSvar: boolean | undefined;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
}

const JaNeiSpørsmål: React.FC<Props> = ({ spørsmål, valgtSvar, onChange }) => {
  const intl = useLokalIntlContext();

  const lesMerHeaderTekstid = spørsmål.lesmer?.headerTekstid;
  const lesMerinnholdTekstid = spørsmål.lesmer?.innholdTekstid;

  const svarAlternativer = spørsmål.svaralternativer.map((svar) => svar.svar_tekst);

  const valgtVerdi = valgtSvar === undefined ? null : valgtSvar ? 'Ja' : 'Nei';

  const onValgtSvar = (valgt: string) => {
    const svar = spørsmål.svaralternativer.find((svar) => svar.svar_tekst === valgt);

    if (svar) {
      onChange(spørsmål, svar);
    }
  };

  return (
    <SpørsmålWrapper
      spørsmålKey={spørsmål.tekstid}
      lesMerHeaderKey={lesMerHeaderTekstid}
      lesMerDescriptionKey={lesMerinnholdTekstid}
    >
      <RadioTile
        legend={spørsmål.tekstid ? hentTekst(spørsmål.tekstid, intl) : ''}
        svarAlternativer={svarAlternativer}
        radioTileLayoutDirection={'horizontal'}
        valgtVerdi={valgtVerdi}
        onChange={onValgtSvar}
      />
    </SpørsmålWrapper>
  );
};

export default JaNeiSpørsmål;
