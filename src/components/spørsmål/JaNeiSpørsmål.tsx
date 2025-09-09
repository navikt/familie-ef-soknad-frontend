import React, { SyntheticEvent } from 'react';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import RadioPanelCustom from '../panel/RadioPanel';
import { RadioGroup } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import { SpørsmålWrapper } from './SpørsmålWrapper';

interface Props {
  spørsmål: ISpørsmål;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: boolean | undefined;
}

const JaNeiSpørsmål: React.FC<Props> = ({ spørsmål, onChange, valgtSvar }) => {
  const intl = useLokalIntlContext();

  const spørsmålTekst: string = hentTekst(spørsmål.tekstid, intl);

  const onClickHandle = (
    e: SyntheticEvent<EventTarget, Event>,
    spørsmål: ISpørsmål,
    svar: ISvar
  ): void => {
    onChange !== undefined && svar && onChange(spørsmål, svar);
  };

  const erValgtSvarRadioKnapp = (svar: ISvar, valgtSvar: boolean): boolean => {
    return (
      (svar.id === ESvar.JA && valgtSvar === true) || (svar.id === ESvar.NEI && valgtSvar === false)
    );
  };

  const svar = (): ESvar | null => {
    switch (valgtSvar) {
      case true:
        return ESvar.JA;
      case false:
        return ESvar.NEI;
      default:
        return null;
    }
  };

  return (
    <SpørsmålWrapper
      spørsmålKey={spørsmål.tekstid}
      lesMerHeaderKey={spørsmål.lesmer?.headerTekstid}
      lesMerDescriptionKey={spørsmål.lesmer?.innholdTekstid}
    >
      <RadioGroup legend={spørsmålTekst} value={svar()}>
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad = valgtSvar !== undefined && erValgtSvarRadioKnapp(svar, valgtSvar);

          return (
            <RadioPanelCustom
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.id}
              checked={svarISøknad ? svarISøknad : false}
              onChange={(e) => {
                onClickHandle(e, spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioPanelCustom>
          );
        })}
      </RadioGroup>
    </SpørsmålWrapper>
  );
};

export default JaNeiSpørsmål;
