import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { erAktivitetSeksjonFerdigUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import { ErDuIArbeidSpm } from './AktivitetConfig';
import { EArbeidssituasjon, ErIArbeid } from '../../../../models/steg/aktivitet/aktivitet';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useAktivitet } from './AktivitetContext';
import { AktivitetSyk } from './AktivitetSyk';
import { AktivitetArbeid } from './AktivitetArbeid';

export const Aktivitet: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const { aktivitet, settAktivitet, settDokumentasjonsbehov, mellomlagreSteg } = useAktivitet();
  const { hvaErDinArbeidssituasjon, erIArbeid } = aktivitet;
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const settErDuIArbeid = (spørsmål: ISpørsmål, svar: ISvar) => {
    const endretArbeidssituasjon =
      svar.id === ErIArbeid.NeiFordiJegErSyk
        ? {
            ...aktivitet,
            egetAS: undefined,
            arbeidsforhold: undefined,
            firmaer: undefined,
            etablererEgenVirksomhet: undefined,
            hvaErDinArbeidssituasjon: {
              spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
              svarid: [],
              label: '',
              verdi: [],
              alternativer: aktivitet.hvaErDinArbeidssituasjon.alternativer,
            },
          }
        : aktivitet;

    settAktivitet({
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

  const erAlleFelterUtfylt = hvaErDinArbeidssituasjon?.svarid?.every((id) =>
    erAktivitetSeksjonFerdigUtfylt(id, aktivitet, false)
  );

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    (hvaErDinArbeidssituasjon?.svarid?.length !== 0 && erAlleFelterUtfylt) ||
    erIArbeid?.svarid === ErIArbeid.NeiFordiJegErSyk;

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={hentTekst('stegtittel.arbeidssituasjon.barnetilsyn', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreSteg}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <SeksjonGruppe aria-live="polite">
        <KomponentGruppe>
          <MultiSvarSpørsmål
            spørsmål={ErDuIArbeidSpm(intl)}
            settSpørsmålOgSvar={settErDuIArbeid}
            valgtSvar={aktivitet?.erIArbeid?.verdi}
          />
        </KomponentGruppe>
        {aktivitet.erIArbeid?.svarid === ErIArbeid.NeiFordiJegErSyk && <AktivitetSyk />}
        {aktivitet.erIArbeid?.svarid === ErIArbeid.JA && <AktivitetArbeid />}
      </SeksjonGruppe>
    </Side>
  );
};
