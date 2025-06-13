import React from 'react';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import { IDatoFelt } from '../../../../../../models/søknad/søknadsfelter';
import {
  Datovelger,
  DatoBegrensning,
} from '../../../../../../components/dato/Datovelger';

interface Props {
  settDato: (date: string, objektnøkkel: string, tekstid: string) => void;
  datoEndretSamvær: IDatoFelt | undefined;
}
const EndringISamvær: React.FC<Props> = ({ settDato, datoEndretSamvær }) => {
  const datovelgerTekstid = 'sivilstatus.datovelger.endring';
  return (
    <KomponentGruppe>
      <Datovelger
        settDato={(e) => settDato(e, 'datoEndretSamvær', datovelgerTekstid)}
        valgtDato={datoEndretSamvær ? datoEndretSamvær.verdi : undefined}
        tekstid={datovelgerTekstid}
        datobegrensning={DatoBegrensning.AlleDatoer}
      />
    </KomponentGruppe>
  );
};

export default EndringISamvær;
