import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { CheckboxSpørsmål } from '../../../../components/spørsmål/CheckboxSpørsmål';
import { hvaErDinArbeidssituasjonSpm } from '../../../felles/steg/5-aktivitet/AktivitetConfig';
import { EAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import { filtrerAktivitetSvaralternativer, fjernAktivitet, } from '../../../../helpers/steg/aktivitet';
import { AktivitetOppfølgingSpørsmål } from '../../../felles/steg/5-aktivitet/AktivitetOppfølgingSpørsmål';
import { erAktivitetSeksjonFerdigUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { nullableStrengTilDato, nåværendeÅr } from '../../../../utils/dato';
import { useAktivitet } from './AktivitetContext';
import { VStack } from '@navikt/ds-react';

export const Aktivitet: React.FC = () => {
  const intl = useLokalIntlContext();

  const { aktivitet, settAktivitet, søknad, mellomlagreSteg, settDokumentasjonsbehov } =
    useAktivitet();

  const location = useLocation();

  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);

  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const { hvaErDinArbeidssituasjon } = aktivitet;

  const settArbeidssituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      hvaErDinArbeidssituasjon,
      svarHuketAv,
      svar
    );

    const endretArbeidssituasjon = fjernAktivitet(svarider, aktivitet);

    // bør løses bedre. Hvis "harFåttTilbudOmJobb" valget tas og senere fravelges må datofeltet for nyJobb slettes så det ikke sendes med i søknad.
    const skalDatoNyjobbNulstilles = svar.id === EAktivitet.harFåttJobbTilbud && svarHuketAv;

    settAktivitet({
      ...endretArbeidssituasjon,
      datoOppstartJobb: skalDatoNyjobbNulstilles
        ? undefined
        : endretArbeidssituasjon.datoOppstartJobb,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svarider,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: avhukedeSvar,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  const erAlleFelterUtfylt = hvaErDinArbeidssituasjon.svarid.every((id) =>
    erAktivitetSeksjonFerdigUtfylt(id, aktivitet)
  );

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    hvaErDinArbeidssituasjon.svarid.length !== 0 && erAlleFelterUtfylt;

  const erSpørsmålFørAktivitetBesvart = (svarid: string) => {
    const svaridPos = aktivitet.hvaErDinArbeidssituasjon.svarid.indexOf(svarid);

    return aktivitet.hvaErDinArbeidssituasjon.svarid
      .filter((aktivitetId, index) => aktivitetId && index < svaridPos)
      .every((id) => erAktivitetSeksjonFerdigUtfylt(id, aktivitet));
  };

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={hentTekst('stegtittel.arbeidssituasjon', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      mellomlagreStønad={mellomlagreSteg}
      routesStønad={RoutesOvergangsstonad}
      tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
    >
      <VStack gap={'24'}>
        <CheckboxSpørsmål
          spørsmål={filtrerAktivitetSvaralternativer(
            søknad.person,
            hvaErDinArbeidssituasjonSpm(intl)
          )}
          settValgteSvar={settArbeidssituasjonFelt}
          valgteSvar={hvaErDinArbeidssituasjon?.verdi}
        />

        {aktivitet.hvaErDinArbeidssituasjon.svarid.map((svarid, index) => {
          const harValgtMinstEnAktivitet = hvaErDinArbeidssituasjon.svarid.length !== 0;

          const erValgtFørsteAktivitet = hvaErDinArbeidssituasjon.svarid[0] === svarid;

          const visSeksjon = harValgtMinstEnAktivitet
            ? !erValgtFørsteAktivitet
              ? erSpørsmålFørAktivitetBesvart(svarid)
              : true
            : true;

          return (
            visSeksjon && (
              <AktivitetOppfølgingSpørsmål
                key={index}
                svarid={svarid}
                aktivitet={aktivitet}
                settAktivitet={settAktivitet}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
                overskuddsår={
                  nullableStrengTilDato(søknad.datoPåbegyntSøknad)?.getFullYear() || nåværendeÅr
                }
              />
            )
          );
        })}
      </VStack>
    </Side>
  );
};
