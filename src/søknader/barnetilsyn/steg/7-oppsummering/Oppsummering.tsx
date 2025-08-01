import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import OppsummeringAktiviteter from '../../../felles/steg/7-oppsummering/OppsummeringAktiviteter';
import OppsummeringBarnaDine from '../../../felles/steg/7-oppsummering/OppsummeringBarnaDine';
import OppsummeringBarnasBosituasjon from '../../../felles/steg/7-oppsummering/OppsummeringBarnasBosituasjon';
import OppsummeringBarnepass from './OppsummeringBarnepass';
import OppsummeringBosituasionenDin from '../../../felles/steg/7-oppsummering/OppsummeringBosituasjon';
import OppsummeringOmDeg from '../../../felles/steg/7-oppsummering/OppsummeringOmDeg';
import { ERouteBarnetilsyn, RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { IBarn } from '../../../../models/steg/barn';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentPath } from '../../../../utils/routing';
import { Side, StegNavigasjonState } from '../../../../components/side/Side';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningBarnetilsyn } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { Accordion, BodyShort } from '@navikt/ds-react';

const Oppsummering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { mellomlagreBarnetilsyn, søknad } = useBarnetilsynSøknad();
  const barnSomSkalHaBarnepass: IBarn[] = søknad.person.barn.filter(
    (barn: IBarn) => barn.skalHaBarnepass?.verdi
  );

  useMount(() => logSidevisningBarnetilsyn('Oppsummering'));

  return (
    <>
      <Side
        stønadstype={Stønadstype.barnetilsyn}
        stegtittel={hentTekst('oppsummering.sidetittel', intl)}
        erSpørsmålBesvart={true}
        mellomlagreStønad={mellomlagreBarnetilsyn}
        routesStønad={RoutesBarnetilsyn}
        skalViseKnapper={StegNavigasjonState.visTilbakeNesteAvbrytKnapp}
      >
        <div className="oppsummering">
          <BodyShort className="disclaimer">
            {hentTekst('oppsummering.normaltekst.lesgjennom', intl)}
          </BodyShort>

          <KomponentGruppe>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('stegtittel.omDeg', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringOmDeg
                    søker={søknad.person.søker}
                    søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
                    harMeldtAdresseendring={søknad.adresseopplysninger?.harMeldtAdresseendring}
                    sivilstatus={søknad.sivilstatus}
                    medlemskap={søknad.medlemskap}
                    endreInformasjonPath={hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.OmDeg)}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('stegtittel.bosituasjon', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBosituasionenDin
                    bosituasjon={søknad.bosituasjon}
                    endreInformasjonPath={hentPath(
                      RoutesBarnetilsyn,
                      ERouteBarnetilsyn.BosituasjonenDin
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('barnadine.sidetittel', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBarnaDine
                    barn={søknad.person.barn}
                    stønadstype={Stønadstype.barnetilsyn}
                    endreInformasjonPath={hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.BarnaDine)}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('barnasbosted.sidetittel', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBarnasBosituasjon
                    barn={søknad.person.barn}
                    endreInformasjonPath={hentPath(
                      RoutesBarnetilsyn,
                      ERouteBarnetilsyn.BostedOgSamvær
                    )}
                    stønadstype={Stønadstype.barnetilsyn}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  {hentTekst('stegtittel.arbeidssituasjon.barnetilsyn', intl)}
                </Accordion.Header>
                <Accordion.Content>
                  <OppsummeringAktiviteter
                    aktivitet={søknad.aktivitet}
                    endreInformasjonPath={hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Aktivitet)}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('barnepass.sidetittel', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBarnepass
                    søkerFraBestemtDato={søknad.søkerFraBestemtMåned}
                    søknadsdato={søknad.søknadsdato}
                    barnSomSkalHaBarnepass={barnSomSkalHaBarnepass}
                    endreInformasjonPath={hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Barnepass)}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </KomponentGruppe>
        </div>
      </Side>
    </>
  );
};

export default Oppsummering;
