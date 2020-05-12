import React from 'react';
import Datovelger, {
  DatoBegrensning,
} from '../../../../../components/dato/Datovelger';
import AlertStripe from 'nav-frontend-alertstriper';
import LocaleTekst from '../../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { IDatoFelt } from '../../../../../models/søknadsfelter';

interface Props {
  settDato: (date: Date | null, objektnøkkel: string, tekstid: string) => void;
  datoForSamlivsbrudd: IDatoFelt | undefined;
}

const DatoForSamlivsbrudd: React.FC<Props> = ({
  settDato,
  datoForSamlivsbrudd,
}) => {
  const datovelgerLabel = 'sivilstatus.alert.samlivsbruddForeldre';
  return (
    <>
      <KomponentGruppe>
        <Datovelger
          settDato={(e) => settDato(e, 'datoForSamlivsbrudd', datovelgerLabel)}
          valgtDato={
            datoForSamlivsbrudd ? datoForSamlivsbrudd.verdi : undefined
          }
          tekstid={'sivilstatus.datovelger.samlivsbrudd'}
          datobegrensning={DatoBegrensning.TidligereDatoer}
        />
        <AlertStripe type={'info'} form={'inline'}>
          <LocaleTekst tekst={datovelgerLabel} />
        </AlertStripe>
      </KomponentGruppe>
    </>
  );
};

export default DatoForSamlivsbrudd;
