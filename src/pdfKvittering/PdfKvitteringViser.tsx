import { useEffect, useState } from 'react';
import { pdfjs, Page as PdfPage, Document } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import '@navikt/ds-css';
import axios from 'axios';
import Environment from '../Environment';
import { HStack, VStack, Button, Page } from '@navikt/ds-react';
import { Box } from 'lucide-react';
import { CloudDownIcon } from '@navikt/aksel-icons';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
};
export const hentPdfKvittering = async (): Promise<any> => {
  const response = await axios.get(
    `${Environment().apiProxyUrl}/api/soknadskvittering/a7943223-a851-4e43-a150-2a000d8af05d`,
    axiosConfig
  );

  return response && response.data;
};

export function PdfKvitteringViser() {
  const [pdfLenke, settPdfLenke] = useState<string | null>(null);
  const [sidetall, settSidetall] = useState(1);
  const [antallSider, settAntallSider] = useState(0);

  useEffect(() => {
    hentPdfKvittering().then((pdfKvittering) => {
      const lenkeKilde = `data:application/pdf;base64,${pdfKvittering.pdf}`;
      settPdfLenke(lenkeKilde);
    });
  }, []);

  return (
    <Page className="bg-blue-100">
      {pdfLenke && (
        <>
          <HStack margin={'2'} gap={'10'}>
            <Box className="mr-8 overflow-auto w-fit max-w-[60%]">
              <Document
                file={pdfLenke}
                onLoadSuccess={({ numPages }) => settAntallSider(numPages)}
              >
                <PdfPage pageNumber={sidetall}></PdfPage>
              </Document>
            </Box>

            <VStack gap={'3'}>
              <HStack justify={'space-between'}>
                <VStack>
                  <p>
                    Side {sidetall} av {antallSider}
                  </p>

                  <HStack gap={'4'}>
                    <Button
                      disabled={sidetall === 1}
                      onClick={() => settSidetall(sidetall - 1)}
                    >
                      Forrige
                    </Button>
                    f
                    <Button
                      disabled={sidetall === antallSider}
                      onClick={() => settSidetall(sidetall + 1)}
                    >
                      Neste
                    </Button>
                    <Button icon={<CloudDownIcon aria-hidden />}>
                      Last ned Pdf
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </HStack>
        </>
      )}
    </Page>
  );
}
