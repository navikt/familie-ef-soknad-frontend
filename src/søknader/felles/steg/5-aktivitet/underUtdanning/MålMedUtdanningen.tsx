import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import {
  EUtdanning,
  IUnderUtdanning,
} from '../../../../../models/steg/aktivitet/utdanning';
import { hentTekst } from '../../../../../utils/søknad';
import AlertStripeDokumentasjon from '../../../../../components/AlertstripeDokumentasjon';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { BodyShort, Label, Textarea } from '@navikt/ds-react';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';

interface Props {
  utdanning: IUnderUtdanning;
  oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
  stønadstype: Stønadstype;
}

const MålMedUtdanningen: React.FC<Props> = ({
  utdanning,
  oppdaterUtdanning,
  stønadstype,
}) => {
  const intl = useLokalIntlContext();

  const settMålMedUtdanning = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    oppdaterUtdanning(
      EUtdanning.målMedUtdanning,
      målMedUtdanningLabel,
      e.currentTarget.value
    );
  };

  const målMedUtdanningLabel = hentTekst('utdanning.spm.mål', intl);

  return (
    <KomponentGruppe>
      <FeltGruppe>
        <Textarea
          autoComplete={'off'}
          label={målMedUtdanningLabel}
          value={
            utdanning.målMedUtdanning?.verdi
              ? utdanning.målMedUtdanning?.verdi
              : ''
          }
          maxLength={1000}
          onChange={(e) => settMålMedUtdanning(e)}
        />
      </FeltGruppe>

      <FeltGruppe>
        <AlertStripeDokumentasjon>
          <Label as="p">
            <LocaleTekst tekst="utdanning.alert-tittel.mål" />
          </Label>
          <BodyShort>
            <LocaleTekst
              tekst={`utdanning.alert-beskrivelse.mål.${stønadstype}`}
            />
          </BodyShort>
        </AlertStripeDokumentasjon>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default MålMedUtdanningen;
