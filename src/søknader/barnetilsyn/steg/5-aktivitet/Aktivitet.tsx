import React, { useEffect, useState } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { CheckboxSpørsmål } from '../../../../components/spørsmål/CheckboxSpørsmål';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import {
  filtrerAktivitetSvaralternativer,
  fjernAktivitet,
} from '../../../../helpers/steg/aktivitet';
import { erAktivitetSeksjonFerdigUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { ErDuIArbeidSpm, hvaErDinArbeidssituasjonSpm } from './AktivitetConfig';
import AktivitetOppfølgingSpørsmål from './AktivitetOppfølgingSpørsmål';
import {
  EArbeidssituasjon,
  ErIArbeid,
  IAktivitet,
} from '../../../../models/steg/aktivitet/aktivitet';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { Alert, Label } from '@navikt/ds-react';
import { nullableStrengTilDato, nåværendeÅr } from '../../../../utils/dato';

const Aktivitet: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, settDokumentasjonsbehov, mellomlagreBarnetilsyn } =
    useBarnetilsynSøknad();
  const location = useLocation();
  const [arbeidssituasjon, settArbeidssituasjon] = useState<IAktivitet>(søknad?.aktivitet);
  const { hvaErDinArbeidssituasjon, erIArbeid } = arbeidssituasjon;
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;
  useEffect(() => {
    settSøknad({ ...søknad, aktivitet: arbeidssituasjon });
    // eslint-disable-next-line
  }, [arbeidssituasjon]);

  const oppdaterArbeidssituasjon = (nyArbeidssituasjon: IAktivitet) => {
    settArbeidssituasjon({ ...arbeidssituasjon, ...nyArbeidssituasjon });
  };

  const settErDuIArbeid = (spørsmål: ISpørsmål, svar: ISvar) => {
    let endretArbeidssituasjon = arbeidssituasjon;

    if (svar.id === ErIArbeid.NeiFordiJegErSyk) {
      delete endretArbeidssituasjon.egetAS;
      delete endretArbeidssituasjon.arbeidsforhold;
      delete endretArbeidssituasjon.firmaer;
      delete endretArbeidssituasjon.etablererEgenVirksomhet;

      endretArbeidssituasjon = {
        ...endretArbeidssituasjon,
        hvaErDinArbeidssituasjon: {
          spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
          svarid: [],
          label: '',
          verdi: [],
          alternativer: endretArbeidssituasjon.hvaErDinArbeidssituasjon.alternativer,
        },
      };
    }
    oppdaterArbeidssituasjon({
      ...endretArbeidssituasjon,
      erIArbeid: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar);
  };

  const settArbeidssituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      hvaErDinArbeidssituasjon,
      svarHuketAv,
      svar
    );

    const endretArbeidssituasjon = fjernAktivitet(svarider, arbeidssituasjon);

    oppdaterArbeidssituasjon({
      ...endretArbeidssituasjon,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svarider,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: avhukedeSvar,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  const erAlleFelterUtfylt = hvaErDinArbeidssituasjon?.svarid?.every((id) =>
    erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon, false)
  );

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    (hvaErDinArbeidssituasjon?.svarid?.length !== 0 && erAlleFelterUtfylt) ||
    erIArbeid?.svarid === ErIArbeid.NeiFordiJegErSyk;

  const erSpørsmålFørAktivitetBesvart = (svarid: string, arbeidssituasjon: IAktivitet) => {
    const svaridPos = arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid.indexOf(svarid);
    return (
      svaridPos &&
      arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid
        .filter((aktivitet, index) => aktivitet && index < svaridPos)
        .every((id) => erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon, false))
    );
  };

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={hentTekst('stegtittel.arbeidssituasjon.barnetilsyn', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <SeksjonGruppe aria-live="polite">
        <KomponentGruppe>
          <MultiSvarSpørsmål
            spørsmål={ErDuIArbeidSpm(intl)}
            settSpørsmålOgSvar={settErDuIArbeid}
            valgtSvar={arbeidssituasjon?.erIArbeid?.verdi}
          />
        </KomponentGruppe>
        {arbeidssituasjon.erIArbeid?.svarid === ErIArbeid.NeiFordiJegErSyk && (
          <>
            <Alert variant={'info'} inline>
              <Label as="p">{hentHTMLTekst('erDuIArbeid.alertsstripe-info', intl)}</Label>
            </Alert>
            <AlertStripeDokumentasjon>
              {hentHTMLTekst('erDuIArbeid.alertsstripe-dokumentasjon', intl)}
            </AlertStripeDokumentasjon>
          </>
        )}
        {arbeidssituasjon.erIArbeid?.svarid === ErIArbeid.JA && (
          <KomponentGruppe>
            <CheckboxSpørsmål
              spørsmål={filtrerAktivitetSvaralternativer(
                søknad.person,
                hvaErDinArbeidssituasjonSpm(intl)
              )}
              settValgteSvar={settArbeidssituasjonFelt}
              valgteSvar={hvaErDinArbeidssituasjon?.verdi ? hvaErDinArbeidssituasjon?.verdi : []}
            />
          </KomponentGruppe>
        )}

        {arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid?.map((svarid, index) => {
          const harValgtMinstEnAktivitet = hvaErDinArbeidssituasjon?.svarid.length !== 0;

          const erValgtFørsteAktivitet = hvaErDinArbeidssituasjon?.svarid[0] === svarid;

          const visSeksjon = harValgtMinstEnAktivitet
            ? !erValgtFørsteAktivitet
              ? erSpørsmålFørAktivitetBesvart(svarid, arbeidssituasjon)
              : true
            : true;

          return (
            visSeksjon && (
              <AktivitetOppfølgingSpørsmål
                aria-live="polite"
                key={index}
                svarid={svarid}
                arbeidssituasjon={arbeidssituasjon}
                settArbeidssituasjon={settArbeidssituasjon}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
                overskuddsår={
                  nullableStrengTilDato(søknad.datoPåbegyntSøknad)?.getFullYear() || nåværendeÅr
                }
              />
            )
          );
        })}
      </SeksjonGruppe>
    </Side>
  );
};

export default Aktivitet;
