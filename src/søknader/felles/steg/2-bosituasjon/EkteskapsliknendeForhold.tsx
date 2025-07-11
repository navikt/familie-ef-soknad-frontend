import React, { FC } from 'react';
import { EBosituasjon } from '../../../../models/steg/bosituasjon';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { OmSamboerenDin } from './OmSamboerenDin';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { harFyltUtSamboerDetaljer } from '../../../../utils/person';
import { DatoBegrensning, Datovelger } from '../../../../components/dato/Datovelger';
import { useBosituasjon } from './BosituasjonContext';

export const EkteskapsliknendeForhold: FC = () => {
  const { bosituasjon, settBosituasjon } = useBosituasjon();
  const intl = useLokalIntlContext();
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

  return (
    <SeksjonGruppe>
      <OmSamboerenDin
        tittel={'bosituasjon.tittel.omSamboer'}
        erIdentEllerFødselsdatoObligatorisk={true}
        samboerDetaljerType={EBosituasjon.samboerDetaljer}
      />
      {samboerDetaljer && harFyltUtSamboerDetaljer(samboerDetaljer, false) && (
        <FeltGruppe>
          <Datovelger
            valgtDato={
              bosituasjon.datoFlyttetSammenMedSamboer
                ? bosituasjon.datoFlyttetSammenMedSamboer.verdi
                : undefined
            }
            tekstid={'bosituasjon.datovelger.nårFlyttetDereSammen'}
            datobegrensning={DatoBegrensning.TidligereDatoer}
            settDato={(e) =>
              settDatoFlyttetSammen(
                e,
                hentTekst('bosituasjon.datovelger.nårFlyttetDereSammen', intl)
              )
            }
          />
        </FeltGruppe>
      )}
    </SeksjonGruppe>
  );
};
