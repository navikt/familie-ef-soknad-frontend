import React from 'react';
import { DatoBegrensning, Datovelger } from '../../../../../../components/dato/Datovelger';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../../../components/AlertstripeDokumentasjon';
import { useOmDeg } from '../../OmDegContext';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/søknad';

const DatoForSamlivsbrudd: React.FC = () => {
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoForSamlivsbrudd } = sivilstatus;
  const datovelgerLabel = 'sivilstatus.datovelger.samlivsbrudd';
  const intl = useLokalIntlContext();

  const settDatoForSamlivsbrudd = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoForSamlivsbrudd: {
        label: intl.formatMessage({ id: tekstid }),
        verdi: date,
      },
    });
  };

  return (
    <>
      <KomponentGruppe>
        <Datovelger
          settDato={(e) => settDatoForSamlivsbrudd(e, datovelgerLabel)}
          valgtDato={datoForSamlivsbrudd ? datoForSamlivsbrudd?.verdi : ''}
          tekstid={datovelgerLabel}
          datobegrensning={DatoBegrensning.TidligereDatoer}
        />
        <AlertStripeDokumentasjon>
          {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
    </>
  );
};

export default DatoForSamlivsbrudd;
