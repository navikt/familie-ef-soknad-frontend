import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import opplasting from '../../assets/opplasting.svg';
import OpplastedeFiler from './OpplastedeFiler';
import { formaterFilstørrelse } from './utils';
import { IVedlegg } from '../../models/steg/vedlegg';
import Environment from '../../Environment';
import axios from 'axios';
import { IDokumentasjon } from '../../models/steg/dokumentasjon';
import { dagensDatoMedTidspunktStreng } from '../../utils/dato';
import { getFeilmelding } from '../../utils/feil';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, BodyShort } from '@navikt/ds-react';
import { ModalWrapper } from '../Modal/ModalWrapper';
import styled from 'styled-components';
import { ABlue500, ADeepblue50, AGray700 } from '@navikt/ds-tokens/dist/tokens';
import {
  hentTekst,
  hentTekstMedEnVariabel,
  hentTekstMedFlereVariabler,
} from '../../utils/teksthåndtering';

interface Props {
  oppdaterDokumentasjon: (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => void;
  dokumentasjon: IDokumentasjon;
  tillatteFiltyper?: string[];
  maxFilstørrelse?: number;
}

interface OpplastetVedleggResponse {
  data: OpplastetVedlegg;
}

interface OpplastetVedlegg {
  dokumentId: string;
  filnavn: string;
}

const FilopplastingFelt = styled.div`
  font-weight: bold;
  border: 2px dashed ${AGray700};
  border-radius: 4px;
  background-color: ${ADeepblue50};
  color: ${ABlue500};
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const IkonOgTekstWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const FeilmeldingModalInnhold = styled.div`
  margin-top: 2rem;
  margin-bottom: 1rem;

  div {
    font-weight: bold;
  }
`;

const Filopplaster: React.FC<Props> = ({
  oppdaterDokumentasjon,
  dokumentasjon,
  tillatteFiltyper,
  maxFilstørrelse,
}) => {
  const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
  const [åpenModal, settÅpenModal] = useState<boolean>(false);
  const intl = useLokalIntlContext();

  const lukkModal = () => {
    settÅpenModal(false);
  };

  const onDrop = useCallback(
    (filer: File[]) => {
      const feilmeldingsliste: string[] = [];
      const nyeVedlegg: IVedlegg[] = [];

      filer.forEach((fil: File) => {
        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
          const maks = formaterFilstørrelse(maxFilstørrelse);

          const feilmelding = hentTekstMedFlereVariabler('filopplaster.feilmelding.maks', intl, {
            0: fil.name,
            1: maks,
          });

          feilmeldingsliste.push(feilmelding);

          settFeilmeldinger(feilmeldingsliste);
          settÅpenModal(true);
          return;
        }

        if (tillatteFiltyper && !tillatteFiltyper.includes(fil.type)) {
          const feilmelding = hentTekstMedEnVariabel(
            'filopplaster.feilmelding.filtype',
            intl,
            fil.name
          );
          feilmeldingsliste.push(feilmelding);
          settFeilmeldinger(feilmeldingsliste);
          settÅpenModal(true);

          return;
        }

        const requestData = new FormData();
        requestData.append('file', fil);

        axios
          .post<FormData, OpplastetVedleggResponse>(
            `${Environment().dokumentProxyUrl}`,
            requestData,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data',
                accept: 'application/json',
              },
              transformRequest: () => {
                return requestData;
              },
            }
          )
          .then((response: { data: OpplastetVedlegg }) => {
            const { data } = response;
            nyeVedlegg.push({
              dokumentId: data.dokumentId,
              navn: fil.name,
              størrelse: fil.size,
              tidspunkt: dagensDatoMedTidspunktStreng,
            });

            const opplastedeVedlegg = dokumentasjon.opplastedeVedlegg || [];
            oppdaterDokumentasjon(
              dokumentasjon.id,
              [...opplastedeVedlegg, ...nyeVedlegg],
              dokumentasjon.harSendtInn
            );
          })
          .catch((error) => {
            const feilmelding = getFeilmelding(
              intl,
              'filopplaster.feilmelding',
              'generisk',
              error?.response?.data?.melding
            );
            feilmeldingsliste.push(feilmelding);

            settFeilmeldinger(feilmeldingsliste);
            settÅpenModal(true);
          });
      });
    },
    // eslint-disable-next-line
    [dokumentasjon.opplastedeVedlegg]
  );

  const slettVedlegg = (fil: IVedlegg) => {
    const opplastedeVedlegg = dokumentasjon.opplastedeVedlegg || [];
    const nyVedleggsliste = opplastedeVedlegg.filter((obj: IVedlegg) => {
      return obj.dokumentId !== fil.dokumentId;
    });
    oppdaterDokumentasjon(dokumentasjon.id, nyVedleggsliste, dokumentasjon.harSendtInn);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <OpplastedeFiler
        filliste={dokumentasjon.opplastedeVedlegg || []}
        slettVedlegg={slettVedlegg}
      />

      <FilopplastingFelt>
        {åpenModal && (
          <ModalWrapper tittel="Noe har gått galt" visModal={åpenModal} onClose={() => lukkModal()}>
            <FeilmeldingModalInnhold>
              {feilmeldinger.map((feilmelding) => (
                <Alert size="small" key={feilmelding} variant="error" inline>
                  {feilmelding}
                </Alert>
              ))}
            </FeilmeldingModalInnhold>
          </ModalWrapper>
        )}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <IkonOgTekstWrapper>
            <img src={opplasting} alt="Opplastingsikon" />
            <BodyShort>
              {isDragActive
                ? hentTekst('filopplaster.slipp', intl)
                : hentTekst('filopplaster.dra', intl)}
            </BodyShort>
          </IkonOgTekstWrapper>
        </div>
      </FilopplastingFelt>
    </div>
  );
};

export default Filopplaster;
