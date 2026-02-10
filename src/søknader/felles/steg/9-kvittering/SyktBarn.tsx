import { FC } from 'react';
import download from '../../../../assets/download.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentFilePath } from '../../../../utils/språk';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { BodyShort, Heading, Label, Link, VStack } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../../utils/hooks';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const SyktBarn: FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();

  const hentSøknadBasertPåBrukerSpråk = (): string => {
    return hentFilePath(locale, {
      nb: '/familie/alene-med-barn/soknad/filer/Huskeliste_lege_sykt_barn_OS.pdf',
      en: '/familie/alene-med-barn/soknad/filer/Checklist_for_your_doctors_appointment_child_OS_EN.pdf',
      nn: '/familie/alene-med-barn/soknad/filer/Hugseliste_lege_sjukt_barn_OS_NN.pdf',
    });
  };

  const { filInformasjon } = useHentFilInformasjon(hentSøknadBasertPåBrukerSpråk());

  return (
    <VStack gap={'space-16'}>
      <Heading size="small" spacing={true}>
        {hentTekst('kvittering.tittel.huskeliste.syktBarn', intl)}
      </Heading>
      <BodyShort>{hentTekst('kvittering.beskrivelse.huskeliste.syktBarn', intl)}</BodyShort>
      <Link href={hentSøknadBasertPåBrukerSpråk()} download>
        <img alt="Nedlastingsikon" src={download} />
        <Label as="p">
          {hentTekst('kvittering.knapp.huskeliste.syktBarn', intl)}
          {filInformasjon}
        </Label>
      </Link>
    </VStack>
  );
};
