import React from 'react';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import Filopplaster from '../../../components/filopplaster/Filopplaster';
import LocaleTekst from '../../../language/LocaleTekst';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import { hentTekst } from '../../../utils/søknad';
import {
  BarnetilsynDokumentasjon,
  IDokumentasjon,
} from '../../../models/steg/dokumentasjon';
import { IVedlegg } from '../../../models/steg/vedlegg';
import { EFiltyper } from '../../../helpers/filtyper';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Checkbox, GuidePanel, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { GrøntDokumentIkon } from './GrøntDokumentIkon';

const StyledSeksjonGruppe = styled(SeksjonGruppe)`
  padding-bottom: 40px;
`;

const StyledGuidePanel = styled(GuidePanel)`
  .navds-guide {
    border: none;
  }
`;

interface Props {
  dokumentasjon: IDokumentasjon;
  oppdaterDokumentasjon: (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => void;
}

const LastOppVedlegg: React.FC<Props> = ({
  dokumentasjon,
  oppdaterDokumentasjon,
}) => {
  const intl = useLokalIntlContext();

  const settHarSendtInnTidligere = (huketAv: boolean) => {
    const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
    oppdaterDokumentasjon(dokumentasjon.id, vedlegg, huketAv);
  };

  const hvisIkkeFakturaForBarnepass =
    dokumentasjon.id !== BarnetilsynDokumentasjon.FAKTURA_BARNEPASSORDNING;

  return (
    <StyledSeksjonGruppe>
      <StyledGuidePanel illustration={<GrøntDokumentIkon />} poster>
        <FeltGruppe>
          <Heading size="small" level="3" style={{ justifyContent: 'left' }}>
            <LocaleTekst tekst={dokumentasjon.tittel} />
          </Heading>
        </FeltGruppe>
        {dokumentasjon.beskrivelse && (
          <FeltGruppe>
            <LocaleTekst tekst={dokumentasjon.beskrivelse} />
          </FeltGruppe>
        )}
        {hvisIkkeFakturaForBarnepass && (
          <FeltGruppe>
            <Checkbox
              checked={dokumentasjon.harSendtInn}
              onChange={(e) => settHarSendtInnTidligere(e.target.checked)}
            >
              {hentTekst('dokumentasjon.checkbox.sendtTidligere', intl)}
            </Checkbox>
          </FeltGruppe>
        )}
        {!dokumentasjon.harSendtInn && (
          <Filopplaster
            oppdaterDokumentasjon={oppdaterDokumentasjon}
            dokumentasjon={dokumentasjon}
            maxFilstørrelse={1024 * 1024 * 10}
            tillatteFiltyper={[
              EFiltyper.PNG,
              EFiltyper.PDF,
              EFiltyper.JPG,
              EFiltyper.JPEG,
            ]}
          />
        )}
      </StyledGuidePanel>
    </StyledSeksjonGruppe>
  );
};

export default LastOppVedlegg;
