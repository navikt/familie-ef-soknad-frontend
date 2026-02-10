import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { hentForrigeRoute, hentNesteRoute } from '../../utils/routing';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { IRoute } from '../../models/routes';

interface Props {
  routesStønad: IRoute[];
  erSpørsmålBesvart?: boolean;
  mellomlagreStønad?: (steg: string) => void;
  disableNesteKnapp?: boolean;
  mellomlagreSteg?: () => void;
}

export const StegNavigasjon: FC<Props> = ({
  routesStønad,
  erSpørsmålBesvart,
  mellomlagreStønad,
  disableNesteKnapp,
  mellomlagreSteg,
}) => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const navigate = useNavigate();

  const nesteRoute = hentNesteRoute(routesStønad, location.pathname);
  const forrigeRoute = hentForrigeRoute(routesStønad, location.pathname);

  const onNeste = () => {
    if (mellomlagreSteg) {
      mellomlagreSteg();
    } else if (mellomlagreStønad) {
      mellomlagreStønad(location.pathname);
    }
    navigate(nesteRoute.path);
  };

  const onTilbake = () => {
    navigate(forrigeRoute.path);
  };

  const onAvbryt = () => {
    navigate(routesStønad[0].path);
  };

  return (
    <VStack gap="space-16" align="center" aria-live="polite">
      {erSpørsmålBesvart ? (
        <>
          <HStack gap="space-16">
            <Button variant="secondary" onClick={onTilbake}>
              {hentTekst('knapp.tilbake', intl)}
            </Button>
            <Button variant="primary" disabled={disableNesteKnapp} onClick={onNeste}>
              {hentTekst('knapp.neste', intl)}
            </Button>
          </HStack>
          <Button variant="tertiary" onClick={onAvbryt}>
            {hentTekst('knapp.avbryt', intl)}
          </Button>
        </>
      ) : (
        <VStack gap="space-16" align="center">
          <Button variant="secondary" onClick={onTilbake}>
            {hentTekst('knapp.tilbake', intl)}
          </Button>
          <Button variant="tertiary" onClick={onAvbryt}>
            {hentTekst('knapp.avbryt', intl)}
          </Button>
        </VStack>
      )}
    </VStack>
  );
};
