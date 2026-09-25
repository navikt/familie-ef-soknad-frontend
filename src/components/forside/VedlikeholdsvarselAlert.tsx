import React from 'react';
import { BodyLong, GlobalAlert } from '@navikt/ds-react';
import { useSpråkContext } from '../../context/SpråkContext';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';
import { LocaleType } from '../../language/typer';

export const VedlikeholdsvarselAlert: React.FC = () => {
  const { toggles } = useToggles();
  const [locale] = useSpråkContext();

  if (!toggles[ToggleName.vedlikeholdsvarsel]) {
    return null;
  }

  const tekst =
    locale === LocaleType.en
      ? {
          tittel: 'Information about planned maintenance',
          avsnitt1:
            'On the 30th of September 2026, from 15.30 to 21.00, the application will be unavailable due to planned maintenance.',
          avsnitt2:
            'If you need to apply during this period, we recommend that you submit your application before the downtime starts.',
          avsnitt3: 'We apologise for any inconvenience this may cause.',
        }
      : {
          tittel: 'Informasjon om planlagt vedlikehold',
          avsnitt1:
            'Den 30. september 2026 fra kl. 15.30 til kl. 21.00 vil søknaden være utilgjengelig på grunn av planlagt vedlikehold.',
          avsnitt2:
            'Hvis du skal søke i denne perioden, anbefaler vi at du sender inn søknaden før nedetiden starter.',
          avsnitt3: 'Vi beklager ulempene dette medfører.',
        };

  return (
    <GlobalAlert
      status="announcement"
      style={{
        marginBottom: '2rem',
        width: '99vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-49.5vw',
        marginRight: '-49.5vw',
      }}
    >
      <GlobalAlert.Header>
        <GlobalAlert.Title as="h2">{tekst.tittel}</GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        <BodyLong spacing>{tekst.avsnitt1}</BodyLong>
        <BodyLong spacing>{tekst.avsnitt2}</BodyLong>
        <BodyLong>{tekst.avsnitt3}</BodyLong>
      </GlobalAlert.Content>
    </GlobalAlert>
  );
};
