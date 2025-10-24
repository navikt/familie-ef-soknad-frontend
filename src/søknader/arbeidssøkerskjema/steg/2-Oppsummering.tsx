import React from 'react';
import Side from '../side/Side';
import endre from '../../../assets/endre.svg';
import {
  ERouteArbeidssøkerskjema,
  RoutesArbeidssokerskjema,
} from '../routes/routesArbeidssokerskjema';
import { mapDataTilLabelOgVerdiTyper } from '../utils/innsending';
import { useLocation, useNavigate } from 'react-router-dom';
import { hentTekst } from '../../../utils/teksthåndtering';
import { useSkjema } from '../SkjemaContext';
import { VisLabelOgSvar } from '../../../utils/visning';
import { IArbeidssøker } from '../../../models/steg/aktivitet/arbeidssøker';
import { LenkeMedIkon } from '../../../components/knapper/LenkeMedIkon';
import { sendInnArbeidssøkerSkjema } from '../innsending/api';
import { IStatus } from '../innsending/typer';
import { parseISO } from 'date-fns';
import { hentForrigeRoute, hentNesteRoute, hentPath } from '../../../utils/routing';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Alert, BodyShort, Button, Heading, HGrid, VStack } from '@navikt/ds-react';

interface Innsending {
  status: IStatus;
  melding: string;
  venter: boolean;
}

const Oppsummering: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  const { skjema, settSkjema } = useSkjema();
  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });
  const forrigeRoute = hentForrigeRoute(RoutesArbeidssokerskjema, location.pathname);
  const nesteRoute = hentNesteRoute(RoutesArbeidssokerskjema, location.pathname);
  const spørsmålOgSvar = VisLabelOgSvar(skjema.arbeidssøker);

  const sendInnArbeidssøkerSkjemaOgNavigerVidere = async (mappetSkjema: Record<string, object>) => {
    try {
      const kvittering = await sendInnArbeidssøkerSkjema(mappetSkjema);

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
    sendInnArbeidssøkerSkjemaOgNavigerVidere(mappetSkjema);
  };

  return (
    <Side tittel={hentTekst('oppsummering.sidetittel', intl)} skalViseKnapper={false}>
      <VStack gap={'6'}>
        <BodyShort>{hentTekst('skjema.oppsummering.disclaimer', intl)}</BodyShort>
        <Heading size="small" level="4" align={'center'}>
          {hentTekst('skjema.oppsummering.omdeg', intl)}
        </Heading>
        {spørsmålOgSvar}
        <LenkeMedIkon
          onClick={() =>
            navigate(
              {
                pathname: hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Spørsmål),
              },
              { state: { kommerFraOppsummering: true } }
            )
          }
          tekst_id="barnasbosted.knapp.endre"
          ikon={endre}
        />

        {innsendingState.status === IStatus.FEILET && (
          <Alert size="small" variant={'warning'} inline>
            <BodyShort>{innsendingState.melding}</BodyShort>
          </Alert>
        )}
        <VStack gap={'4'} align={'center'}>
          <HGrid gap={'4'} columns={{ md: '1fr 1fr' }}>
            <Button variant={'secondary'} onClick={() => navigate(forrigeRoute.path)}>
              {hentTekst('knapp.tilbake', intl)}
            </Button>

            <Button
              variant={'primary'}
              onClick={() => !innsendingState.venter && sendSkjema(skjema.arbeidssøker)}
              loading={innsendingState.venter}
            >
              {hentTekst('skjema.send', intl)}
            </Button>
          </HGrid>

          <Button variant={'tertiary'} onClick={() => navigate(RoutesArbeidssokerskjema[0].path)}>
            {hentTekst('knapp.avbryt', intl)}
          </Button>
        </VStack>
      </VStack>
    </Side>
  );
};

export default Oppsummering;
