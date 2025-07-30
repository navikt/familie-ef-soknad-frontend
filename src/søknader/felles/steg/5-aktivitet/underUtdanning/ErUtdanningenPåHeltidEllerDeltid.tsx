import React from 'react';
import MultiSvarSpørsmål from '../../../../../components/spørsmål/MultiSvarSpørsmål';
import { heltidEllerDeltidSpm } from './UtdanningConfig';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { EUtdanning, IUnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

interface Props {
  utdanning: IUnderUtdanning;
  settUtdanning: (utdanning: IUnderUtdanning) => void;
}
const ErUtdanningenPåHeltidEllerDeltid: React.FC<Props> = ({ utdanning, settUtdanning }) => {
  const intl = useLokalIntlContext();

  const settMultiSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
    const søkerVilStudereHeltid = spørsmål.svaralternativer.find(
      (svarsalternativ) => svarsalternativ.svar_tekst === svar.svar_tekst
    );
    if (
      (spørsmål.søknadid === EUtdanning.heltidEllerDeltid &&
        søkerVilStudereHeltid &&
        utdanning.målMedUtdanning) ||
      utdanning.arbeidsmengde
    ) {
      delete utdanning.arbeidsmengde;
      delete utdanning.målMedUtdanning;
    }
    settUtdanning({
      ...utdanning,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
    });
  };
  return (
    <KomponentGruppe>
      <MultiSvarSpørsmål
        spørsmål={heltidEllerDeltidSpm(intl)}
        settSpørsmålOgSvar={settMultiSpørsmål}
        valgtSvar={utdanning.heltidEllerDeltid?.verdi}
        className="toKorteSvar"
      />
    </KomponentGruppe>
  );
};

export default ErUtdanningenPåHeltidEllerDeltid;
