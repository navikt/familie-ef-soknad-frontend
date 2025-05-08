import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { IDatoFelt } from '../../../../../models/søknad/søknadsfelter';
import {
  DatoBegrensning,
  Datovelger,
} from '../../../../../components/dato/Datovelger';

interface Props {
  settDato: (date: string, objektnøkkel: string, tekstid: string) => void;
  datoFlyttetFraHverandre: IDatoFelt | undefined;
}

const NårFlyttetDereFraHverandre: React.FC<Props> = ({
  settDato,
  datoFlyttetFraHverandre,
}) => {
  const datovelgerTekstid = 'sivilstatus.datovelger.flyttetFraHverandre';

  return (
    <KomponentGruppe>
      <Datovelger
        settDato={(e) =>
          settDato(e, 'datoFlyttetFraHverandre', datovelgerTekstid)
        }
        valgtDato={
          datoFlyttetFraHverandre ? datoFlyttetFraHverandre.verdi : undefined
        }
        tekstid={datovelgerTekstid}
        datobegrensning={DatoBegrensning.AlleDatoer}
      />
    </KomponentGruppe>
  );
};

export default NårFlyttetDereFraHverandre;
