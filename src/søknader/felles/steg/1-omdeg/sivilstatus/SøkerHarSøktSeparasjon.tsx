import React from 'react';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../../components/AlertstripeDokumentasjon';
import {
  DatoBegrensning,
  Datovelger,
} from '../../../../../components/dato/Datovelger';
import { useOmDeg } from '../OmDegContext';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

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
          <LocaleTekst tekst={'sivilstatus.alert-info.søktSeparasjon'} />
        </AlertStripeDokumentasjon>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default SøkerHarSøktSeparasjon;
