import React from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import {
  Datovelger,
  DatoBegrensning,
} from '../../../../components/dato/Datovelger';

interface Props {
  sivilstatus: ISivilstatus;
  settDato: (date: string, objektnøkkel: string, tekst: string) => void;
}
const SøkerHarSøktSeparasjon: React.FC<Props> = ({ settDato, sivilstatus }) => {
  const { datoSøktSeparasjon } = sivilstatus;
  const datovelgerTekstid = 'sivilstatus.datovelger.søktSeparasjon';
  return (
    <KomponentGruppe>
      <FeltGruppe>
        <Datovelger
          settDato={(e) => settDato(e, 'datoSøktSeparasjon', datovelgerTekstid)}
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
