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
  const [aktiveSøknader, settAktiveSøknader] = useState<SistInnsendtSøknad[]>(
    []
  );

  const hentAktiveSøknader = useCallback(() => {
    axios
      .get<SistInnsendtSøknad[]>(
        Environment().apiProxyUrl +
          '/api/soknadskvittering/sist-innsendt-per-stonad'
      )
      .then((response) => {
        settAktiveSøknader(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    hentAktiveSøknader();
  }, [hentAktiveSøknader]);

  const visNylingInnsendtSøknadAlert = aktiveSøknader.some(
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
            <li>endre kontonummeret</li>
            <li>melde fra om frivillig skattetrekk på barnepensjonen</li>
            <li>ettersende dokumentasjon</li>
            <li>Er det noe annet du ønsker å melde inn kan du kontakte oss</li>
          </ul>
        </Alert>
      )}
    </>
  );
};
