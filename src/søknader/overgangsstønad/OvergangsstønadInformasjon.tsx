import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { InformasjonProps } from '../../components/forside/typer';
import { hentPath } from '../../utils/routing';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from './routing/routesOvergangsstonad';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import React from 'react';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { VarselRegelendring2026 } from './VarselRegelendring2026';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';

export const OvergangsstønadInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const intl = useLokalIntlContext();
  const { toggles } = useToggles();
  const visRegelendring2026Varsel = toggles[ToggleName.overgangsstønadRegelendringer2026];
  const nesteSide = hentPath(RoutesOvergangsstonad, ERouteOvergangsstønad.OmDeg) || '';

  const førsteavsnitt = visRegelendring2026Varsel
    ? hentTekst('forside.overgangsstønad.erDuEnsligMorEllerFar.regelendringer2026', intl)
    : hentTekst('forside.overgangsstønad.erDuEnsligMorEllerFar', intl);

  return (
    <VStack gap={'space-40'} align={'center'}>
      {visRegelendring2026Varsel && (
        <VarselRegelendring2026 stønadstype={Stønadstype.overgangsstønad} />
      )}
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.overgangsstønad} />
      <VStack gap={'space-12'}>
        <BodyShort>{førsteavsnitt}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.sammeSøknad', intl)}</BodyShort>
        {hentHTMLTekst('forside.overgangsstønad.merOmOvergangsstønad', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.overgangsstønad.overskrift.riktigeOpplysninger', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.overgangsstønad.riktigeOpplysninger', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.meldeEndringer', intl)}</BodyShort>
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.overgangsstønad.overskrift.sendeDokumentasjon', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.overgangsstønad.beskjedDokumentere', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.merInformasjon', intl)}</BodyShort>
        {hentHTMLTekst('forside.overgangsstønad.oversiktDokumentasjon', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.overgangsstønad.overskrift.henteInformasjon', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.overgangsstønad.henteInformasjon', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.viHenter', intl)}</BodyShort>
        {hentHTMLTekst('forside.overgangsstønad.henterPunktliste', intl)}
        <BodyShort>{hentTekst('forside.overgangsstønad.tidligereOpplysninger', intl)}</BodyShort>
        {hentHTMLTekst('forside.overgangsstønad.personopplysningeneDine', intl)}
      </VStack>

      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.overgangsstønad.overskrift.slikSøkerDu', intl)}
        </Heading>
        <BodyShort>{hentTekst('forside.overgangsstønad.slikSøkerDu', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.viLagrerSøknadenDin', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.overgangsstønad.manglerDuDokumentasjon', intl)}</BodyShort>
      </VStack>

      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.overgangsstønad.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />

      {harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
    </VStack>
  );
};
