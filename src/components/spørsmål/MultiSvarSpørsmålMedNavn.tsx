import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import LesMerTekst from '../LesMerTekst';
import styled from 'styled-components';
import { logSpørsmålBesvart } from '../../utils/amplitude';
import { skjemanavnTilId, urlTilSkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioGroup } from '@navikt/ds-react';
import RadioPanelCustom from '../panel/RadioPanel';

const StyledMultisvarSpørsmål = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr;
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
  spørsmålTekst: string;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: string | undefined;
}

const MultiSvarSpørsmålMedNavn: FC<Props> = ({
  spørsmål,
  spørsmålTekst,
  settSpørsmålOgSvar,
  valgtSvar,
}) => {
  const intl = useLokalIntlContext();

  const url = window.location.href;

  const skalLogges = true;

  const skjemanavn = urlTilSkjemanavn(url);
  const skjemaId = skjemanavnTilId(skjemanavn);

  const spørsmålstekstUtenNavn = intl.formatMessage({ id: spørsmål.tekstid });

  return (
    <StyledMultisvarSpørsmål key={spørsmål.søknadid}>
      <RadioGroup
        legend={spørsmålTekst}
        value={valgtSvar}
        description={
          spørsmål.lesmer && (
            <LesMerTekst
              åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
              innholdTekstid={spørsmål.lesmer ? spørsmål.lesmer.innholdTekstid : ''}
            />
          )
        }
      >
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad = svar.svar_tekst === valgtSvar;
          return (
            <RadioPanelCustom
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.svar_tekst}
              checked={svarISøknad ? svarISøknad : false}
              onChange={() => {
                logSpørsmålBesvart(
                  skjemanavn,
                  skjemaId,
                  spørsmålstekstUtenNavn,
                  svar.svar_tekst,
                  skalLogges
                );
                settSpørsmålOgSvar(spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioPanelCustom>
          );
        })}
      </RadioGroup>
    </StyledMultisvarSpørsmål>
  );
};

export default MultiSvarSpørsmålMedNavn;
