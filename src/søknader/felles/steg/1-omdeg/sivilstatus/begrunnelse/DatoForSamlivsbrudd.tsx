import React from 'react';
import { Datovelger } from '../../../../../../components/dato/Datovelger';
import { useOmDeg } from '../../OmDegContext';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { GyldigeDatoer } from '../../../../../../components/dato/GyldigeDatoer';
import { Alert, VStack } from '@navikt/ds-react';

export const DatoForSamlivsbrudd: React.FC = () => {
  const intl = useLokalIntlContext();

  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoForSamlivsbrudd } = sivilstatus;
  const datovelgerLabel = 'sivilstatus.datovelger.samlivsbrudd';

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
    <VStack gap={'6'}>
      <Datovelger
        settDato={(e) => settDatoForSamlivsbrudd(e, datovelgerLabel)}
        valgtDato={datoForSamlivsbrudd ? datoForSamlivsbrudd?.verdi : ''}
        tekstid={datovelgerLabel}
        gyldigeDatoer={GyldigeDatoer.Tidligere}
      />

      <Alert variant={'info'} size={'small'} inline>
        {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
      </Alert>
    </VStack>
  );
};
