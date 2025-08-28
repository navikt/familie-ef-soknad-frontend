import React, { FC } from 'react';
import { EBosituasjon } from '../../../../models/steg/bosituasjon';
import { OmSamboerenDin } from './OmSamboerenDin';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { harFyltUtSamboerDetaljer } from '../../../../utils/person';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { useBosituasjon } from './BosituasjonContext';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import { VStack } from '@navikt/ds-react';

export const EkteskapslignendeForhold: FC = () => {
  const intl = useLokalIntlContext();

  const { bosituasjon, settBosituasjon } = useBosituasjon();
  const { samboerDetaljer } = bosituasjon;

  const settDatoFlyttetSammen = (dato: string, label: string) => {
    dato !== null &&
      settBosituasjon({
        ...bosituasjon,
        datoFlyttetSammenMedSamboer: {
          label: label,
          verdi: dato,
        },
      });
  };

  const visFlyttetSammenMedSamboerDatoVelger =
    samboerDetaljer && harFyltUtSamboerDetaljer(samboerDetaljer, false);

  return (
    <VStack gap={'6'}>
      <OmSamboerenDin
        tittel={'bosituasjon.tittel.omSamboer'}
        erIdentEllerFødselsdatoObligatorisk={true}
        samboerDetaljerType={EBosituasjon.samboerDetaljer}
      />

      {visFlyttetSammenMedSamboerDatoVelger && (
        <Datovelger
          valgtDato={
            bosituasjon.datoFlyttetSammenMedSamboer
              ? bosituasjon.datoFlyttetSammenMedSamboer.verdi
              : undefined
          }
          tekstid={'bosituasjon.datovelger.nårFlyttetDereSammen'}
          gyldigeDatoer={GyldigeDatoer.Tidligere}
          settDato={(e) =>
            settDatoFlyttetSammen(e, hentTekst('bosituasjon.datovelger.nårFlyttetDereSammen', intl))
          }
        />
      )}
    </VStack>
  );
};
