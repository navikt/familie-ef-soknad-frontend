import React from 'react';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import { DatoBegrensning, Datovelger } from '../../../../../../components/dato/Datovelger';
import { useOmDeg } from '../../OmDegContext';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';

const NårFlyttetDereFraHverandre: React.FC = () => {
  const datovelgerTekstid = 'sivilstatus.datovelger.flyttetFraHverandre';
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoFlyttetFraHverandre } = sivilstatus;
  const intl = useLokalIntlContext();

  const settDatoFlyttetFraHverandre = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoFlyttetFraHverandre: {
        label: hentTekst(tekstid, intl),
        verdi: date,
      },
    });
  };

  return (
    <KomponentGruppe>
      <Datovelger
        settDato={(e) => settDatoFlyttetFraHverandre(e, datovelgerTekstid)}
        valgtDato={datoFlyttetFraHverandre ? datoFlyttetFraHverandre.verdi : undefined}
        tekstid={datovelgerTekstid}
        datobegrensning={DatoBegrensning.AlleDatoer}
      />
    </KomponentGruppe>
  );
};

export default NårFlyttetDereFraHverandre;
