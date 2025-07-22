import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { Tekst } from '../../components/forside/Tekst';
import { Seksjon } from '../../components/forside/Seksjon';
import { Overskrift } from '../../components/forside/Overskrift';
import { InformasjonProps } from '../../components/forside/typer';
import { hentPath } from '../../utils/routing';
import { ERouteBarnetilsyn, RoutesBarnetilsyn } from './routing/routesBarnetilsyn';
import { hentDataFraForrigeBarnetilsynSøknad } from '../../utils/søknad';
import React, { useContext, useEffect, useState } from 'react';
import { GjenbrukContext } from '../../context/GjenbrukContext';
import { useSpråkContext } from '../../context/SpråkContext';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { ForrigeSøknad } from './models/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { TidligereInnsendteSøknaderAlert } from '../../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { hentTekst } from '../../utils/teksthåndtering';

export const BarnetilsynInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const [kanGjenbrukeForrigeSøknad, settKanGjenbrukeForrigeSøknad] = useState(false);
  const { settSkalGjenbrukeSøknad } = useContext(GjenbrukContext);
  const [locale] = useSpråkContext();
  const intl = useLokalIntlContext();

  const finnesForrigeSøknadOgErBesvartPåSammeSpråkSomErValgt = (forrigeSøknad?: ForrigeSøknad) => {
    if (forrigeSøknad) {
      return (
        forrigeSøknad.sivilstatus?.årsakEnslig?.label ===
        hentTekst('sivilstatus.spm.begrunnelse', intl)
      );
    }
    return false;
  };

  const hentOgSjekkForrigeSøknad = async () => {
    const forrigeSøknad = await hentDataFraForrigeBarnetilsynSøknad();

    if (finnesForrigeSøknadOgErBesvartPåSammeSpråkSomErValgt(forrigeSøknad)) {
      settKanGjenbrukeForrigeSøknad(true);
    } else {
      settKanGjenbrukeForrigeSøknad(false);
      settSkalGjenbrukeSøknad(false);
    }
  };

  useEffect(() => {
    const fetchHentOgSjekkForrigeSøknad = async () => {
      await hentOgSjekkForrigeSøknad();
    };

    fetchHentOgSjekkForrigeSøknad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const nesteSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.OmDeg) || '';
  const gjenbrukSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Gjenbruk) || '';

  return (
    <>
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.barnetilsyn} />

      <Seksjon>
        <Tekst tekst="forside.barnetilsyn.info" />
        <Tekst tekst="forside.barnetilsyn.fåStønadSkoleår" />
        {hentTekst('forside.barnetilsyn.merOmStønad', intl)}
      </Seksjon>

      <Seksjon>{hentTekst('forside.barnetilsyn.arbeidssøkerUtdanning', intl)}</Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.barnetilsyn.overskrift.riktigeOpplysninger" />
        <Tekst tekst="forside.barnetilsyn.riktigeOpplysninger" />
        <Tekst tekst="forside.barnetilsyn.meldeEndringer" />
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.barnetilsyn.overskrift.sendeDokumentasjon" />
        <Tekst tekst="forside.barnetilsyn.beskjedDokumentere" />
        <Tekst tekst="forside.barnetilsyn.merInformasjon" />
        {hentTekst('forside.barnetilsyn.oversiktDokumentasjon', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.barnetilsyn.overskrift.henteInformasjon" />
        <Tekst tekst="forside.barnetilsyn.henteInformasjon" />
        <Tekst tekst="forside.barnetilsyn.viHenter" />
        {hentTekst('forside.barnetilsyn.henterPunktliste', intl)}
        <Tekst tekst="forside.barnetilsyn.tidligereOpplysninger" />
        {hentTekst('forside.barnetilsyn.personopplysningeneDine', intl)}
      </Seksjon>

      <Seksjon>
        <Overskrift tekst="forside.barnetilsyn.overskrift.slikSøkerDu" />
        <Tekst tekst="forside.barnetilsyn.slikSøkerDu" />
        <Tekst tekst="forside.barnetilsyn.slikSøkerDu2" />
        <Tekst tekst="forside.barnetilsyn.slikSøkerDu3" />
        <Tekst tekst="forside.barnetilsyn.slikSøkerDu4" />
      </Seksjon>

      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.barnetilsyn.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />
      {harBekreftet && (
        <KnappLocaleTekstOgNavigate
          nesteSide={kanGjenbrukeForrigeSøknad ? gjenbrukSide : nesteSide}
        />
      )}
    </>
  );
};
