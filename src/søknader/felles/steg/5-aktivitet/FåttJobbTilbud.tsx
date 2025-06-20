import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { DatoBegrensning, Datovelger } from '../../../../components/dato/Datovelger';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/søknad';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
}
const FåttJobbTilbud: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon }) => {
  const intl = useLokalIntlContext();

  const settDato = (dato: string) => {
    settArbeidssituasjon({
      ...arbeidssituasjon,
      datoOppstartJobb: {
        label: hentTekst('dinSituasjon.datovelger.jobb', intl),
        verdi: dato,
      },
    });
  };
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        <Label as="p">
          <LocaleTekst tekst={'dokumentasjon.arbeidskontrakt.tittel'} />
        </Label>
        <br />
        <BodyShort>
          <LocaleTekst tekst={'dokumentasjon.arbeidskontrakt.beskrivelse'} />
        </BodyShort>
      </AlertStripeDokumentasjon>
      <Datovelger
        valgtDato={arbeidssituasjon.datoOppstartJobb?.verdi}
        tekstid={'dinSituasjon.datovelger.jobb'}
        datobegrensning={DatoBegrensning.FremtidigeDatoer}
        settDato={settDato}
      />
    </KomponentGruppe>
  );
};
export default FåttJobbTilbud;
