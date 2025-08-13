import React, { useEffect } from 'react';
import { UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import PeriodeDatovelgere from '../../../../../components/dato/PeriodeDatovelger';
import { tomPeriode } from '../../../../../helpers/tommeSøknadsfelter';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { EPeriode } from '../../../../../models/felles/periode';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';

interface Props {
  utdanning: UnderUtdanning;
  settUtdanning: (utdanning: UnderUtdanning) => void;
}

const NårSkalDuVæreElevEllerStudent: React.FC<Props> = ({ utdanning, settUtdanning }) => {
  const intl = useLokalIntlContext();
  useEffect(() => {
    if (!utdanning.periode) {
      settUtdanning({ ...utdanning, periode: tomPeriode });
    }

    // eslint-disable-next-line
  }, []);

  const settPeriode = (nøkkel: EPeriode, dato?: string): void => {
    utdanning.periode &&
      settUtdanning({
        ...utdanning,
        periode: {
          ...utdanning.periode,
          label: hentTekst('utdanning.datovelger.studieperiode.fremtidig', intl),
          [nøkkel]: {
            label: hentTekst('periode.' + nøkkel, intl),
            verdi: dato,
          },
        },
      });
  };

  return (
    <KomponentGruppe>
      <PeriodeDatovelgere
        tekst={hentTekst('utdanning.datovelger.studieperiode.fremtidig', intl)}
        periode={utdanning.periode ? utdanning.periode : tomPeriode}
        settDato={settPeriode}
        datobegrensning={GyldigeDatoer.alle}
      />
    </KomponentGruppe>
  );
};

export default NårSkalDuVæreElevEllerStudent;
