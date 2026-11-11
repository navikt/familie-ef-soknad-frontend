import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import type { InformasjonProps } from '../../components/forside/typer';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { hentPath } from '../../utils/routing';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from './routing/routesOvergangsstonad';
import { VarselRegelendring2026 } from './VarselRegelendring2026';

export const OvergangsstønadInformasjon: React.FC<InformasjonProps> = ({ person, harBekreftet, settBekreftelse }) => {
    const intl = useLokalIntlContext();
    const nesteSide = hentPath(RoutesOvergangsstonad, ERouteOvergangsstønad.OmDeg) || '';

    return (
        <VStack gap={'space-40'} align={'center'}>
            <VarselRegelendring2026 stønadstype={Stønadstype.overgangsstønad} />
            <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.overgangsstønad} />
            <VStack gap={'space-12'}>
                <BodyShort>
                    {hentTekst('forside.overgangsstønad.erDuEnsligMorEllerFar.regelendringer2026', intl)}
                </BodyShort>
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
