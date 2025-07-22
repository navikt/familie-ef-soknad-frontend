import { FC } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import download from '../../../../assets/download.svg';
import { StyledUndertittel } from '../../../../components/gruppe/Spacing';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Label, Link } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../../utils/hooks';
import { hentTekst } from '../../../../utils/søknad';

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
        {hentTekst('kvittering.tittel.huskeliste.erSyk', intl)}
      </StyledUndertittel>

      <BodyShort>{hentTekst('kvittering.beskrivelse.huskeliste.erSyk', intl)}</BodyShort>
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
