import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { EUtdanning, UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentHTMLTekst, hentTekst } from '../../../../../utils/teksthåndtering';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { BodyShort, Label, Textarea } from '@navikt/ds-react';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { AlertStripeDokumentasjon } from '../../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

interface Props {
  utdanning: UnderUtdanning;
  oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
  stønadstype: Stønadstype;
}

const MålMedUtdanningen: React.FC<Props> = ({ utdanning, oppdaterUtdanning, stønadstype }) => {
  const intl = useLokalIntlContext();

  const settMålMedUtdanning = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    oppdaterUtdanning(EUtdanning.målMedUtdanning, målMedUtdanningLabel, e.currentTarget.value);
  };

  const målMedUtdanningLabel = hentTekst('utdanning.spm.mål', intl);

  return (
    <KomponentGruppe>
      <FeltGruppe>
        <Textarea
          autoComplete={'off'}
          label={målMedUtdanningLabel}
          value={utdanning.målMedUtdanning?.verdi ? utdanning.målMedUtdanning?.verdi : ''}
          maxLength={1000}
          onChange={(e) => settMålMedUtdanning(e)}
        />
      </FeltGruppe>

      <FeltGruppe>
        <AlertStripeDokumentasjon>
          <Label as="p"> {hentTekst('utdanning.alert-tittel.mål', intl)} </Label>
          <BodyShort size={'small'}>
            {hentHTMLTekst(`utdanning.alert-beskrivelse.mål.${stønadstype}`, intl)}
          </BodyShort>
        </AlertStripeDokumentasjon>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default MålMedUtdanningen;
