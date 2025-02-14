import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Heading } from '@navikt/ds-react';
import {
  Stønadstype,
  stønadsTypeTilEngelsk,
} from '../../models/søknad/stønadstyper';
import Environment from '../../Environment';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';
import { formatDate, strengTilDato } from '../../utils/dato';
import { useSpråkContext } from '../../context/SpråkContext';

export interface SistInnsendteSøknad {
  søknadsdato: string;
  stønadType: Stønadstype;
}

interface TidligereInnsendteSøknadAlertProps {
  stønadType: Stønadstype;
}

const ettersendingUrler = {
  [Stønadstype.overgangsstønad]:
    'https://www.nav.no/start/ettersend-soknad-overgangsstonad-enslig',
  [Stønadstype.barnetilsyn]:
    'https://www.nav.no/start/ettersend-soknad-barnetilsyn-enslig',
  [Stønadstype.skolepenger]:
    'https://www.nav.no/start/ettersend-soknad-skolepenger-enslig',
};

const kontaktOssUrl = 'https://www.nav.no/kontakt-oss';

export const TidligereInnsendteSøknaderAlert: React.FC<
  TidligereInnsendteSøknadAlertProps
> = ({ stønadType }) => {
  const { toggles } = useToggles();
  const hentSistInnsendteSøknadPerStønad =
    toggles[ToggleName.hentSistInnsendteSøknadPerStønad];
  const [locale] = useSpråkContext();

  const [innsendteSøknader, settInnsendteSøknader] = useState<
    SistInnsendteSøknad[]
  >([]);

  const hentInnsendteSøknader = useCallback(() => {
    axios
      .get<SistInnsendteSøknad[]>(
        `${Environment().apiProxyUrl}/api/soknadskvittering/sist-innsendt-per-stonad`
      )
      .then((response) => {
        const normalisertData = response.data.map((søknad) => ({
          ...søknad,
          stønadType: søknad.stønadType.toLowerCase() as Stønadstype,
        }));

        settInnsendteSøknader(normalisertData);
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
    (søknad) => søknad.stønadType === stønadType
  );

  if (!gjeldeneSøknad) {
    return null;
  }

  const tekster = {
    nb: {
      heading: 'Du har nylig sendt inn en søknad til oss',
      søkteOm: `Du søkte om ${stønadType} den ${formatDate(strengTilDato(gjeldeneSøknad.søknadsdato))}.`,
      ettersende:
        'Hvis du ikke fikk lastet opp all dokumentasjon da du søkte, kan du',
      ettersendeLink: 'ettersende det som mangler',
      endringer: 'Du kan også si ifra om endringer ved å',
      endringerLink: 'skrive en beskjed til oss',
    },
    nn: {
      heading: 'Du har nyleg sendt inn ein søknad til oss',
      søkteOm: `Du søkte om ${stønadType} den ${formatDate(strengTilDato(gjeldeneSøknad.søknadsdato))}.`,
      ettersende:
        'Viss du ikkje fekk lasta opp all dokumentasjon då du søkte, kan du',
      ettersendeLink: 'ettersenda det som manglar',
      endringer: 'Du kan òg seie ifrå om endringar ved å',
      endringerLink: 'skrive ei melding til oss',
    },
    en: {
      heading: 'You recently submitted an application to us.',
      søkteOm: `You applied for ${stønadsTypeTilEngelsk(stønadType)} on ${formatDate(strengTilDato(gjeldeneSøknad.søknadsdato))}.`,
      ettersende:
        'If you were unable to upload all the documentation when you applied, you can',
      ettersendeLink: 'submit the missing documents later',
      endringer: 'You can also inform us of any changes by',
      endringerLink: 'writing a message to us',
    },
  };

  const varselTekster = tekster[locale];

  return (
    <Alert variant="info">
      <Heading spacing size="small" level="3">
        {varselTekster.heading}
      </Heading>
      <p>{varselTekster.søkteOm}</p>
      <ul>
        <li>
          {varselTekster.ettersende}{' '}
          <a
            href={ettersendingUrler[stønadType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {varselTekster.ettersendeLink}
          </a>
          .
        </li>
        <li>
          {varselTekster.endringer}{' '}
          <a href={kontaktOssUrl} target="_blank" rel="noopener noreferrer">
            {varselTekster.endringerLink}
          </a>
          .
        </li>
      </ul>
    </Alert>
  );
};
