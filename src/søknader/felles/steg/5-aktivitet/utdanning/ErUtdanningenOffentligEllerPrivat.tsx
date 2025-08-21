import React from 'react';
import MultiSvarSpørsmål from '../../../../../components/spørsmål/MultiSvarSpørsmål';
import { privatEllerOffentligSpm } from './UtdanningConfig';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

interface Props {
  utdanning: UnderUtdanning;
  settUtdanning: (utdanning: UnderUtdanning) => void;
}
const ErUtdanningenOffentligEllerPrivat: React.FC<Props> = ({ utdanning, settUtdanning }) => {
  const intl = useLokalIntlContext();

  const settMultiSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
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
        spørsmål={privatEllerOffentligSpm(intl)}
        settSpørsmålOgSvar={settMultiSpørsmål}
        valgtSvar={utdanning.offentligEllerPrivat?.verdi}
        className="toKorteSvar"
      />
    </KomponentGruppe>
  );
};

export default ErUtdanningenOffentligEllerPrivat;
