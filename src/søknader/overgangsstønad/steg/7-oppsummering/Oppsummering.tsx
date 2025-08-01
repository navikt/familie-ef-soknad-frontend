import React, { useEffect, useState } from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import OppsummeringOmDeg from '../../../felles/steg/7-oppsummering/OppsummeringOmDeg';
import OppsummeringBarnasBosituasjon from '../../../felles/steg/7-oppsummering/OppsummeringBarnasBosituasjon';
import OppsummeringBarnaDine from '../../../felles/steg/7-oppsummering/OppsummeringBarnaDine';
import OppsummeringAktiviteter from '../../../felles/steg/7-oppsummering/OppsummeringAktiviteter';
import OppsummeringDinSituasjon from '../../../felles/steg/7-oppsummering/OppsummeringDinSituasjon';
import OppsummeringBosituasjonenDin from '../../../felles/steg/7-oppsummering/OppsummeringBosituasjon';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { hentPath } from '../../../../utils/routing';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import {
  logBrowserBackOppsummering,
  logManglendeFelter,
  logSidevisningOvergangsstonad,
} from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { IBarn } from '../../../../models/steg/barn';
import { useNavigationType } from 'react-router-dom';
import { ESkjemanavn, skjemanavnIdMapping } from '../../../../utils/skjemanavn';
import {
  aktivitetSchema,
  datoSkalGifteSegEllerBliSamboerSchema,
  fødselsdatoSchema,
  identSchema,
  listManglendeFelter,
  ManglendeFelter,
  manglendeFelterTilTekst,
  medlemskapSchema,
  merOmDinSituasjonSchema,
  sivilstatusSchema,
} from '../../../../utils/validering/validering';
import { Accordion, Alert, BodyShort } from '@navikt/ds-react';

const Oppsummering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { mellomlagreOvergangsstønad, søknad } = useOvergangsstønadSøknad();
  const skjemaId = skjemanavnIdMapping[ESkjemanavn.Overgangsstønad];
  const action = useNavigationType();

  const [manglendeFelter, settManglendeFelter] = useState<string[]>([]);

  useMount(() => logSidevisningOvergangsstonad('Oppsummering'));

  const barnMedsærligeTilsynsbehov = søknad.person.barn
    .filter((barn: IBarn) => barn.særligeTilsynsbehov)
    .map((barn: IBarn) => barn.særligeTilsynsbehov);

  useEffect(() => {
    if (action === 'POP') {
      logBrowserBackOppsummering(ESkjemanavn.Overgangsstønad, skjemaId);
    }
    // eslint-disable-next-line
  }, []);

  const feilIkkeRegistrertFor = (felt: ManglendeFelter) => {
    return !manglendeFelter.includes(manglendeFelterTilTekst[felt]);
  };

  const oppdaterManglendeFelter = (manglendeFelt: ManglendeFelter) => {
    settManglendeFelter((prev: string[]): string[] => [
      ...prev,
      manglendeFelterTilTekst[manglendeFelt],
    ]);
  };

  const validerHvisSøkerSkalGifteSeg = () => {
    if (søknad.bosituasjon.skalGifteSegEllerBliSamboer?.verdi) {
      const harGyldigDatoForGiftemål = datoSkalGifteSegEllerBliSamboerSchema.isValidSync(
        søknad.bosituasjon.datoSkalGifteSegEllerBliSamboer
      );
      const harGyldigIdent =
        søknad.bosituasjon.vordendeSamboerEktefelle &&
        identSchema.isValidSync(søknad.bosituasjon.vordendeSamboerEktefelle.ident);
      const harGyldigFødselsdato =
        søknad.bosituasjon.vordendeSamboerEktefelle &&
        fødselsdatoSchema.isValidSync(søknad.bosituasjon.vordendeSamboerEktefelle.fødselsdato);
      const harGyldigIdentEllerDatoPåVordende = harGyldigFødselsdato || harGyldigIdent;
      if (!harGyldigIdentEllerDatoPåVordende || !harGyldigDatoForGiftemål) {
        if (feilIkkeRegistrertFor(ManglendeFelter.BOSITUASJONEN_DIN)) {
          oppdaterManglendeFelter(ManglendeFelter.BOSITUASJONEN_DIN);
        }
        logManglendeFelter(
          ESkjemanavn.Overgangsstønad,
          skjemaId,
          'ValidationError: vordendeSamboerEktefelle mangler gyldig ident eller fødselsdato'
        );
      }
    }
  };

  useEffect(() => {
    {
      validerHvisSøkerSkalGifteSeg();
    }

    aktivitetSchema
      .validate(søknad.aktivitet)
      .then()
      .catch((e) => {
        if (!manglendeFelter.includes(manglendeFelterTilTekst[ManglendeFelter.AKTIVITET])) {
          oppdaterManglendeFelter(ManglendeFelter.AKTIVITET);
        }
        logManglendeFelter(ESkjemanavn.Overgangsstønad, skjemaId, e);
      });

    sivilstatusSchema
      .validate(søknad.sivilstatus)
      .then()
      .catch((e) => {
        if (feilIkkeRegistrertFor(ManglendeFelter.OM_DEG)) {
          oppdaterManglendeFelter(ManglendeFelter.OM_DEG);
        }
        logManglendeFelter(ESkjemanavn.Overgangsstønad, skjemaId, e);
      });

    merOmDinSituasjonSchema
      .validate(søknad.merOmDinSituasjon)
      .then()
      .catch((e) => {
        if (feilIkkeRegistrertFor(ManglendeFelter.MER_OM_DIN_SITUASJON)) {
          oppdaterManglendeFelter(ManglendeFelter.MER_OM_DIN_SITUASJON);
        }
        logManglendeFelter(ESkjemanavn.Overgangsstønad, skjemaId, e);
      });

    medlemskapSchema
      .validate(søknad.medlemskap)
      .then()
      .catch((e) => {
        if (feilIkkeRegistrertFor(ManglendeFelter.OM_DEG)) {
          oppdaterManglendeFelter(ManglendeFelter.OM_DEG);
        }
        logManglendeFelter(ESkjemanavn.Overgangsstønad, skjemaId, e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [søknad, manglendeFelter, skjemaId]);

  const harManglendeFelter = manglendeFelter.length > 0;

  return (
    <>
      <Side
        stønadstype={Stønadstype.overgangsstønad}
        stegtittel={hentTekst('oppsummering.sidetittel', intl)}
        skalViseKnapper={NavigasjonState.visTilbakeNesteAvbrytKnapp}
        erSpørsmålBesvart={true}
        mellomlagreStønad={mellomlagreOvergangsstønad}
        routesStønad={RoutesOvergangsstonad}
        disableNesteKnapp={harManglendeFelter}
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
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.OmDeg
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('stegtittel.bosituasjon', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBosituasjonenDin
                    bosituasjon={søknad.bosituasjon}
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.BosituasjonenDin
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('barnadine.sidetittel', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBarnaDine
                    barn={søknad.person.barn}
                    stønadstype={Stønadstype.overgangsstønad}
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.Barn
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('barnasbosted.sidetittel', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringBarnasBosituasjon
                    barn={søknad.person.barn}
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.BarnasBosted
                    )}
                    stønadstype={Stønadstype.overgangsstønad}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>
                  {hentTekst('stegtittel.arbeidssituasjon', intl)}
                </Accordion.Header>
                <Accordion.Content>
                  <OppsummeringAktiviteter
                    aktivitet={søknad.aktivitet}
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.Aktivitet
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>{hentTekst('stegtittel.dinSituasjon', intl)}</Accordion.Header>
                <Accordion.Content>
                  <OppsummeringDinSituasjon
                    tittel={hentTekst('stegtittel.dinSituasjon', intl)}
                    dinSituasjon={søknad.merOmDinSituasjon}
                    barnMedsærligeTilsynsbehov={barnMedsærligeTilsynsbehov}
                    endreInformasjonPath={hentPath(
                      RoutesOvergangsstonad,
                      ERouteOvergangsstønad.DinSituasjon
                    )}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </KomponentGruppe>
          {harManglendeFelter && (
            <Alert size="small" variant="warning">
              Det er felter i søknaden som ikke er fylt ut eller har ugyldig verdi. Gå til{' '}
              {listManglendeFelter(manglendeFelter)} for å legge inn gyldige verdier før du sender
              inn søknaden.
            </Alert>
          )}
        </div>
      </Side>
    </>
  );
};

export default Oppsummering;
