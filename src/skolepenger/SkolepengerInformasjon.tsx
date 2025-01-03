import React from 'react';
import { InformasjonProps } from '../components/forside/typer';
import { hentPath } from '../utils/routing';
import { RoutesSkolepenger, ERouteSkolepenger } from './routing/routes';
import { DisclaimerBoks } from '../components/forside/DisclaimerBoks';
import { Overskrift } from '../components/forside/Overskrift';
import { Seksjon } from '../components/forside/Seksjon';
import { Tekst } from '../components/forside/Tekst';
import LocaleTekst from '../language/LocaleTekst';
import { KnappLocaleTekstOgNavigate } from '../components/knapper/KnappLocaleTekstOgNavigate';

export const SkolepengerInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const nesteSide = hentPath(RoutesSkolepenger, ERouteSkolepenger.OmDeg) || '';

  return (
    <>
      <Seksjon>
        <Tekst tekst="forside.skolepenger.innledning" />
        <LocaleTekst tekst="forside.skolepenger.merInfoLenke" />
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
        <LocaleTekst tekst="forside.skolepenger.dokumentasjonsOversiktLenke" />
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.skolepenger.overskrift.henteInformasjon" />
        <Tekst tekst="forside.skolepenger.henteInformasjon" />
        <Tekst tekst="forside.skolepenger.viHenter" />
        <LocaleTekst tekst="forside.skolepenger.informasjonHentet" />
        <Tekst tekst="forside.skolepenger.tidligereOpplysninger" />
        <LocaleTekst tekst="forside.skolepenger.personopplysningeneDineLenke" />
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
