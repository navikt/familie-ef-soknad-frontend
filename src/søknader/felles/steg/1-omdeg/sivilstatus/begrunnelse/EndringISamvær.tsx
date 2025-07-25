import React from 'react';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import { DatoBegrensning, Datovelger } from '../../../../../../components/dato/Datovelger';
import { useOmDeg } from '../../OmDegContext';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';

const EndringISamvær: React.FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoEndretSamvær } = sivilstatus;
  const datovelgerTekstid = 'sivilstatus.datovelger.endring';

  const settDatoEndretSamvær = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoEndretSamvær: {
        label: hentTekst(tekstid, intl),
        verdi: date,
      },
    });
  };

  return (
    <KomponentGruppe>
      <Datovelger
        settDato={(e) => settDatoEndretSamvær(e, datovelgerTekstid)}
        valgtDato={datoEndretSamvær ? datoEndretSamvær.verdi : undefined}
        tekstid={datovelgerTekstid}
        datobegrensning={DatoBegrensning.AlleDatoer}
      />
    </KomponentGruppe>
  );
};

export default EndringISamvær;
