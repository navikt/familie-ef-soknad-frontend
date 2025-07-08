import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { logSpørsmålBesvart } from '../../utils/amplitude';
import { skjemanavnTilId, urlTilSkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/søknad';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { RadioTile } from './input/RadioTile';

interface Props {
  spørsmål: ISpørsmål;
  valgtSvar: string | undefined;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
}

export const MultiSvarSpørsmål: FC<Props> = ({ spørsmål, valgtSvar, onChange }) => {
  const intl = useLokalIntlContext();

  const lesMerHeaderTekstid = spørsmål.lesmer?.headerTekstid;
  const lesMerinnholdTekstid = spørsmål.lesmer?.innholdTekstid;

  const svarAlternativer = spørsmål.svaralternativer.map((svar) => svar.svar_tekst);

  const valgtVerdi = valgtSvar === undefined ? null : valgtSvar;

  const håndterEndring = (valg: string) => {
    const svarObjekt = spørsmål.svaralternativer.find((svar) => svar.svar_tekst === valg);

    if (svarObjekt) {
      const url = window.location.href;
      const skjemanavn = urlTilSkjemanavn(url);
      const skjemaId = skjemanavnTilId(skjemanavn);
      const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);

      logSpørsmålBesvart(skjemanavn, skjemaId, spørsmålTekst, svarObjekt.svar_tekst, true);

      onChange(spørsmål, svarObjekt);
    }
  };

  return (
    <SpørsmålWrapper
      tittel={hentTekst(spørsmål.tekstid, intl)}
      lesMerTittel={lesMerHeaderTekstid && hentTekst(lesMerHeaderTekstid, intl)}
      lesMerTekst={lesMerinnholdTekstid && hentTekst(lesMerinnholdTekstid, intl)}
    >
      <RadioTile
        legend={spørsmål.tekstid ? hentTekst(spørsmål.tekstid, intl) : ''}
        svarAlternativer={svarAlternativer}
        radioTileLayoutDirection={'vertical'}
        valgtVerdi={valgtVerdi}
        onChange={håndterEndring}
      />
    </SpørsmålWrapper>
  );
};
