import React from 'react';
import Banner from '../Banner';
import { useLocation, useNavigate } from 'react-router-dom';
import SendBrevSVG from '../../assets/SendSøknadSVG';
import { hentTekst } from '../../utils/søknad';
import TilbakeNesteAvbrytKnapper from '../knapper/TilbakeNesteAvbrytKnapper';
import { IRoute } from '../../models/routes';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { hentBannertittel } from '../../utils/stønadstype';
import LocaleTekst from '../../language/LocaleTekst';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert, Button, BodyShort, Heading, Box } from '@navikt/ds-react';
import Stegindikator from '../stegindikator/Stegindikator';
import { stegSomSkalVisesPåStegindikator } from '../../utils/stegindikator';

export enum ESide {
  visTilbakeNesteAvbrytKnapp = 'visTilbakeNesteAvbrytKnapp',
  visTilbakeTilOppsummeringKnapp = 'visTilbakeTilOppsummeringKnapp',
  skjulKnapper = 'skjulKnapper',
}

//TODO: Fjern mellomlagreStønad etter omskriving
interface ISide {
  stønadstype: Stønadstype;
  stegtittel: string;
  routesStønad: IRoute[];
  skalViseKnapper: ESide;
  erSpørsmålBesvart?: boolean;
  mellomlagreStønad?: (steg: string) => void;
  mellomlagreSøknad?: () => void;
  tilbakeTilOppsummeringPath?: string;
  informasjonstekstId?: string;
  disableNesteKnapp?: boolean;
  children?: React.ReactNode;
  skalViseStegindikator?: boolean;
}

const Side: React.FC<ISide> = ({
  stønadstype,
  stegtittel,
  children,
  routesStønad,
  erSpørsmålBesvart,
  skalViseKnapper,
  mellomlagreStønad,
  mellomlagreSøknad,
  tilbakeTilOppsummeringPath,
  informasjonstekstId,
  disableNesteKnapp,
  skalViseStegindikator = true,
}) => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const navigate = useNavigate();

  const routes = Object.values(routesStønad);
  routes.shift();

  const stegobjekter = stegSomSkalVisesPåStegindikator(routes);
  const aktivtSteg = stegobjekter.findIndex(
    (steg) => steg.path === location.pathname
  );

  return (
    <div className={'søknadsdialog'}>
      <Banner tekstid={hentBannertittel(stønadstype)} />
      <div className={'side'}>
        {skalViseStegindikator && (
          <Stegindikator stegListe={stegobjekter} aktivtSteg={aktivtSteg} />
        )}

        {!skalViseKnapper && (
          <div className={'brev_ikon'}>
            <SendBrevSVG />
          </div>
        )}

        <Box padding="4" className={'side__innhold'}>
          <div className={'innholdscontainer'}>
            <Heading size="medium" className="hoved" level={'2'}>
              {stegtittel}
            </Heading>
            {children}
          </div>
        </Box>

        {informasjonstekstId && (
          <Alert
            size="small"
            variant="info"
            className="side__informasjon"
            inline
          >
            <LocaleTekst tekst={informasjonstekstId} />
          </Alert>
        )}

        {skalViseKnapper === ESide.visTilbakeNesteAvbrytKnapp ? (
          <>
            {!erSpørsmålBesvart && (
              <BodyShort size="small" className={'side__uu-tekst'}>
                {intl.formatMessage({ id: 'knapp.uu-tekst' })}
              </BodyShort>
            )}
            <TilbakeNesteAvbrytKnapper
              routesStønad={routesStønad}
              erSpørsmålBesvart={erSpørsmålBesvart}
              mellomlagreStønad={mellomlagreStønad}
              mellomlagreSøknad={mellomlagreSøknad}
              disableNesteKnapp={disableNesteKnapp}
            />
          </>
        ) : skalViseKnapper === ESide.visTilbakeTilOppsummeringKnapp ? (
          erSpørsmålBesvart && (
            <>
              <BodyShort size="small">
                {intl.formatMessage({ id: 'knapp.uu-tekst' })}
              </BodyShort>
              <Button
                variant="primary"
                className="tilbake-til-oppsummering"
                onClick={() => {
                  if (mellomlagreStønad) {
                    mellomlagreStønad(location.pathname);
                  } else if (mellomlagreSøknad) {
                    mellomlagreSøknad();
                  }
                  navigate({
                    pathname: tilbakeTilOppsummeringPath,
                  });
                }}
              >
                {hentTekst('oppsummering.tilbake', intl)}
              </Button>
            </>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Side;
