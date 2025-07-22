import React from 'react';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../../components/AlertstripeDokumentasjon';
import { DatoBegrensning, Datovelger } from '../../../../../components/dato/Datovelger';
import { useOmDeg } from '../OmDegContext';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/teksthåndtering';

const SøkerHarSøktSeparasjon: React.FC = () => {
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { datoSøktSeparasjon } = sivilstatus;
  const datovelgerTekstid = 'sivilstatus.datovelger.søktSeparasjon';
  const intl = useLokalIntlContext();

  const settDatoSøktSeparasjon = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoSøktSeparasjon: {
        label: intl.formatMessage({ id: tekstid }),
        verdi: date,
      },
    });
  };

  return (
    <KomponentGruppe>
      <FeltGruppe>
        <Datovelger
          settDato={(e) => settDatoSøktSeparasjon(e, datovelgerTekstid)}
          valgtDato={datoSøktSeparasjon ? datoSøktSeparasjon.verdi : undefined}
          tekstid={datovelgerTekstid}
          datobegrensning={DatoBegrensning.TidligereDatoer}
        />
      </FeltGruppe>
      <FeltGruppe>
        <AlertStripeDokumentasjon>
          {hentTekst('sivilstatus.alert-info.søktSeparasjon', intl)}
        </AlertStripeDokumentasjon>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default SøkerHarSøktSeparasjon;
