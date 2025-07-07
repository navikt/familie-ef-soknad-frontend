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

export const OmTidligereSamboer: FC = () => {
  const { bosituasjon, settBosituasjon } = useBosituasjon();
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
        samboerDetaljerType={EBosituasjon.samboerDetaljer}
        testIderTextFieldMedBredde={'bosituasjon-tidligere-samboer-navn'}
        testIderIdentEllerFødselsdatoGruppe={[
          'bosituasjon-tidligere-samboer-fødselsnummer',
          'bosituasjon-tidligere-samboer-checkbox',
          'bosituasjon-tidligere-samboer-fødselsdato',
        ]}
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
