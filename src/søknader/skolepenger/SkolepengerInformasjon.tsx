import React from 'react';
import { InformasjonProps } from '../../components/forside/typer';
import { hentPath } from '../../utils/routing';
import { ERouteSkolepenger, RoutesSkolepenger } from './routing/routes';
import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';

export const SkolepengerInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const intl = useLokalIntlContext();
  const nesteSide = hentPath(RoutesSkolepenger, ERouteSkolepenger.OmDeg) || '';

  return (
    <VStack gap={'space-40'} align={'center'}>
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.skolepenger} />

      <VStack gap={'space-12'}>
        <BodyShort>{hentTekst('forside.skolepenger.innledning', intl)}</BodyShort>
        {hentHTMLTekst('forside.skolepenger.merInfoLenke', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.skolepenger.overskrift.riktigeOpplysninger', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.skolepenger.riktigeOpplysninger', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.skolepenger.meldeEndringer', intl)}</BodyShort>
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.skolepenger.overskrift.sendeDokumentasjon', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.skolepenger.beskjedDokumentere', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.skolepenger.merInformasjon', intl)}</BodyShort>
        {hentHTMLTekst('forside.skolepenger.dokumentasjonsOversiktLenke', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.skolepenger.overskrift.henteInformasjon', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.skolepenger.henteInformasjon', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.skolepenger.viHenter', intl)}</BodyShort>
        {hentHTMLTekst('forside.skolepenger.informasjonHentet', intl)}
        <BodyShort>{hentTekst('forside.skolepenger.tidligereOpplysninger', intl)}</BodyShort>
        {hentHTMLTekst('forside.skolepenger.personopplysningeneDineLenke', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.skolepenger.overskrift.slikSøkerDu', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.skolepenger.slikSøkerDu', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.skolepenger.lagringSøknad', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.skolepenger.manglerDuDokumentasjon', intl)}</BodyShort>
      </VStack>

      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.skolepenger.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />

      {harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
    </VStack>
  );
};

export default SkolepengerInformasjon;
