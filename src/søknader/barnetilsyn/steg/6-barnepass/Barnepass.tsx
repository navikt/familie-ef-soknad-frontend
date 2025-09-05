import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import NårSøkerDuStønadFra from '../../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { SøkerDuStønadFraBestemtMndSpm } from './BarnepassConfig';
import { IBarnepass } from '../../models/barnepass';
import BarnepassOrdninger from './BarnepassOrdninger';
import ÅrsakBarnepass from './ÅrsakBarnepass';
import BarneHeader from '../../../../components/BarneHeader';
import {
  erBarnepassForAlleBarnUtfylt,
  erBarnepassForBarnFørNåværendeUtfylt,
  erBarnepassStegFerdigUtfylt,
  erÅrsakBarnepassSpmBesvart,
  harBarnAvsluttetFjerdeKlasse,
  skalDokumentereTidligereFakturaer,
} from './hjelper';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { useLocation } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { IBarn } from '../../../../models/steg/barn';
import { dagensDato, datoTilStreng, formatMånederTilbake } from '../../../../utils/dato';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';
import { useBarnepass } from './BarnepassContext';

const StyledHjelpetekst = styled.div`
  .navds-body-short {
    padding-bottom: 1rem;
  }
`;
const Barnepass: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;
  const {
    søknadsdato,
    settSøknadsdato,
    søkerFraBestemtMåned,
    settSøkerFraBestemtMåned,
    barn,
    settBarn,
    mellomlagreSteg,
  } = useBarnepass();
  const barnSomSkalHaBarnepass = barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi);

  const datovelgerLabel = 'søkerStønadFraBestemtMnd.datovelger.barnepass';

  const hjelpetekstInnholdSøkerFraMndTekstDel1 = hentTekstMedEnVariabel(
    'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del1',
    intl,
    formatMånederTilbake(dagensDato, 3)
  );

  const hjelpetekstInnholdSøkerFraMndTekstDel2 = hentTekst(
    'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del2',
    intl
  );

  const settBarnepass = (barnepass: IBarnepass, barnid: string) => {
    const endretBarn = barn.map((enkeltBarn: IBarn) => {
      if (enkeltBarn.id === barnid) {
        return {
          ...enkeltBarn,
          barnepass: barnepass,
        };
      }
      return enkeltBarn;
    });
    settBarn(endretBarn);
  };

  const oppdaterSøknadsdato = (dato: Date | null) => {
    dato !== null &&
      settSøknadsdato({
        label: hentTekst(datovelgerLabel, intl),
        verdi: datoTilStreng(dato),
      });
  };

  const oppdaterSøkerFraBestemtMåned = (spørsmål: ISpørsmål, svar: ISvar) => {
    settSøkerFraBestemtMåned({
      spørsmålid: spørsmål.søknadid,
      svarid: svar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar.id === ESøkerFraBestemtMåned.ja,
    });
  };

  const alertTekst: string = skalDokumentereTidligereFakturaer(
    barnSomSkalHaBarnepass,
    søkerFraBestemtMåned,
    søknadsdato
  )
    ? 'barnepass.dokumentasjon.søkerStønadFraBestemtMnd'
    : '';

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={hentTekst('barnepass.sidetittel', intl)}
      navigasjonState={navigasjonState}
      mellomlagreSteg={mellomlagreSteg}
      erSpørsmålBesvart={erBarnepassStegFerdigUtfylt(
        barnSomSkalHaBarnepass,
        søknadsdato,
        søkerFraBestemtMåned
      )}
      routesStønad={RoutesBarnetilsyn}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <SeksjonGruppe>
        {barnSomSkalHaBarnepass.map((barn: IBarn, index: number) => {
          const visSeksjon =
            index === 0 || erBarnepassForBarnFørNåværendeUtfylt(barn, barnSomSkalHaBarnepass);
          return (
            visSeksjon && (
              <React.Fragment key={barn.id}>
                <SeksjonGruppe>
                  <BarneHeader barn={barn} />
                </SeksjonGruppe>
                {harBarnAvsluttetFjerdeKlasse(barn.fødselsdato.verdi) && (
                  <ÅrsakBarnepass barn={barn} settBarnepass={settBarnepass} />
                )}
                {erÅrsakBarnepassSpmBesvart(barn) && (
                  <BarnepassOrdninger barn={barn} settBarnepass={settBarnepass} indeks={index} />
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
            settSøkerFraBestemtMåned={oppdaterSøkerFraBestemtMåned}
            settDato={oppdaterSøknadsdato}
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
