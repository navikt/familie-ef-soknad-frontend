import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { BodyShort, Checkbox } from '@navikt/ds-react';

interface Props {
  skalHaBarnepass?: boolean;
  toggleSkalHaBarnepass: (id: string) => void;
  id: string;
  testId?: string;
}

const BarnMedISøknad: FC<Props> = ({ skalHaBarnepass, toggleSkalHaBarnepass, id, testId }) => {
  const intl = useLokalIntlContext();

  return (
    <Checkbox
      data-testid={testId}
      checked={skalHaBarnepass}
      onChange={() => toggleSkalHaBarnepass(id)}
    >
      <BodyShort align={'start'}>{hentTekst('barnadine.knapp.søkBarnetilsyn', intl)}</BodyShort>
    </Checkbox>
  );
};

export default BarnMedISøknad;
