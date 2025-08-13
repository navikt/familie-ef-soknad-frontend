import React from 'react';
import { Datovelger } from '../../../../../../components/dato/Datovelger';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../../../components/AlertstripeDokumentasjon';
import { useOmDeg } from '../../OmDegContext';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { GyldigeDatoer } from '../../../../../../components/dato/GyldigeDatoer';

const DatoForSamlivsbrudd: React.FC = () => {
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoForSamlivsbrudd } = sivilstatus;
  const datovelgerLabel = 'sivilstatus.datovelger.samlivsbrudd';
  const intl = useLokalIntlContext();

  const settDatoForSamlivsbrudd = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoForSamlivsbrudd: {
        label: hentTekst(tekstid, intl),
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
          gyldigeDatoer={GyldigeDatoer.tidligere}
        />
        <AlertStripeDokumentasjon>
          {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
    </>
  );
};

export default DatoForSamlivsbrudd;
