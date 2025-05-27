import constate from 'constate';
import { useState } from 'react';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';

const [OmDegProvider, useOmDeg] = constate(() => {
  const { søknad } = useBarnetilsynSøknad();
  const [medlemskap2, settMedlemskap2] = useState(søknad.medlemskap);

  return { medlemskap2, settMedlemskap2 };
});

export { OmDegProvider, useOmDeg };
