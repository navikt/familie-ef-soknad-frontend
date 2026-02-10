import React from 'react';
import { Filopplaster } from '../../../../components/filopplaster/Filopplaster';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { BarnetilsynDokumentasjon, IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { IVedlegg } from '../../../../models/steg/vedlegg';
import { EFiltyper } from '../../../../helpers/filtyper';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Checkbox, GuidePanel, Heading, VStack } from '@navikt/ds-react';
import { GrøntDokumentIkon } from './GrøntDokumentIkon';
import styles from './LastOppVedlegg.module.css';

interface Props {
  dokumentasjon: IDokumentasjon;
  oppdaterDokumentasjon: (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => void;
}

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
  const intl = useLokalIntlContext();

  const settHarSendtInnTidligere = (huketAv: boolean) => {
    const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
    oppdaterDokumentasjon(dokumentasjon.id, vedlegg, huketAv);
  };

  const hvisIkkeFakturaForBarnepass =
    dokumentasjon.id !== BarnetilsynDokumentasjon.FAKTURA_BARNEPASSORDNING;

  return (
    <GuidePanel
      className={styles.guidePanel}
      style={{ border: 'none' }}
      illustration={<GrøntDokumentIkon />}
      poster
    >
      <VStack gap={'space-32'}>
        <Heading size="small" level="3" style={{ justifyContent: 'left' }}>
          {hentTekst(dokumentasjon.tittel, intl)}
        </Heading>
        {dokumentasjon.beskrivelse && (
          <BodyShort>{hentHTMLTekst(dokumentasjon.beskrivelse, intl)}</BodyShort>
        )}
        {hvisIkkeFakturaForBarnepass && (
          <Checkbox
            checked={dokumentasjon.harSendtInn}
            onChange={(e) => settHarSendtInnTidligere(e.target.checked)}
          >
            {hentTekst('dokumentasjon.checkbox.sendtTidligere', intl)}
          </Checkbox>
        )}
        {!dokumentasjon.harSendtInn && (
          <Filopplaster
            oppdaterDokumentasjon={oppdaterDokumentasjon}
            dokumentasjon={dokumentasjon}
            maxFilstørrelse={1024 * 1024 * 10}
            tillatteFiltyper={[EFiltyper.PNG, EFiltyper.PDF, EFiltyper.JPG, EFiltyper.JPEG]}
          />
        )}
      </VStack>
    </GuidePanel>
  );
};

export default LastOppVedlegg;
