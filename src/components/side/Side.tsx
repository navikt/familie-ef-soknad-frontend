import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { SøknadBanner } from '../SøknadBanner';
import SendBrevSVG from '../../assets/SendSøknadSVG';
import { Stegindikator } from '../stegindikator/Stegindikator';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { stegSomSkalVisesPåStegindikator } from '../../utils/stegindikator';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { IRoute } from '../../models/routes';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import styles from './Side.module.css';
import { hentBannerKeyForStønad } from '../../utils/stønadstype';
import { StegNavigasjon } from '../knapper/StegNavigasjon';

export enum NavigasjonState {
  visTilbakeNesteAvbrytKnapp = 'visTilbakeNesteAvbrytKnapp',
  visTilbakeTilOppsummeringKnapp = 'visTilbakeTilOppsummeringKnapp',
  skjulKnapper = 'skjulKnapper',
}

// TODO: Fjern nullable fra mellomlagreSteg
interface Props {
  stønadstype: Stønadstype;
  stegtittel: string;
  routesStønad: IRoute[];
  navigasjonState: NavigasjonState;
  erSpørsmålBesvart?: boolean;
  mellomlagreStønad?: (steg: string) => void;
  tilbakeTilOppsummeringPath?: string;
  informasjonstekstId?: string;
  disableNesteKnapp?: boolean;
  children?: React.ReactNode;
  skalViseStegindikator?: boolean;
  mellomlagreSteg?: () => void;
}

export const Side: React.FC<Props> = ({
  stønadstype,
  stegtittel,
  children,
  routesStønad,
  erSpørsmålBesvart,
  navigasjonState,
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

  const onTilbakeFraOppsummering = () => {
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
      <SøknadBanner bannerKey={hentBannerKeyForStønad(stønadstype)} />

      <VStack gap="6" className={styles.innhold}>
        {skalViseStegindikator && <Stegindikator steg={stegobjekter} aktivtSteg={aktivtSteg} />}

        {navigasjonState === NavigasjonState.skjulKnapper && (
          <VStack align={'center'} marginBlock={'8 8'}>
            <SendBrevSVG />
          </VStack>
        )}

        <VStack gap="8" className={styles.children}>
          <Heading level="2" size="medium" className={styles.stegTittel}>
            {stegtittel}
          </Heading>

          {children}

          {informasjonstekstId && (
            <Alert size="small" variant="info" inline>
              {hentHTMLTekst(informasjonstekstId, intl)}
            </Alert>
          )}

          {navigasjonState === NavigasjonState.visTilbakeNesteAvbrytKnapp && (
            <>
              {!erSpørsmålBesvart && (
                <BodyShort size="small" className={styles.uuTekst}>
                  {hentTekst('knapp.uu-tekst', intl)}
                </BodyShort>
              )}
              <StegNavigasjon
                routesStønad={routesStønad}
                erSpørsmålBesvart={erSpørsmålBesvart}
                mellomlagreStønad={mellomlagreStønad}
                disableNesteKnapp={disableNesteKnapp}
                mellomlagreSteg={mellomlagreSteg}
              />
            </>
          )}

          {navigasjonState === NavigasjonState.visTilbakeTilOppsummeringKnapp &&
            erSpørsmålBesvart && (
              <>
                <BodyShort size="small" className={styles.uuTekst}>
                  {hentTekst('knapp.uu-tekst', intl)}
                </BodyShort>
                <Button
                  variant="primary"
                  className={styles.tilbakeTilOppsummering}
                  onClick={onTilbakeFraOppsummering}
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
