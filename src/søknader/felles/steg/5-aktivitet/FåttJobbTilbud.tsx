import React from 'react';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
}
export const FåttJobbTilbud: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon }) => {
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
    <VStack>
      <AlertStripeDokumentasjon>
        <Label as="p">{hentTekst('dokumentasjon.arbeidskontrakt.tittel', intl)}</Label>
        <br />
        <BodyShort size={'small'}>
          {hentHTMLTekst('dokumentasjon.arbeidskontrakt.beskrivelse', intl)}
        </BodyShort>
      </AlertStripeDokumentasjon>
      <Datovelger
        valgtDato={arbeidssituasjon.datoOppstartJobb?.verdi}
        tekstid={'dinSituasjon.datovelger.jobb'}
        gyldigeDatoer={GyldigeDatoer.Fremtidige}
        settDato={settDato}
      />
    </VStack>
  );
};
