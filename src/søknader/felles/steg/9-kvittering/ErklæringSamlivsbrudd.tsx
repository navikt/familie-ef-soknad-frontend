import { FC } from 'react';
import download from '../../../../assets/download.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentFilePath } from '../../../../utils/språk';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { BodyShort, Heading, Label, Link, VStack } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../../utils/hooks';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const ErklæringSamlivsbrudd: FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();

  const hentÆrklæringBasertPåSpråk = (): string => {
    return hentFilePath(locale, {
      nb: '/familie/alene-med-barn/soknad/filer/Erklaering_om_samlivsbrudd.pdf',
      en: '/familie/alene-med-barn/soknad/filer/Declaration_on_end_of_relationship_EN.pdf',
      nn: '/familie/alene-med-barn/soknad/filer/Erklaering_om_samlivsbrot_NN.pdf',
    });
  };

  const { filInformasjon } = useHentFilInformasjon(hentÆrklæringBasertPåSpråk());

  return (
    <VStack gap={'space-16'}>
      <Heading size="small" spacing={true}>
        {hentTekst('kvittering.tittel.samlivsbrudd', intl)}
      </Heading>
      <BodyShort>{hentTekst('kvittering.beskrivelse.samlivsbrudd', intl)}</BodyShort>
      <Link href={hentÆrklæringBasertPåSpråk()} download>
        <img alt="Nedlastingsikon" src={download} />
        <Label as="p">
          {hentTekst('kvittering.knapp.samlivsbrudd', intl)}
          {filInformasjon}
        </Label>
      </Link>
    </VStack>
  );
};
