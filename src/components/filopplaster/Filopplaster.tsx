import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import OpplastedeFiler from './OpplastedeFiler';
import { formaterFilstørrelse } from './utils';
import { IVedlegg } from '../../models/steg/vedlegg';
import Environment from '../../Environment';
import axios from 'axios';
import { IDokumentasjon } from '../../models/steg/dokumentasjon';
import { dagensDatoMedTidspunktStreng } from '../../utils/dato';
import { getFeilmelding } from '../../utils/feil';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, BodyShort, Box, HStack, VStack } from '@navikt/ds-react';
import { ModalWrapper } from '../Modal/ModalWrapper';
import { UploadIcon } from '@navikt/aksel-icons';
import { Accent500 } from '@navikt/ds-tokens/dist/tokens';
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

export const Filopplaster: React.FC<Props> = ({
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

      <Box
        background="accent-soft"
        borderColor="neutral-strong"
        borderWidth="2"
        borderRadius="4"
        height="64px"
        style={{
          borderStyle: 'dashed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          cursor: 'pointer',
          color: Accent500,
        }}
      >
        {åpenModal && (
          <ModalWrapper tittel="Noe har gått galt" visModal={åpenModal} onClose={() => lukkModal()}>
            <VStack gap={'space-16'} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              {feilmeldinger.map((feilmelding) => (
                <Alert size="small" key={feilmelding} variant="error" inline>
                  <BodyShort weight="semibold" size={'small'}>
                    {feilmelding}
                  </BodyShort>
                </Alert>
              ))}
            </VStack>
          </ModalWrapper>
        )}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <HStack gap={'space-16'} align={'center'}>
            <UploadIcon title={'Opplastingsikon'} fontSize={'1.5rem'} />
            <BodyShort>
              {isDragActive
                ? hentTekst('filopplaster.slipp', intl)
                : hentTekst('filopplaster.dra', intl)}
            </BodyShort>
          </HStack>
        </div>
      </Box>
    </div>
  );
};
