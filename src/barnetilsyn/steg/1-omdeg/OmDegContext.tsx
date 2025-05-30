import constate from 'constate';
import { useEffect, useState } from 'react';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useLocation } from 'react-router';

const [OmDegProvider, useOmDeg] = constate(() => {
  const { søknad } = useBarnetilsynSøknad();
  const [medlemskap2, settMedlemskap2] = useState(søknad.medlemskap);
  const { mellomlagretBarnetilsyn, mellomlagreBarnetilsyn2 } =
    useBarnetilsynSøknad();
  const location = useLocation();

  useEffect(() => {
    if (mellomlagretBarnetilsyn?.søknad.medlemskap) {
      settMedlemskap2(mellomlagretBarnetilsyn.søknad.medlemskap);
    }
  }, [mellomlagretBarnetilsyn]);

  const mellomlagreOmDeg = () => {
    const oppdatertSøknad = { ...søknad, medlemskap: medlemskap2 };

    return mellomlagreBarnetilsyn2(location.pathname, oppdatertSøknad);
  };

  return { medlemskap2, settMedlemskap2, mellomlagreOmDeg };
});

export { OmDegProvider, useOmDeg };
