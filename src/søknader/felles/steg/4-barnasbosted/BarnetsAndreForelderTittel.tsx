import * as React from 'react';
import { FC } from 'react';
import { førsteBokstavStor } from '../../../../utils/språk';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { hentTekst } from '../../../../utils/søknad';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { IBarn } from '../../../../models/steg/barn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Heading } from '@navikt/ds-react';

const BarnetsAndreForelderTittel: FC<{ barn: IBarn }> = ({ barn }) => {
  const intl = useLokalIntlContext();
  return (
    <FeltGruppe>
      <Heading size="small" level="4">
        {førsteBokstavStor(hentBarnNavnEllerBarnet(barn, 'barnasbosted.element.barnet', intl))}
        {hentTekst('barnasbosted.element.andreforelder', intl)}
      </Heading>
    </FeltGruppe>
  );
};
export default BarnetsAndreForelderTittel;
