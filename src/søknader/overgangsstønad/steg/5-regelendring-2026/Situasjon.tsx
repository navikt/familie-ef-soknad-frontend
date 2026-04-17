import React, { ReactNode, useEffect, useState } from 'react';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { hentRoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLocation } from 'react-router-dom';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { BodyShort, VStack } from '@navikt/ds-react';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import {
  ESøkerFraBestemtMåned,
  IDinSituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { EHarInntekt, EHvaSituasjon } from '../../../../models/steg/dinsituasjon/nyeSituasjonTyper';
import { hvaSituasjonSpm, harInntektSpm } from './SituasjonConfig';
import { SøkerFraBestemtMånedSpm } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål } from '../../../felles/steg/6-meromsituasjon/SituasjonUtil';

import { CheckboxSpørsmål } from '../../../../components/spørsmål/CheckboxSpørsmål';
import { BarnMedSærligeBehov } from '../../../felles/steg/6-meromsituasjon/BarnMedSærligeBehov';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { OmFirmaeneDine } from '../../../felles/steg/5-aktivitet/Firma/OmFirmaeneDine';
import { erSisteFirmaUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import { HarSøkerSagtOppEllerRedusertStilling } from '../6-meromsituasjon/HarSøkerSagtOppEllerRedusertStilling';
import NårSøkerDuStønadFra from '../../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { SøknadOvergangsstønad } from '../../models/søknad';
import { dagensDato, datoTilStreng, formatMånederTilbake } from '../../../../utils/dato';
import { useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov } from '../../../../utils/hooks';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import { hvisHarBarnMedSærligeTilsynFritekstUtfylt } from './SituasjonValidering';

export const Situasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
    mellomlagreOvergangsstønad,
    oppdaterBarnISøknaden,
  } = useOvergangsstønadSøknad();

  const [dinSituasjon, settDinSituasjon] = useState<IDinSituasjon>(søknad.merOmDinSituasjon);
  const [aktivitet, settAktivitet] = useState<IAktivitet>(søknad.aktivitet);

  const { hvaSituasjon, harInntekt, søkerFraBestemtMåned, søknadsdato } = dinSituasjon;

  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const datovelgerLabel = 'søkerFraBestemtMåned.datovelger.overgangsstønad';

  const hjelpetekstFørsteAvsnitt = hentTekstMedEnVariabel(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del1',
    intl,
    formatMånederTilbake(dagensDato, 3)
  );
  const hjelpetekstAndreAvsnitt = hentTekstMedEnVariabel(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del2',
    intl,
    formatMånederTilbake(dagensDato, 5)
  );
  const hjelpetekstTredjeAvsnitt = hentTekst(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del3',
    intl
  );
  const hjelpetekst: ReactNode = (
    <VStack gap={'space-16'}>
      <BodyShort>{hjelpetekstFørsteAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstAndreAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstTredjeAvsnitt}</BodyShort>
    </VStack>
  );

  useEffect(() => {
    settSøknad((prevSøknad: SøknadOvergangsstønad) => ({
      ...prevSøknad,
      merOmDinSituasjon: dinSituasjon,
      aktivitet: aktivitet,
    }));
  }, [dinSituasjon, aktivitet, settSøknad]);

  useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov(søknad, intl, oppdaterBarnISøknaden);

  const settHvaSituasjon = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);
    const nåværende = dinSituasjon.hvaSituasjon ?? {
      spørsmålid: spørsmål.søknadid,
      svarid: [],
      label: spørsmålTekst,
      verdi: [],
      alternativer: [],
    };

    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(nåværende, svarHuketAv, svar);

    const endretSituasjon: IDinSituasjon = {
      ...dinSituasjon,
      hvaSituasjon: {
        ...nåværende,
        svarid: svarider,
        verdi: avhukedeSvar,
      },
    };

    if (svarHuketAv && svarider.length === 0) {
      delete endretSituasjon.harInntekt;
      delete endretSituasjon.sagtOppEllerRedusertStilling;
      delete endretSituasjon.begrunnelseSagtOppEllerRedusertStilling;
      delete endretSituasjon.datoSagtOppEllerRedusertStilling;
      delete endretSituasjon.søkerFraBestemtMåned;
      delete endretSituasjon.søknadsdato;
    }

    settDinSituasjon(endretSituasjon);
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  const settHarInntekt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);
    const nåværende = dinSituasjon.harInntekt ?? {
      spørsmålid: spørsmål.søknadid,
      svarid: [],
      label: spørsmålTekst,
      verdi: [],
      alternativer: [],
    };

    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(nåværende, svarHuketAv, svar);

    const fjernetSelvstendig = svarHuketAv && svar.id === EHarInntekt.selvstendigNæringsdrivende;
    const fjernetAlleUnntattSelvstendig =
      svarHuketAv &&
      svar.id !== EHarInntekt.selvstendigNæringsdrivende &&
      !svarider.some((id) => id !== EHarInntekt.selvstendigNæringsdrivende);

    const endretSituasjon: IDinSituasjon = {
      ...dinSituasjon,
      harInntekt: {
        ...nåværende,
        svarid: svarider,
        verdi: avhukedeSvar,
      },
    };

    if (fjernetSelvstendig) {
      settAktivitet({ ...aktivitet, firmaer: undefined });
    }

    if (fjernetAlleUnntattSelvstendig) {
      delete endretSituasjon.sagtOppEllerRedusertStilling;
      delete endretSituasjon.begrunnelseSagtOppEllerRedusertStilling;
      delete endretSituasjon.datoSagtOppEllerRedusertStilling;
    }

    if (svarider.length === 0) {
      delete endretSituasjon.søkerFraBestemtMåned;
      delete endretSituasjon.søknadsdato;
    }

    settDinSituasjon(endretSituasjon);
  };

  const settSøkerFraBestemtMåned = (spørsmål: ISpørsmål, svar: ISvar) => {
    settDinSituasjon({
      ...dinSituasjon,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.id === ESøkerFraBestemtMåned.ja,
      },
      søknadsdato:
        svar.id === ESøkerFraBestemtMåned.neiNavKanVurdere ? undefined : dinSituasjon.søknadsdato,
    });
  };

  const settSøknadsdato = (dato: Date | null) => {
    dato !== null &&
      settDinSituasjon({
        ...dinSituasjon,
        søknadsdato: {
          label: hentTekst(datovelgerLabel, intl),
          verdi: datoTilStreng(dato),
        },
      });
  };

  const valgteSituasjoner = hvaSituasjon?.svarid ?? [];
  const harValgtMinstEttAlternativ = valgteSituasjoner.length > 0;

  const erBarnSærligTilsyn = valgteSituasjoner.includes(EHvaSituasjon.barnSærligTilsyn);
  const erBarnSykdomIkkeVarig = valgteSituasjoner.includes(EHvaSituasjon.barnSykdomIkkeVarig);

  const visSpørsmål2 =
    harValgtMinstEttAlternativ &&
    (!erBarnSærligTilsyn || hvisHarBarnMedSærligeTilsynFritekstUtfylt(søknad));

  const valgteInntekter = harInntekt?.svarid ?? [];
  const harValgtMinstEnInntekt = valgteInntekter.length > 0;
  const erSelvstendigNæringsdrivende = valgteInntekter.includes(
    EHarInntekt.selvstendigNæringsdrivende
  );
  const harValgtAnnetEnnSelvstendig = valgteInntekter.some(
    (id) => id !== EHarInntekt.selvstendigNæringsdrivende
  );

  const erFirmaUtfylt =
    erSelvstendigNæringsdrivende &&
    aktivitet.firmaer !== undefined &&
    aktivitet.firmaer.length > 0 &&
    erSisteFirmaUtfylt(aktivitet.firmaer);

  const erFirmaDelen = !erSelvstendigNæringsdrivende || erFirmaUtfylt;

  const visSpørsmål3 = harValgtMinstEnInntekt && harValgtAnnetEnnSelvstendig && erFirmaDelen;

  const erSagtOppBesvart = harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål(dinSituasjon);

  const erSagtOppDelen = !visSpørsmål3 || erSagtOppBesvart;

  const visSpørsmål4 = harValgtMinstEnInntekt && erFirmaDelen && erSagtOppDelen;

  const erAlleSpørsmålBesvart =
    visSpørsmål4 &&
    (søknadsdato?.verdi !== undefined ||
      søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.neiNavKanVurdere);

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={hentTekst('stegtittel.situasjonen', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      routesStønad={hentRoutesOvergangsstonad(true)}
      tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
    >
      <VStack gap={'space-64'}>
        {/* Spørsmål 1: Hva er situasjonen din? (flervalg) */}
        <CheckboxSpørsmål
          spørsmål={hvaSituasjonSpm(intl)}
          settValgteSvar={settHvaSituasjon}
          valgteSvar={hvaSituasjon?.verdi ?? []}
        />

        {erBarnSærligTilsyn && <BarnMedSærligeBehov />}

        {erBarnSykdomIkkeVarig && (
          <AlertStripeDokumentasjon>
            {hentHTMLTekst('dinSituasjon.alert.harSyktBarn', intl)}
          </AlertStripeDokumentasjon>
        )}

        {/* Spørsmål 2: Har du inntekt? (flervalg) */}
        {visSpørsmål2 && (
          <CheckboxSpørsmål
            spørsmål={harInntektSpm(intl)}
            settValgteSvar={settHarInntekt}
            valgteSvar={harInntekt?.verdi ?? []}
          />
        )}

        {erSelvstendigNæringsdrivende && (
          <OmFirmaeneDine
            arbeidssituasjon={aktivitet}
            settArbeidssituasjon={settAktivitet}
            overskuddsår={new Date().getFullYear() - 1}
          />
        )}

        {/* Spørsmål 3: Sagt opp eller redusert arbeidstid? */}
        {visSpørsmål3 && (
          <HarSøkerSagtOppEllerRedusertStilling
            dinSituasjon={dinSituasjon}
            settDinSituasjon={settDinSituasjon}
          />
        )}

        {/* Spørsmål 4: Søker du fra bestemt måned? */}
        {visSpørsmål4 && (
          <NårSøkerDuStønadFra
            spørsmål={SøkerFraBestemtMånedSpm(intl)}
            settSøkerFraBestemtMåned={settSøkerFraBestemtMåned}
            søkerFraBestemtMåned={dinSituasjon.søkerFraBestemtMåned}
            settDato={settSøknadsdato}
            valgtDato={dinSituasjon.søknadsdato}
            datovelgerLabel={datovelgerLabel}
            hjelpetekstInnholdTekst={hjelpetekst}
          />
        )}
      </VStack>
    </Side>
  );
};
