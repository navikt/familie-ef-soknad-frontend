import constate from 'constate';
import { useState } from 'react';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useLocation } from 'react-router';

const [OmDegProvider, useOmDeg] = constate(() => {
  const { søknad } = useBarnetilsynSøknad();
  const [medlemskap2, settMedlemskap2] = useState(søknad.medlemskap);
  const { mellomlagreBarnetilsyn2 } = useBarnetilsynSøknad();
  const location = useLocation();

  const mellomlagreOmDeg = () => {
    const oppdatertSøknad = { ...søknad, medlemskap: medlemskap2 };

    return mellomlagreBarnetilsyn2(location.pathname, oppdatertSøknad);
  };

  // const oppdaterSøknadMedOmDegContext = () => {
  //   settSøknad((prevSøknad: SøknadBarnetilsyn) => {
  //     return { ...prevSøknad, medlemskap: medlemskap2 };
  //   });
  // };

  return { medlemskap2, settMedlemskap2, mellomlagreOmDeg };
});

export { OmDegProvider, useOmDeg };
