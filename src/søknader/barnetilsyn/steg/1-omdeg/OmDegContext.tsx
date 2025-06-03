import constate from 'constate';
import { useEffect, useState } from 'react';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useLocation } from 'react-router';

const [OmDegProvider, useOmDeg] = constate(() => {
  const {
    søknad,
    settSøknad,
    mellomlagretBarnetilsyn,
    mellomlagreBarnetilsyn2,
  } = useBarnetilsynSøknad();
  const [medlemskap, settMedlemskap] = useState(søknad.medlemskap);
  const location = useLocation();

  useEffect(() => {
    if (mellomlagretBarnetilsyn?.søknad.medlemskap) {
      settMedlemskap(mellomlagretBarnetilsyn.søknad.medlemskap);
    }
  }, [mellomlagretBarnetilsyn]);

  const mellomlagreOmDeg = () => {
    const oppdatertSøknad = { ...søknad, medlemskap: medlemskap };

    settSøknad({ ...søknad, medlemskap: medlemskap });

    return mellomlagreBarnetilsyn2(location.pathname, oppdatertSøknad);
  };

  return { medlemskap, settMedlemskap, mellomlagreOmDeg };
});

export { OmDegProvider, useOmDeg };
