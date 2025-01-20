import React from 'react';
import Side from '../side/Side';
import endre from '../../assets/endre.svg';
import {
  ERouteArbeidssøkerskjema,
  RoutesArbeidssokerskjema,
} from '../routes/routesArbeidssokerskjema';
import { mapDataTilLabelOgVerdiTyper } from '../utils/innsending';
import { useLocation, useNavigate } from 'react-router-dom';
import { hentTekst } from '../../utils/søknad';
import { useSkjema } from '../SkjemaContext';
import { VisLabelOgSvar } from '../../utils/visning';
import { IArbeidssøker } from '../../models/steg/aktivitet/arbeidssøker';
import LenkeMedIkon from '../../components/knapper/LenkeMedIkon';
import { sendInnArbeidssøkerSkjema, sendInnSkjema } from '../innsending/api';
import { IStatus } from '../innsending/typer';
import LocaleTekst from '../../language/LocaleTekst';
import SeksjonGruppe from '../../components/gruppe/SeksjonGruppe';
import KomponentGruppe from '../../components/gruppe/KomponentGruppe';
import { StyledKnapper } from '../../components/knapper/StyledKnapper';
import { parseISO } from 'date-fns';
import {
  hentForrigeRoute,
  hentNesteRoute,
  hentPath,
} from '../../utils/routing';
import { logSidevisningArbeidssokerskjema } from '../../utils/amplitude';
import { useMount } from '../../utils/hooks';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';

interface Innsending {
  status: IStatus;
  melding: string;
  venter: boolean;
}

const Oppsummering: React.FC = () => {
  const location = useLocation();
  const { toggles } = useToggles();
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  const { skjema, settSkjema } = useSkjema();
  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });
  const forrigeRoute = hentForrigeRoute(
    RoutesArbeidssokerskjema,
    location.pathname
  );
  const nesteRoute = hentNesteRoute(
    RoutesArbeidssokerskjema,
    location.pathname
  );
  const spørsmålOgSvar = VisLabelOgSvar(skjema.arbeidssøker);

  useMount(() => logSidevisningArbeidssokerskjema('Oppsummering'));

  const sendInnArbeidsøkerSkjemaOgNavigerVidere = async (
    mappetSkjema: Record<string, object>
  ) => {
    try {
      const brukModernisertFlyt = toggles[ToggleName.visNyInnsendingsknapp];
      const kvittering = brukModernisertFlyt
        ? await sendInnArbeidssøkerSkjema(mappetSkjema)
        : await sendInnSkjema(mappetSkjema);

      settinnsendingState({
        ...innsendingState,
        status: IStatus.SUKSESS,
        melding: `Vi har kontakt: ${kvittering.text}`,
        venter: false,
      });
      settSkjema({
        ...skjema,
        innsendingsdato: parseISO(kvittering.mottattDato),
      });
      navigate(nesteRoute.path);
    } catch (e) {
      settinnsendingState({
        ...innsendingState,
        status: IStatus.FEILET,
        melding: `Noe gikk galt: ${e}`,
        venter: false,
      });
    }
  };

  const sendSkjema = (arbeidssøker: IArbeidssøker) => {
    const mappetSkjema = mapDataTilLabelOgVerdiTyper(arbeidssøker);
    settinnsendingState({ ...innsendingState, venter: true });
    sendInnArbeidsøkerSkjemaOgNavigerVidere(mappetSkjema);
  };

  return (
    <Side
      tittel={intl.formatMessage({ id: 'oppsummering.sidetittel' })}
      skalViseKnapper={false}
    >
      <SeksjonGruppe>
        <div className="oppsummering-arbeidssøker">
          <p className="navds-body-short navds-body-long disclaimer">
            {hentTekst('skjema.oppsummering.disclaimer', intl)}
          </p>
          <Heading size="small" level="4">
            {hentTekst('skjema.oppsummering.omdeg', intl)}
          </Heading>
          {spørsmålOgSvar}
        </div>
        <LenkeMedIkon
          onClick={() =>
            navigate(
              {
                pathname: hentPath(
                  RoutesArbeidssokerskjema,
                  ERouteArbeidssøkerskjema.Spørsmål
                ),
              },
              { state: { kommerFraOppsummering: true } }
            )
          }
          tekst_id="barnasbosted.knapp.endre"
          ikon={endre}
        />
      </SeksjonGruppe>

      {innsendingState.status === IStatus.FEILET && (
        <KomponentGruppe>
          <Alert size="small" variant={'warning'} inline>
            <BodyShort>{innsendingState.melding}</BodyShort>
          </Alert>
        </KomponentGruppe>
      )}
      <SeksjonGruppe className={'sentrert'}>
        <StyledKnapper>
          <Button
            className={'tilbake'}
            variant={'secondary'}
            onClick={() => navigate(forrigeRoute.path)}
          >
            <LocaleTekst tekst={'knapp.tilbake'} />
          </Button>

          <Button
            variant={'primary'}
            onClick={() =>
              !innsendingState.venter && sendSkjema(skjema.arbeidssøker)
            }
            className={'neste'}
            loading={innsendingState.venter}
          >
            <LocaleTekst tekst={'skjema.send'} />
          </Button>

          <Button
            className={'avbryt'}
            variant={'tertiary'}
            onClick={() => navigate(RoutesArbeidssokerskjema[0].path)}
          >
            <LocaleTekst tekst={'knapp.avbryt'} />
          </Button>
        </StyledKnapper>
      </SeksjonGruppe>
    </Side>
  );
};

export default Oppsummering;
