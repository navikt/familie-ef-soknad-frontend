import React from 'react';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { RadioTile } from './input/RadioTile';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { logSpørsmålBesvart } from '../../utils/amplitude';
import { skjemanavnTilId, urlTilSkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/søknad';

interface Props {
  spørsmål: ISpørsmål;
  valgtSvar: boolean | undefined;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
}

export const JaNeiSpørsmålV2: React.FC<Props> = ({ spørsmål, valgtSvar, onChange }) => {
  const intl = useLokalIntlContext();

  const svarAlternativer = spørsmål.svaralternativer.map((svar) => svar.svar_tekst);

  const valgtVerdi = valgtSvar === undefined ? null : valgtSvar ? 'Ja' : 'Nei';

  const håndterEndring = (valgt: string) => {
    const svarObjekt = spørsmål.svaralternativer.find((svar) => svar.svar_tekst === valgt);

    if (svarObjekt) {
      const url = window.location.href;
      const skjemanavn = urlTilSkjemanavn(url);
      const skjemaId = skjemanavnTilId(skjemanavn);
      const spørsmålTekst = intl.formatMessage({ id: spørsmål.tekstid });

      logSpørsmålBesvart(skjemanavn, skjemaId, spørsmålTekst, svarObjekt.svar_tekst, true);

      onChange(spørsmål, svarObjekt);
    }
  };

  return (
    <SpørsmålWrapper
      tittel={intl.formatMessage({ id: spørsmål.tekstid })}
      lesMerTittel={
        spørsmål.lesmer?.headerTekstid ? hentTekst(spørsmål.lesmer.headerTekstid, intl) : undefined
      }
      lesMerTekst={
        spørsmål.lesmer?.innholdTekstid
          ? hentTekst(spørsmål.lesmer.innholdTekstid, intl)
          : undefined
      }
    >
      <RadioTile
        legend={
          spørsmål.lesmer?.headerTekstid ? hentTekst(spørsmål.lesmer.headerTekstid, intl) : ''
        }
        svarAlternativer={svarAlternativer}
        radioTileLayoutDirection={'horizontal'}
        valgtVerdi={valgtVerdi}
        onChange={håndterEndring}
      />
    </SpørsmålWrapper>
  );
};
