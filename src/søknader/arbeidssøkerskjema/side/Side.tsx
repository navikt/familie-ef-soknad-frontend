import React from 'react';
import Banner from '../../../components/Banner';
import { RoutesArbeidssokerskjema } from '../routes/routesArbeidssokerskjema';
import { useLocation } from 'react-router-dom';
import { hentForrigeRoute, hentNesteRoute } from '../../../utils/routing';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { BodyShort, Box, Heading } from '@navikt/ds-react';
import { KnappLocaleTekstOgNavigate } from '../../../components/knapper/KnappLocaleTekstOgNavigate';
import Stegindikator from '../../../components/stegindikator/Stegindikator';
import { stegSomSkalVisesPåStegindikator } from '../../../utils/stegindikator';
import { hentTekst } from '../../../utils/teksthåndtering';

interface ISide {
  tittel: string;
  erSpørsmålBesvart?: boolean;
  skalViseKnapper: boolean;
  children?: React.ReactNode;
  skalViseStegindikator?: boolean;
}

const Side: React.FC<ISide> = ({
  tittel,
  children,
  skalViseKnapper,
  erSpørsmålBesvart,
  skalViseStegindikator = true,
}) => {
  const location = useLocation();
  const intl = useLokalIntlContext();

  const routes = Object.values(RoutesArbeidssokerskjema);
  routes.shift();

  const stegobjekter = stegSomSkalVisesPåStegindikator(routes);
  const aktivtSteg = stegobjekter.findIndex((steg) => steg.path === location.pathname);
  const nesteRoute = hentNesteRoute(RoutesArbeidssokerskjema, location.pathname);
  const forrigeRoute = hentForrigeRoute(RoutesArbeidssokerskjema, location.pathname);

  return (
    <div className={'skjema'}>
      <Banner tekstid={'banner.tittel.arbeidssøker'} />
      <div className={'side'}>
        {skalViseStegindikator && (
          <Stegindikator aktivtSteg={aktivtSteg} stegListe={stegobjekter} />
        )}
        <Box padding="4" className={'side__innhold'}>
          <div className={'innholdscontainer'}>
            <Heading size="medium" className="hoved">
              {tittel}
            </Heading>
            {children}
          </div>
        </Box>
        {skalViseKnapper && (
          <>
            {!erSpørsmålBesvart && (
              <BodyShort size="small" className={'side__uu-tekst'}>
                {hentTekst('knapp.uu-tekst', intl)}
              </BodyShort>
            )}
            <div className={erSpørsmålBesvart ? 'side__knapper treKnapper' : 'side__knapper'}>
              <KnappLocaleTekstOgNavigate nesteSide={forrigeRoute.path} tekst={'knapp.tilbake'} />
              {erSpørsmålBesvart && (
                <KnappLocaleTekstOgNavigate
                  variant="secondary"
                  nesteSide={nesteRoute.path}
                  tekst={'knapp.neste'}
                />
              )}

              <KnappLocaleTekstOgNavigate
                variant="tertiary"
                nesteSide={RoutesArbeidssokerskjema[0].path}
                tekst={'knapp.avbryt'}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Side;
