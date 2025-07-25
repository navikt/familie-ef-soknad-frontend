import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { BodyShort, Link } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const RegistrerDegSomArbeidssøker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      <FeltGruppe>
        <BodyShort>{hentTekst('kvittering.tekst.arbeidssøker', intl)}</BodyShort>
      </FeltGruppe>
      <Link href={'https://arbeidssokerregistrering.nav.no/'}>
        {hentTekst('kvittering.knapp.arbeidssøker', intl)}
      </Link>
    </SeksjonGruppe>
  );
};

export default RegistrerDegSomArbeidssøker;
