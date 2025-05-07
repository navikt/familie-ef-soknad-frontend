import { FC } from 'react';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import download from '../../../assets/download.svg';
import { StyledUndertittel } from '../../../components/gruppe/Spacing';
import styled from 'styled-components';
import LocaleTekst from '../../../language/LocaleTekst';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { BodyShort, Label, Link } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../utils/hooks';

const StyledLenke = styled.div`
  margin-top: 1rem;

  img {
    margin-right: 0.5rem;
    display: inline;
  }

  p {
    display: inline;
  }
`;

const SykSøker: FC<{ filPath: string }> = ({ filPath }) => {
  const intl = useLokalIntlContext();
  const { filInformasjon } = useHentFilInformasjon(filPath);
  return (
    <SeksjonGruppe>
      <StyledUndertittel size="small">
        <LocaleTekst tekst={'kvittering.tittel.huskeliste.erSyk'} />
      </StyledUndertittel>

      <BodyShort>
        <LocaleTekst tekst={'kvittering.beskrivelse.huskeliste.erSyk'} />
      </BodyShort>
      <StyledLenke>
        <Link href={filPath} download>
          <img alt="Nedlastingsikon" src={download} />
          <Label as="p">
            {intl.formatMessage({ id: 'kvittering.knapp.huskeliste.erSyk' })}
            {filInformasjon}
          </Label>
        </Link>
      </StyledLenke>
    </SeksjonGruppe>
  );
};

export default SykSøker;
