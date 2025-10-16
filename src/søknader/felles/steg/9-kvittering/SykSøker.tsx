import { FC } from 'react';
import download from '../../../../assets/download.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Heading, Label, Link, VStack } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../../utils/hooks';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const SykSøker: FC<{ filPath: string }> = ({ filPath }) => {
  const intl = useLokalIntlContext();
  const { filInformasjon } = useHentFilInformasjon(filPath);
  return (
    <VStack gap={'4'}>
      <Heading size="small" spacing={true}>
        {hentTekst('kvittering.tittel.huskeliste.erSyk', intl)}
      </Heading>
      <BodyShort>{hentTekst('kvittering.beskrivelse.huskeliste.erSyk', intl)}</BodyShort>
      <Link href={filPath} download>
        <img alt="Nedlastingsikon" src={download} />
        <Label as="p">
          {hentTekst('kvittering.knapp.huskeliste.erSyk', intl)}
          {filInformasjon}
        </Label>
      </Link>
    </VStack>
  );
};
