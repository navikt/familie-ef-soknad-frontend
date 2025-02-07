import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Heading } from '@navikt/ds-react';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import Environment from '../../Environment';

export interface SistInnsendtSøknad {
  søknadsdato: string;
  stønadType: Stønadstype;
}

interface TidligereInnsendtSøknadAlertProps {
  stønadType: Stønadstype;
}

export const TidligereInnsendtSøknadAlert: React.FC<
  TidligereInnsendtSøknadAlertProps
> = ({ stønadType }) => {
  const [innsendtSøknader, settInnsendtSøknader] = useState<
    SistInnsendtSøknad[]
  >([]);

  const hentInnsendteSøknader = useCallback(() => {
    axios
      .get<SistInnsendtSøknad[]>(
        Environment().apiProxyUrl +
          '/api/soknadskvittering/sist-innsendt-per-stonad'
      )
      .then((response) => {
        settInnsendtSøknader(response.data);
      })
      .catch((error) => {
        console.error(
          'Klarte ikke å hente tidligere innsendte søknader.',
          error
        );
      });
  }, []);

  useEffect(() => {
    hentInnsendteSøknader();
  }, [hentInnsendteSøknader]);

  const visNylingInnsendtSøknadAlert = innsendtSøknader.some(
    (søknad) => søknad.stønadType === stønadType
  );

  return (
    <>
      {visNylingInnsendtSøknadAlert && (
        <Alert variant="info">
          <Heading spacing size="small" level="3">
            Du har allerede en aktiv søknad hos oss
          </Heading>
          <p>
            Vi ser at du nylig har sendt inn denne søknaden. Dersom du sender
            søknaden på nytt, vil behandlingen ta lenger tid. Ønsker du å
            opplyse om endringer eller noe nytt kan du gjøre følgende:
          </p>
          <ul>
            <li>Endre kontonummeret.</li>
            <li>Melde fra om frivillig skattetrekk på barnepensjonen.</li>
            <li>Ettersende dokumentasjon.</li>
            <li>Er det noe annet du ønsker å melde inn kan du kontakte oss.</li>
          </ul>
        </Alert>
      )}
    </>
  );
};
