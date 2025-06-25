import React, { FC } from 'react';
import { EBosituasjon, IBosituasjon } from '../../../../models/steg/bosituasjon';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import OmSamboerenDin from './OmSamboerenDin';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { harFyltUtSamboerDetaljer } from '../../../../utils/person';
import { DatoBegrensning, Datovelger } from '../../../../components/dato/Datovelger';

interface Props {
  settBosituasjon: (bosituasjon: IBosituasjon) => void;
  bosituasjon: IBosituasjon;
}

const OmTidligereSamboer: FC<Props> = ({ settBosituasjon, bosituasjon }) => {
  const intl = useLokalIntlContext();

  const settDatoFlyttetFraHverandre = (dato: string) => {
    dato !== null &&
      settBosituasjon({
        ...bosituasjon,
        [EBosituasjon.datoFlyttetFraHverandre]: {
          label: hentTekst('bosituasjon.datovelger.nårFlyttetDereFraHverandre', intl),
          verdi: dato,
        },
      });
  };

  return (
    <SeksjonGruppe aria-live="polite">
      <OmSamboerenDin
        tittel={'bosituasjon.tittel.omTidligereSamboer'}
        erIdentEllerFødselsdatoObligatorisk={false}
        settBosituasjon={settBosituasjon}
        bosituasjon={bosituasjon}
        samboerDetaljerType={EBosituasjon.samboerDetaljer}
      />
      {bosituasjon.samboerDetaljer &&
        harFyltUtSamboerDetaljer(bosituasjon.samboerDetaljer, true) && (
          <FeltGruppe>
            <Datovelger
              aria-live="polite"
              valgtDato={
                bosituasjon.datoFlyttetFraHverandre
                  ? bosituasjon.datoFlyttetFraHverandre.verdi
                  : undefined
              }
              tekstid={'bosituasjon.datovelger.nårFlyttetDereFraHverandre'}
              datobegrensning={DatoBegrensning.AlleDatoer}
              settDato={settDatoFlyttetFraHverandre}
            />
          </FeltGruppe>
        )}
    </SeksjonGruppe>
  );
};

export default OmTidligereSamboer;
