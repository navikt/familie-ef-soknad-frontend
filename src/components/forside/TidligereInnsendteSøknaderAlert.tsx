import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Heading } from '@navikt/ds-react';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import Environment from '../../Environment';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';

export interface SistInnsendteSøknad {
  søknadsdato: string;
  stønadType: Stønadstype;
}

interface TidligereInnsendteSøknadAlertProps {
  stønadType: Stønadstype;
}

export const TidligereInnsendteSøknaderAlert: React.FC<
  TidligereInnsendteSøknadAlertProps
> = ({ stønadType }) => {
  const { toggles } = useToggles();
  const hentSistInnsendteSøknadPerStønad =
    toggles[ToggleName.hentSistInnsendteSøknadPerStønad];

  const [innsendteSøknader, settInnsendteSøknader] = useState<
    SistInnsendteSøknad[]
  >([]);

  const hentInnsendteSøknader = useCallback(() => {
    axios
      .get<SistInnsendteSøknad[]>(
        Environment().apiProxyUrl +
          '/api/soknadskvittering/sist-innsendt-per-stonad'
      )
      .then((response) => {
        settInnsendteSøknader(response.data);
      })
      .catch((error) => {
        console.error(
          'Klarte ikke å hente tidligere innsendte søknader.',
          error
        );
      });
  }, []);

  useEffect(() => {
    if (hentSistInnsendteSøknadPerStønad) {
      hentInnsendteSøknader();
    }
  }, [hentInnsendteSøknader, hentSistInnsendteSøknadPerStønad]);

  const visNylingInnsendtSøknadAlert = innsendteSøknader.some(
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
