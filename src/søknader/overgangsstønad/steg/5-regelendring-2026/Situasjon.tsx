import React, { useEffect, useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { hentRoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLocation } from 'react-router-dom';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { Alert, VStack } from '@navikt/ds-react';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import {
  ESøkerFraBestemtMåned,
  IDinSituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { InntekterId, HvaSituasjon } from '../../../../models/steg/dinsituasjon/situasjonTyper';
import { hvaSituasjonSpm, inntekterSpm } from './SituasjonConfig';
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
import { datoTilStreng, nullableStrengTilDato, nåværendeÅr } from '../../../../utils/dato';
import { useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov } from '../../../../utils/hooks';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import { hvisHarBarnMedSærligeTilsynFritekstUtfylt } from './SituasjonValidering';
import { HjelpetekstSøkerFraBestemtMåned } from '../6-meromsituasjon/HjelpetekstSøkerFraBestemtMåned';
HjelpetekstSøkerFraBestemtMåned;

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

  const { hvaSituasjon, inntekter, søkerFraBestemtMåned, søknadsdato } = dinSituasjon;

  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const datovelgerLabel = 'søkerFraBestemtMåned.datovelger.overgangsstønad';

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
      delete endretSituasjon.inntekter;
      delete endretSituasjon.sagtOppEllerRedusertStilling;
      delete endretSituasjon.begrunnelseSagtOppEllerRedusertStilling;
      delete endretSituasjon.datoSagtOppEllerRedusertStilling;
      delete endretSituasjon.søkerFraBestemtMåned;
      delete endretSituasjon.søknadsdato;
    }

    settDinSituasjon(endretSituasjon);
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  const settInntekter = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);
    const nåværende = dinSituasjon.inntekter ?? {
      spørsmålid: spørsmål.søknadid,
      svarid: [],
      label: spørsmålTekst,
      verdi: [],
      alternativer: [],
    };

    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(nåværende, svarHuketAv, svar);

    const fjernetSelvstendig = svarHuketAv && svar.id === InntekterId.selvstendigNæringsdrivende;
    const fjernetAlleUnntattSelvstendig =
      svarHuketAv &&
      svar.id !== InntekterId.selvstendigNæringsdrivende &&
      !svarider.some((id) => id !== InntekterId.selvstendigNæringsdrivende);

    const endretSituasjon: IDinSituasjon = {
      ...dinSituasjon,
      inntekter: {
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
  const harKunValgtIngenAvDisseGjelderMeg =
    valgteSituasjoner.length === 1 && valgteSituasjoner[0] === HvaSituasjon.ingenAvDisseGjelderMeg;

  const erBarnSærligTilsyn = valgteSituasjoner.includes(HvaSituasjon.barnSærligTilsyn);
  const erBarnSykdomIkkeVarig = valgteSituasjoner.includes(HvaSituasjon.barnSykdomIkkeVarig);

  const visSpørsmålInntekter =
    harValgtMinstEttAlternativ &&
    (!erBarnSærligTilsyn || hvisHarBarnMedSærligeTilsynFritekstUtfylt(søknad));

  const valgteInntekter = inntekter?.svarid ?? [];
  const harValgtMinstEnInntekt = valgteInntekter.length > 0;
  const erSelvstendigNæringsdrivende = valgteInntekter.includes(
    InntekterId.selvstendigNæringsdrivende
  );
  const harValgtAnnetEnnSelvstendig = valgteInntekter.some(
    (id) => id !== InntekterId.selvstendigNæringsdrivende
  );

  const erFirmaUtfylt =
    erSelvstendigNæringsdrivende &&
    aktivitet.firmaer !== undefined &&
    aktivitet.firmaer.length > 0 &&
    erSisteFirmaUtfylt(aktivitet.firmaer);

  const kanGåVidereFraFirma = !erSelvstendigNæringsdrivende || erFirmaUtfylt;

  const visSpørsmålHarSagtOpp =
    harValgtMinstEnInntekt && harValgtAnnetEnnSelvstendig && kanGåVidereFraFirma;

  const erSagtOppBesvart = harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål(dinSituasjon);

  const kanGåVidereFraSagtOpp = !visSpørsmålHarSagtOpp || erSagtOppBesvart;

  const visSpørsmålNårSøkerDuFra =
    harValgtMinstEnInntekt && kanGåVidereFraFirma && kanGåVidereFraSagtOpp;

  const erAlleSpørsmålBesvart =
    visSpørsmålNårSøkerDuFra &&
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

        {harKunValgtIngenAvDisseGjelderMeg && (
          <Alert variant={'warning'} size={'small'} inline>
            {hentTekst('nySituasjon.alert-advarsel.ingenAvDisseGjelderMeg', intl)}
          </Alert>
        )}

        {visSpørsmålInntekter && (
          <CheckboxSpørsmål
            spørsmål={inntekterSpm(intl)}
            settValgteSvar={settInntekter}
            valgteSvar={inntekter?.verdi ?? []}
          />
        )}

        {erSelvstendigNæringsdrivende && (
          <OmFirmaeneDine
            arbeidssituasjon={aktivitet}
            settArbeidssituasjon={settAktivitet}
            overskuddsår={
              nullableStrengTilDato(søknad.datoPåbegyntSøknad)?.getFullYear() || nåværendeÅr
            }
          />
        )}

        {visSpørsmålHarSagtOpp && (
          <HarSøkerSagtOppEllerRedusertStilling
            dinSituasjon={dinSituasjon}
            settDinSituasjon={settDinSituasjon}
          />
        )}

        {visSpørsmålNårSøkerDuFra && (
          <NårSøkerDuStønadFra
            spørsmål={SøkerFraBestemtMånedSpm(intl)}
            settSøkerFraBestemtMåned={settSøkerFraBestemtMåned}
            søkerFraBestemtMåned={dinSituasjon.søkerFraBestemtMåned}
            settDato={settSøknadsdato}
            valgtDato={dinSituasjon.søknadsdato}
            datovelgerLabel={datovelgerLabel}
            hjelpetekstInnholdTekst={<HjelpetekstSøkerFraBestemtMåned />}
          />
        )}
      </VStack>
    </Side>
  );
};
