import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
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
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';

export const BarnetilsynInformasjon: React.FC<InformasjonProps> = ({
  person,
  harBekreftet,
  settBekreftelse,
}) => {
  const [kanGjenbrukeForrigeSøknad, settKanGjenbrukeForrigeSøknad] = useState(false);
  const { settSkalGjenbrukeSøknad } = useContext(GjenbrukContext);
  const [locale] = useSpråkContext();
  const intl = useLokalIntlContext();

  const { toggles } = useToggles();
  const gjenbrukBarnetilsynToggle = toggles[ToggleName.gjenbrukBarnetilsyn];

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
    if (!gjenbrukBarnetilsynToggle) {
      return;
    }

    const fetchHentOgSjekkForrigeSøknad = async () => {
      await hentOgSjekkForrigeSøknad();
    };

    fetchHentOgSjekkForrigeSøknad();
  }, [locale]);

  const nesteSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.OmDeg) || '';
  const gjenbrukSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Gjenbruk) || '';

  return (
    <VStack gap={'space-40'} align={'center'}>
      <TidligereInnsendteSøknaderAlert stønadType={Stønadstype.barnetilsyn} />
      <VStack gap={'space-12'}>
        <BodyShort>{hentTekst('forside.barnetilsyn.info', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.fåStønadSkoleår', intl)}</BodyShort>
        {hentHTMLTekst('forside.barnetilsyn.merOmStønad', intl)}
      </VStack>
      <VStack gap={'space-12'}>
        {hentHTMLTekst('forside.barnetilsyn.arbeidssøkerUtdanning', intl)}
      </VStack>
      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.barnetilsyn.overskrift.riktigeOpplysninger', intl)}{' '}
        </Heading>
        <BodyShort>{hentTekst('forside.barnetilsyn.riktigeOpplysninger', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.meldeEndringer', intl)}</BodyShort>
      </VStack>
      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.barnetilsyn.overskrift.sendeDokumentasjon', intl)}{' '}
        </Heading>
        <BodyShort>{hentTekst('forside.barnetilsyn.beskjedDokumentere', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.merInformasjon', intl)}</BodyShort>
        {hentHTMLTekst('forside.barnetilsyn.oversiktDokumentasjon', intl)}
      </VStack>
      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.barnetilsyn.overskrift.henteInformasjon', intl)}{' '}
        </Heading>
        <BodyShort>{hentTekst('forside.barnetilsyn.henteInformasjon', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.viHenter', intl)}</BodyShort>
        {hentHTMLTekst('forside.barnetilsyn.henterPunktliste', intl)}
        <BodyShort>{hentTekst('forside.barnetilsyn.tidligereOpplysninger', intl)}</BodyShort>
        {hentHTMLTekst('forside.barnetilsyn.personopplysningeneDine', intl)}
      </VStack>
      <VStack gap={'space-12'}>
        <Heading level="2" size="small">
          {hentTekst('forside.barnetilsyn.overskrift.slikSøkerDu', intl)}{' '}
        </Heading>
        <BodyShort>{hentTekst('forside.barnetilsyn.slikSøkerDu', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.slikSøkerDu2', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.slikSøkerDu3', intl)}</BodyShort>
        <BodyShort>{hentTekst('forside.barnetilsyn.slikSøkerDu4', intl)}</BodyShort>
      </VStack>
      <DisclaimerBoks
        navn={person.søker.forkortetNavn}
        tekst={'forside.barnetilsyn.disclaimerTekst'}
        harBekreftet={harBekreftet}
        settBekreftelse={settBekreftelse}
      />
      {harBekreftet && (
        <KnappLocaleTekstOgNavigate
          nesteSide={
            gjenbrukBarnetilsynToggle && kanGjenbrukeForrigeSøknad ? gjenbrukSide : nesteSide
          }
        />
      )}
    </VStack>
  );
};
