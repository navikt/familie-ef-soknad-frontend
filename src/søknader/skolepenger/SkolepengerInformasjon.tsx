import React from 'react';
import { InformasjonProps } from '../../components/forside/typer';
import { hentPath } from '../../utils/routing';
import { ERouteSkolepenger, RoutesSkolepenger } from './routing/routes';
import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { Overskrift } from '../../components/forside/Overskrift';
import { Seksjon } from '../../components/forside/Seksjon';
import { Tekst } from '../../components/forside/Tekst';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { hentHTMLTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export const SkolepengerInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const intl = useLokalIntlContext();
  const nesteSide = hentPath(RoutesSkolepenger, ERouteSkolepenger.OmDeg) || '';

  return (
    <>
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.skolepenger} />

      <Seksjon>
        <Tekst tekst="forside.skolepenger.innledning" />
        {hentHTMLTekst('forside.skolepenger.merInfoLenke', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.skolepenger.overskrift.riktigeOpplysninger" />
        <Tekst tekst="forside.skolepenger.riktigeOpplysninger" />
        <Tekst tekst="forside.skolepenger.meldeEndringer" />
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.skolepenger.overskrift.sendeDokumentasjon" />
        <Tekst tekst="forside.skolepenger.beskjedDokumentere" />
        <Tekst tekst="forside.skolepenger.merInformasjon" />
        {hentHTMLTekst('forside.skolepenger.dokumentasjonsOversiktLenke', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.skolepenger.overskrift.henteInformasjon" />
        <Tekst tekst="forside.skolepenger.henteInformasjon" />
        <Tekst tekst="forside.skolepenger.viHenter" />
        {hentHTMLTekst('forside.skolepenger.informasjonHentet', intl)}
        <Tekst tekst="forside.skolepenger.tidligereOpplysninger" />
        {hentHTMLTekst('forside.skolepenger.personopplysningeneDineLenke', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.skolepenger.overskrift.slikSøkerDu" />
        <Tekst tekst="forside.skolepenger.slikSøkerDu" />
        <Tekst tekst="forside.skolepenger.lagringSøknad" />
        <Tekst tekst="forside.skolepenger.manglerDuDokumentasjon" />
      </Seksjon>

      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.skolepenger.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />

      {harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
    </>
  );
};

export default SkolepengerInformasjon;
