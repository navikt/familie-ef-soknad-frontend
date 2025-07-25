import React, { useEffect, useState } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import CheckboxSpørsmål from '../../../../components/spørsmål/CheckboxSpørsmål';
import { hvaErDinArbeidssituasjonSpm } from '../../../felles/steg/5-aktivitet/AktivitetConfig';
import { EAktivitet, IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/søknad';
import { useLocation } from 'react-router-dom';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import {
  filtrerAktivitetSvaralternativer,
  fjernAktivitet,
} from '../../../../helpers/steg/aktivitet';
import AktivitetOppfølgingSpørsmål from '../../../felles/steg/5-aktivitet/AktivitetOppfølgingSpørsmål';
import { erAktivitetSeksjonFerdigUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

import { logSidevisningOvergangsstonad } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { nullableStrengTilDato, nåværendeÅr } from '../../../../utils/dato';

const Aktivitet: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, settDokumentasjonsbehov, mellomlagreOvergangsstønad } =
    useOvergangsstønadSøknad();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const [arbeidssituasjon, settArbeidssituasjon] = useState<IAktivitet>({
    ...søknad.aktivitet,
    hvaErDinArbeidssituasjon: søknad.aktivitet.hvaErDinArbeidssituasjon,
  });
  const { hvaErDinArbeidssituasjon } = arbeidssituasjon;
  useEffect(() => {
    settSøknad({ ...søknad, aktivitet: arbeidssituasjon });
    // eslint-disable-next-line
  }, [arbeidssituasjon]);

  useMount(() => logSidevisningOvergangsstonad('Aktivitet'));

  const oppdaterArbeidssituasjon = (nyArbeidssituasjon: IAktivitet) => {
    settArbeidssituasjon({ ...arbeidssituasjon, ...nyArbeidssituasjon });
  };

  const settArbeidssituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      hvaErDinArbeidssituasjon,
      svarHuketAv,
      svar
    );

    const endretArbeidssituasjon = fjernAktivitet(svarider, arbeidssituasjon);

    // bør løses bedre. Hvis "harFåttTilbudOmJobb" valget tas og senere fravelges må datofeltet for nyJobb slettes så det ikke sendes med i søknad.
    const skalDatoNyjobbNulstilles = svar.id === EAktivitet.harFåttJobbTilbud && svarHuketAv;

    oppdaterArbeidssituasjon({
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
    erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon)
  );

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    hvaErDinArbeidssituasjon.svarid.length !== 0 && erAlleFelterUtfylt;

  const erSpørsmålFørAktivitetBesvart = (svarid: string, arbeidssituasjon: IAktivitet) => {
    const svaridPos = arbeidssituasjon.hvaErDinArbeidssituasjon.svarid.indexOf(svarid);
    return arbeidssituasjon.hvaErDinArbeidssituasjon.svarid
      .filter((aktivitet, index) => aktivitet && index < svaridPos)
      .every((id) => erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon));
  };

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={intl.formatMessage({ id: 'stegtittel.arbeidssituasjon' })}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      routesStønad={RoutesOvergangsstonad}
      tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
    >
      <SeksjonGruppe>
        <CheckboxSpørsmål
          spørsmål={filtrerAktivitetSvaralternativer(
            søknad.person,
            hvaErDinArbeidssituasjonSpm(intl)
          )}
          settValgteSvar={settArbeidssituasjonFelt}
          valgteSvar={hvaErDinArbeidssituasjon?.verdi}
          skalLogges={true}
        />
      </SeksjonGruppe>

      {arbeidssituasjon.hvaErDinArbeidssituasjon.svarid.map((svarid, index) => {
        const harValgtMinstEnAktivitet = hvaErDinArbeidssituasjon.svarid.length !== 0;

        const erValgtFørsteAktivitet = hvaErDinArbeidssituasjon.svarid[0] === svarid;

        const visSeksjon = harValgtMinstEnAktivitet
          ? !erValgtFørsteAktivitet
            ? erSpørsmålFørAktivitetBesvart(svarid, arbeidssituasjon)
            : true
          : true;

        return (
          visSeksjon && (
            <AktivitetOppfølgingSpørsmål
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
    </Side>
  );
};

export default Aktivitet;
