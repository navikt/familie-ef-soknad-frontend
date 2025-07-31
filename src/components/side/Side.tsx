import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import Banner from '../Banner';
import SendBrevSVG from '../../assets/SendSøknadSVG';
import { TilbakeNesteAvbrytKnapper } from '../knapper/TilbakeNesteAvbrytKnapper';
import Stegindikator from '../stegindikator/Stegindikator';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { hentBannerKey } from '../../utils/stønadstype';
import { stegSomSkalVisesPåStegindikator } from '../../utils/stegindikator';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { IRoute } from '../../models/routes';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import styles from './Side.module.css';

export enum ESide {
  visTilbakeNesteAvbrytKnapp = 'visTilbakeNesteAvbrytKnapp',
  visTilbakeTilOppsummeringKnapp = 'visTilbakeTilOppsummeringKnapp',
  skjulKnapper = 'skjulKnapper',
}

interface ISide {
  stønadstype: Stønadstype;
  stegtittel: string;
  routesStønad: IRoute[];
  skalViseKnapper: ESide;
  erSpørsmålBesvart?: boolean;
  mellomlagreStønad?: (steg: string) => void;
  tilbakeTilOppsummeringPath?: string;
  informasjonstekstId?: string;
  disableNesteKnapp?: boolean;
  children?: React.ReactNode;
  skalViseStegindikator?: boolean;
  mellomlagreSteg?: () => void;
}

const Side: React.FC<ISide> = ({
  stønadstype,
  stegtittel,
  children,
  routesStønad,
  erSpørsmålBesvart,
  skalViseKnapper,
  mellomlagreStønad,
  tilbakeTilOppsummeringPath,
  informasjonstekstId,
  disableNesteKnapp,
  skalViseStegindikator = true,
  mellomlagreSteg,
}) => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const navigate = useNavigate();

  const routes = Object.values(routesStønad);
  routes.shift();

  const stegobjekter = stegSomSkalVisesPåStegindikator(routes);
  const aktivtSteg = stegobjekter.findIndex((steg) => steg.path === location.pathname);

  const handleTilbakeTilOppsummering = () => {
    if (mellomlagreSteg) {
      mellomlagreSteg();
    }
    if (mellomlagreStønad) {
      mellomlagreStønad(location.pathname);
    }
    navigate({
      pathname: tilbakeTilOppsummeringPath,
    });
  };

  return (
    <VStack gap="6">
      <Banner tekstid={hentBannerKey(stønadstype)} />

      <VStack gap="6" className={styles.innhold}>
        {skalViseStegindikator && (
          <Stegindikator stegListe={stegobjekter} aktivtSteg={aktivtSteg} />
        )}

        {skalViseKnapper === ESide.skjulKnapper && (
          <div className={styles.brevIkon}>
            <SendBrevSVG />
          </div>
        )}

        <VStack gap="8" className={styles.children}>
          <Heading size="medium" className={styles.stegTittel}>
            {stegtittel}
          </Heading>

          {children}

          {informasjonstekstId && (
            <Alert size="small" variant="info" inline>
              {hentHTMLTekst(informasjonstekstId, intl)}
            </Alert>
          )}

          {skalViseKnapper === ESide.visTilbakeNesteAvbrytKnapp && (
            <>
              {!erSpørsmålBesvart && (
                <BodyShort size="small" className={styles.uuTekst}>
                  {hentTekst('knapp.uu-tekst', intl)}
                </BodyShort>
              )}
              <TilbakeNesteAvbrytKnapper
                routesStønad={routesStønad}
                erSpørsmålBesvart={erSpørsmålBesvart}
                mellomlagreStønad={mellomlagreStønad}
                disableNesteKnapp={disableNesteKnapp}
                mellomlagreSteg={mellomlagreSteg}
              />
            </>
          )}

          {skalViseKnapper === ESide.visTilbakeTilOppsummeringKnapp && erSpørsmålBesvart && (
            <>
              <BodyShort size="small" className={styles.uuTekst}>
                {hentTekst('knapp.uu-tekst', intl)}
              </BodyShort>
              <Button
                variant="primary"
                className={styles.tilbakeTilOppsummering}
                onClick={handleTilbakeTilOppsummering}
              >
                {hentTekst('oppsummering.tilbake', intl)}
              </Button>
            </>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
};

export default Side;
