import { FC } from 'react';
import { ESkalBarnetBoHosSøker } from '../../../../models/steg/barnasbosted';
import { IBarn } from '../../../../models/steg/barn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { flereBarnsNavn } from '../../../../utils/barn';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';

interface Props {
  barna: IBarn[];
}

export const RegistrerBarnIFolkeregister: FC<Props> = ({ barna }) => {
  const intl = useLokalIntlContext();

  const barnSomSkalRegistreresIFolkeregister = barna.filter((barn) => {
    return barn?.forelder?.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.ja;
  });

  if (barnSomSkalRegistreresIFolkeregister.length === 0) {
    return null;
  }

  const barnasNavn = flereBarnsNavn(barnSomSkalRegistreresIFolkeregister, intl);
  const tekst = hentTekstMedEnVariabel(
    'barnasbosted.skalBliFolkeregistrert.tekst',
    intl,
    barnasNavn
  );

  return (
    <VStack gap={'4'}>
      <Heading size={'small'} spacing={true}>
        {tekst}
      </Heading>
      <BodyShort>{tekst}</BodyShort>
      <a
        target={'_blank'}
        rel={'noreferrer noopener'}
        className={'knapp knapp--standard kvittering'}
        href={'https://www.skatteetaten.no/person/folkeregister/flytte/i-norge/'}
      >
        {hentTekst('barnasbosted.skalBliFolkeregistrert.knapp', intl)}
      </a>
    </VStack>
  );
};
