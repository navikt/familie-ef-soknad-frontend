import React, { ReactNode, useEffect, useState } from 'react';
import CheckboxSpørsmål from '../../../../components/spørsmål/CheckboxSpørsmål';
import HarSøkerSagtOppEllerRedusertStilling from './HarSøkerSagtOppEllerRedusertStilling';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';

import {
  gjelderNoeAvDetteDeg,
  SøkerFraBestemtMånedSpm,
} from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import {
  ESøkerFraBestemtMåned,
  IDinSituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import {
  harSøkerMindreEnnHalvStilling,
  harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål,
  hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst,
} from '../../../felles/steg/6-meromsituasjon/SituasjonUtil';
import { useLocation } from 'react-router-dom';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import SituasjonOppfølgingSpørsmål from '../../../felles/steg/6-meromsituasjon/SituasjonOppfølgingSpørsmål';
import NårSøkerDuStønadFra from '../../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { dagensDato, datoTilStreng, formatMånederTilbake } from '../../../../utils/dato';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { SøknadOvergangsstønad } from '../../models/søknad';
import { logSidevisningOvergangsstonad } from '../../../../utils/amplitude';
import {
  useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov,
  useMount,
} from '../../../../utils/hooks';
import styled from 'styled-components';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { BodyShort } from '@navikt/ds-react';

const StyledHjelpetekst = styled.div`
  .navds-body-short {
    padding-bottom: 1rem;
  }
`;
const MerOmDinSituasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
    mellomlagreOvergangsstønad,
    oppdaterBarnISøknaden,
  } = useOvergangsstønadSøknad();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const [dinSituasjon, settDinSituasjon] = useState<IDinSituasjon>(søknad.merOmDinSituasjon);
  const { gjelderDetteDeg, søknadsdato, søkerFraBestemtMåned } = dinSituasjon;
  const søkerJobberMindreEnnFemtiProsent = harSøkerMindreEnnHalvStilling(søknad);

  useMount(() => logSidevisningOvergangsstonad('MerOmDinSituasjon'));

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
    <StyledHjelpetekst>
      <BodyShort>{hjelpetekstFørsteAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstAndreAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstTredjeAvsnitt}</BodyShort>
    </StyledHjelpetekst>
  );

  useEffect(() => {
    settSøknad((prevSøknad: SøknadOvergangsstønad) => ({
      ...prevSøknad,
      merOmDinSituasjon: dinSituasjon,
    }));
  }, [dinSituasjon, settSøknad]);

  useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov(søknad, intl, oppdaterBarnISøknaden);

  const settDinSituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      dinSituasjon.gjelderDetteDeg,
      svarHuketAv,
      svar
    );

    settDinSituasjon({
      ...dinSituasjon,
      gjelderDetteDeg: {
        spørsmålid: spørsmål.søknadid,
        svarid: svarider,
        label: spørsmålTekst,
        verdi: avhukedeSvar,
        alternativer: dinSituasjon.gjelderDetteDeg.alternativer,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
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

  const harValgtMinstEttAlternativ = gjelderDetteDeg.svarid.length !== 0;

  const visNårSøkerDuStønadFra = søkerJobberMindreEnnFemtiProsent
    ? harValgtMinstEttAlternativ &&
      harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål(dinSituasjon) &&
      hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad)
    : harValgtMinstEttAlternativ && hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad);

  const erAlleSpørsmålBesvart =
    søknadsdato?.verdi !== undefined ||
    søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.neiNavKanVurdere;

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={intl.formatMessage({ id: 'stegtittel.dinSituasjon' })}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      routesStønad={RoutesOvergangsstonad}
      tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
    >
      <SeksjonGruppe>
        <KomponentGruppe>
          <CheckboxSpørsmål
            spørsmål={gjelderNoeAvDetteDeg(intl)}
            settValgteSvar={settDinSituasjonFelt}
            valgteSvar={søknad.merOmDinSituasjon.gjelderDetteDeg.verdi}
            skalLogges={true}
          />
        </KomponentGruppe>
        {dinSituasjon.gjelderDetteDeg.svarid.map((svarid, index) => {
          const harValgtMinstEttAlternativ = gjelderDetteDeg.svarid.length !== 0;

          return (
            harValgtMinstEttAlternativ && (
              <SituasjonOppfølgingSpørsmål key={index} svarid={svarid} />
            )
          );
        })}
      </SeksjonGruppe>
      {søkerJobberMindreEnnFemtiProsent &&
        harValgtMinstEttAlternativ &&
        hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad) && (
          <SeksjonGruppe>
            <HarSøkerSagtOppEllerRedusertStilling
              dinSituasjon={dinSituasjon}
              settDinSituasjon={settDinSituasjon}
            />
          </SeksjonGruppe>
        )}
      {visNårSøkerDuStønadFra && (
        <SeksjonGruppe>
          <NårSøkerDuStønadFra
            spørsmål={SøkerFraBestemtMånedSpm(intl)}
            settSøkerFraBestemtMåned={settSøkerFraBestemtMåned}
            søkerFraBestemtMåned={dinSituasjon.søkerFraBestemtMåned}
            settDato={settSøknadsdato}
            valgtDato={dinSituasjon.søknadsdato}
            datovelgerLabel={datovelgerLabel}
            hjelpetekstInnholdTekst={hjelpetekst}
          />
        </SeksjonGruppe>
      )}
    </Side>
  );
};

export default MerOmDinSituasjon;
