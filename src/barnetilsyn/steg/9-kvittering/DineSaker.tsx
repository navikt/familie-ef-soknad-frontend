import { FC } from 'react';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import LocaleTekst from '../../../language/LocaleTekst';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import { BodyShort } from '@navikt/ds-react';

const DineSaker: FC = () => {
  return (
    <SeksjonGruppe>
      <KomponentGruppe>
        <BodyShort>
          <LocaleTekst tekst={'kvittering.tekst.altViTrenger'} />
        </BodyShort>
      </KomponentGruppe>
      <KomponentGruppe>
        <BodyShort>
          <LocaleTekst tekst={'kvittering.tekst.dineSaker'} />
        </BodyShort>
      </KomponentGruppe>
    </SeksjonGruppe>
  );
};

export default DineSaker;
