import React, { SyntheticEvent } from 'react';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import LesMerTekst from '../LesMerTekst';
import styled from 'styled-components';
import { logSpørsmålBesvart } from '../../utils/amplitude';
import { skjemanavnTilId, urlTilSkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import RadioPanelCustom from '../panel/RadioPanel';
import { RadioGroup } from '@navikt/ds-react';
import { BooleanOgUbesvart } from '../../models/søknad/søknadsfelter';

const StyledJaNeiSpørsmål = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    padding-top: 1rem;

    @media all and (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }
`;

interface Props {
  spørsmål: ISpørsmål;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: BooleanOgUbesvart;
}

const JaNeiSpørsmål: React.FC<Props> = ({ spørsmål, onChange, valgtSvar }) => {
  const intl = useLokalIntlContext();

  const skalLogges = true;

  const url = window.location.href;

  const skjemanavn = urlTilSkjemanavn(url);
  const skjemaId = skjemanavnTilId(skjemanavn);

  const spørsmålTekst: string = intl.formatMessage({ id: spørsmål.tekstid });

  const onClickHandle = (
    e: SyntheticEvent<EventTarget, Event>,
    spørsmål: ISpørsmål,
    svar: ISvar
  ): void => {
    onChange !== undefined && svar && onChange(spørsmål, svar);
  };

  const erValgtSvarRadioKnapp = (
    svar: ISvar,
    valgtSvar: BooleanOgUbesvart
  ): boolean => {
    return (
      (svar.id === ESvar.JA && valgtSvar === BooleanOgUbesvart.JA) ||
      (svar.id === ESvar.NEI && valgtSvar === BooleanOgUbesvart.NEI)
    );
  };

  const svar = (): ESvar | null => {
    switch (valgtSvar) {
      case BooleanOgUbesvart.JA:
        return ESvar.JA;
      case BooleanOgUbesvart.NEI:
        return ESvar.NEI;
      default:
        return null;
    }
  };

  return (
    <StyledJaNeiSpørsmål key={spørsmål.søknadid}>
      <RadioGroup
        legend={spørsmålTekst}
        value={svar()}
        description={
          spørsmål.lesmer && (
            <LesMerTekst
              åpneTekstid={spørsmål.lesmer.headerTekstid}
              innholdTekstid={spørsmål.lesmer.innholdTekstid}
            />
          )
        }
      >
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad =
            valgtSvar !== undefined && erValgtSvarRadioKnapp(svar, valgtSvar);

          return (
            <RadioPanelCustom
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.id}
              checked={svarISøknad ? svarISøknad : false}
              onChange={(e) => {
                logSpørsmålBesvart(
                  skjemanavn,
                  skjemaId,
                  spørsmålTekst,
                  svar.svar_tekst,
                  skalLogges
                );
                onClickHandle(e, spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioPanelCustom>
          );
        })}
      </RadioGroup>
    </StyledJaNeiSpørsmål>
  );
};

export default JaNeiSpørsmål;
