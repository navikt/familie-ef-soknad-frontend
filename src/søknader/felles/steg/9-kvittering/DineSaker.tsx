import { FC } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { BodyShort } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const DineSaker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      <KomponentGruppe>
        <BodyShort>{hentTekst('kvittering.tekst.altViTrenger', intl)}</BodyShort>
      </KomponentGruppe>
      <KomponentGruppe>
        <BodyShort>{hentTekst('kvittering.tekst.dineSaker', intl)}</BodyShort>
      </KomponentGruppe>
    </SeksjonGruppe>
  );
};

export default DineSaker;
