import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { Tekst } from '../../components/forside/Tekst';
import { Seksjon } from '../../components/forside/Seksjon';
import { Overskrift } from '../../components/forside/Overskrift';
import { InformasjonProps } from '../../components/forside/typer';
import { hentPath } from '../../utils/routing';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from './routing/routesOvergangsstonad';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import React from 'react';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import { hentHTMLTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export interface SistInnsendtSøknad {
  søknadsdato: string;
  stønadType: Stønadstype;
}

export const OvergangsstønadInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const intl = useLokalIntlContext();
  const nesteSide = hentPath(RoutesOvergangsstonad, ERouteOvergangsstønad.OmDeg) || '';

  return (
    <>
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.overgangsstønad} />
      <Seksjon>
        <Tekst tekst="forside.overgangsstønad.erDuEnsligMorEllerFar" />
        <Tekst tekst="forside.overgangsstønad.sammeSøknad" />
        {hentHTMLTekst('forside.overgangsstønad.merOmOvergangsstønad', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.overgangsstønad.overskrift.riktigeOpplysninger" />
        <Tekst tekst="forside.overgangsstønad.riktigeOpplysninger" />
        <Tekst tekst="forside.overgangsstønad.meldeEndringer" />
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.overgangsstønad.overskrift.sendeDokumentasjon" />
        <Tekst tekst="forside.overgangsstønad.beskjedDokumentere" />
        <Tekst tekst="forside.overgangsstønad.merInformasjon" />
        {hentHTMLTekst('forside.overgangsstønad.oversiktDokumentasjon', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.overgangsstønad.overskrift.henteInformasjon" />
        <Tekst tekst="forside.overgangsstønad.henteInformasjon" />
        <Tekst tekst="forside.overgangsstønad.viHenter" />
        {hentHTMLTekst('forside.overgangsstønad.henterPunktliste', intl)}
        <Tekst tekst="forside.overgangsstønad.tidligereOpplysninger" />
        {hentHTMLTekst('forside.overgangsstønad.personopplysningeneDine', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.overgangsstønad.overskrift.slikSøkerDu" />
        <Tekst tekst="forside.overgangsstønad.slikSøkerDu" />
        <Tekst tekst="forside.overgangsstønad.viLagrerSøknadenDin" />
        <Tekst tekst="forside.overgangsstønad.manglerDuDokumentasjon" />
      </Seksjon>

      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.overgangsstønad.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />

      {harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
    </>
  );
};
