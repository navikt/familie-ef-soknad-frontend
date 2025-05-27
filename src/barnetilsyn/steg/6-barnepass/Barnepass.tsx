import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import NårSøkerDuStønadFra from '../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { hentTekst } from '../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import { ESøkerFraBestemtMåned } from '../../../models/steg/dinsituasjon/meromsituasjon';
import { SøkerDuStønadFraBestemtMndSpm } from './BarnepassConfig';
import { IBarnepass } from '../../models/barnepass';
import BarnepassOrdninger from './BarnepassOrdninger';
import ÅrsakBarnepass from './ÅrsakBarnepass';
import BarneHeader from '../../../components/BarneHeader';
import {
  erBarnepassForAlleBarnUtfylt,
  erBarnepassForBarnFørNåværendeUtfylt,
  erBarnepassStegFerdigUtfylt,
  erÅrsakBarnepassSpmBesvart,
  harBarnAvsluttetFjerdeKlasse,
  skalDokumentereTidligereFakturaer,
} from './hjelper';
import Side, { ESide } from '../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { hentPathBarnetilsynOppsummering } from '../../utils';
import { useLocation } from 'react-router';
import { Stønadstype } from '../../../models/søknad/stønadstyper';

import { logSidevisningBarnetilsyn } from '../../../utils/amplitude';
import { useMount } from '../../../utils/hooks';
import { IBarn } from '../../../models/steg/barn';
import { SøknadBarnetilsyn } from '../../models/søknad';
import {
  dagensDato,
  datoTilStreng,
  formatMånederTilbake,
} from '../../../utils/dato';
import { kommerFraOppsummeringen } from '../../../utils/locationState';
import { hentBeskjedMedNavn } from '../../../utils/språk';
import { BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';

const StyledHjelpetekst = styled.div`
  .navds-body-short {
    padding-bottom: 1rem;
  }
`;
const Barnepass: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    settSøknad,
    mellomlagreBarnetilsyn,
    settDokumentasjonsbehovForBarn,
  } = useBarnetilsynSøknad();
  const { søknadsdato, søkerFraBestemtMåned } = søknad;
  const barnSomSkalHaBarnepass = søknad.person.barn.filter(
    (barn: IBarn) => barn.skalHaBarnepass?.verdi
  );

  const datovelgerLabel = 'søkerStønadFraBestemtMnd.datovelger.barnepass';

  const hjelpetekstInnholdSøkerFraMndTekstDel1 = hentBeskjedMedNavn(
    formatMånederTilbake(dagensDato, 3),
    hentTekst('søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del1', intl)
  );

  const hjelpetekstInnholdSøkerFraMndTekstDel2 = hentTekst(
    'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del2',
    intl
  );

  useMount(() => logSidevisningBarnetilsyn('Barnepass'));

  const settBarnepass = (barnepass: IBarnepass, barnid: string) => {
    const endretBarn = søknad.person.barn.map((barn: IBarn) => {
      if (barn.id === barnid) {
        return {
          ...barn,
          barnepass: barnepass,
        };
      }
      return barn;
    });
    settSøknad((prevSøknad: SøknadBarnetilsyn) => {
      return {
        ...prevSøknad,
        person: { ...prevSøknad.person, barn: endretBarn },
      };
    });
  };

  const settSøknadsdato = (dato: Date | null) => {
    dato !== null &&
      settSøknad((prevSøknad: SøknadBarnetilsyn) => {
        return {
          ...prevSøknad,
          søknadsdato: {
            label: hentTekst(datovelgerLabel, intl),
            verdi: datoTilStreng(dato),
          },
        };
      });
  };

  const settSøkerFraBestemtMåned = (spørsmål: ISpørsmål, svar: ISvar) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
      if (
        svar.id === ESøkerFraBestemtMåned.neiNavKanVurdere &&
        søknadsdato?.verdi
      )
        delete prevSoknad.søknadsdato;
      return {
        ...prevSoknad,
        [spørsmål.søknadid]: {
          spørsmålid: spørsmål.søknadid,
          svarid: svar.id,
          label: hentTekst(spørsmål.tekstid, intl),
          verdi: svar.id === ESøkerFraBestemtMåned.ja,
        },
      };
    });
  };

  const alertTekst: string = skalDokumentereTidligereFakturaer(
    barnSomSkalHaBarnepass,
    søkerFraBestemtMåned,
    søknadsdato
  )
    ? hentTekst('barnepass.dokumentasjon.søkerStønadFraBestemtMnd', intl)
    : '';

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={intl.formatMessage({ id: 'barnepass.sidetittel' })}
      skalViseKnapper={skalViseKnapper}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      erSpørsmålBesvart={erBarnepassStegFerdigUtfylt(
        barnSomSkalHaBarnepass,
        søknad
      )}
      routesStønad={RoutesBarnetilsyn}
      tilbakeTilOppsummeringPath={hentPathBarnetilsynOppsummering}
    >
      <SeksjonGruppe>
        {barnSomSkalHaBarnepass.map((barn: IBarn, index: number) => {
          const visSeksjon =
            index === 0 ||
            erBarnepassForBarnFørNåværendeUtfylt(barn, barnSomSkalHaBarnepass);
          return (
            visSeksjon && (
              <React.Fragment key={barn.id}>
                <SeksjonGruppe>
                  <BarneHeader barn={barn} />
                </SeksjonGruppe>
                {harBarnAvsluttetFjerdeKlasse(barn.fødselsdato.verdi) && (
                  <ÅrsakBarnepass
                    barn={barn}
                    settBarnepass={settBarnepass}
                    settDokumentasjonsbehovForBarn={
                      settDokumentasjonsbehovForBarn
                    }
                  />
                )}
                {erÅrsakBarnepassSpmBesvart(barn) && (
                  <BarnepassOrdninger
                    barn={barn}
                    settBarnepass={settBarnepass}
                    settDokumentasjonsbehovForBarn={
                      settDokumentasjonsbehovForBarn
                    }
                  />
                )}
              </React.Fragment>
            )
          );
        })}
      </SeksjonGruppe>
      {erBarnepassForAlleBarnUtfylt(barnSomSkalHaBarnepass) && (
        <SeksjonGruppe>
          <NårSøkerDuStønadFra
            spørsmål={SøkerDuStønadFraBestemtMndSpm(intl)}
            settSøkerFraBestemtMåned={settSøkerFraBestemtMåned}
            settDato={settSøknadsdato}
            søkerFraBestemtMåned={søkerFraBestemtMåned}
            valgtDato={søknadsdato}
            datovelgerLabel={datovelgerLabel}
            hjelpetekstInnholdTekst={
              <StyledHjelpetekst>
                <BodyShort>{hjelpetekstInnholdSøkerFraMndTekstDel1}</BodyShort>
                <BodyShort>{hjelpetekstInnholdSøkerFraMndTekstDel2}</BodyShort>
              </StyledHjelpetekst>
            }
            alertTekst={alertTekst}
          />
        </SeksjonGruppe>
      )}
    </Side>
  );
};

export default Barnepass;
