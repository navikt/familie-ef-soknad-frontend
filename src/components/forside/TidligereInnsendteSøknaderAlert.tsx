import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Heading } from '@navikt/ds-react';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import Environment from '../../Environment';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';
import { formatDate } from '../../utils/dato';

export interface SistInnsendteSøknad {
  søknadsdato: Date;
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

  const ettersendUrls = useMemo(
    () => ({
      [Stønadstype.overgangsstønad]:
        'https://www.nav.no/start/ettersend-soknad-overgangsstonad-enslig',
      [Stønadstype.barnetilsyn]:
        'https://www.nav.no/start/ettersend-soknad-barnetilsyn-enslig',
      [Stønadstype.skolepenger]:
        'https://www.nav.no/start/ettersend-soknad-skolepenger-enslig',
    }),
    []
  );

  const kontaktOssUrl = 'https://www.nav.no/kontakt-oss';

  const hentInnsendteSøknader = useCallback(() => {
    axios
      .get<SistInnsendteSøknad[]>(
        `${Environment().apiProxyUrl}/api/soknadskvittering/sist-innsendt-per-stonad`
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

  const gjeldeneSøknad = innsendteSøknader.find(
    (søknad) => søknad.stønadType.valueOf().toLowerCase() === stønadType
  );

  if (!gjeldeneSøknad) {
    return null;
  }

  return (
    <Alert variant="info">
      <Heading spacing size="small" level="3">
        Du har nylig sendt inn en søknad til oss
      </Heading>
      <p>
        {`Du søkte om ${stønadType} den ${formatDate(gjeldeneSøknad.søknadsdato)}.`}
      </p>
      <ul>
        <li>
          Hvis du ikke fikk lastet opp all dokumentasjon da du søkte, kan du{' '}
          <a
            href={ettersendUrls[stønadType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            ettersende det som mangler
          </a>
          .
        </li>
        <li>
          Du kan også si ifra om endringer ved å{' '}
          <a href={kontaktOssUrl} target="_blank" rel="noopener noreferrer">
            skrive en beskjed til oss
          </a>
          .
        </li>
      </ul>
    </Alert>
  );
};
