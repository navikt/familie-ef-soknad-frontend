import { FC } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import download from '../../../../assets/download.svg';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Heading, Label, Link } from '@navikt/ds-react';
import { useHentFilInformasjon } from '../../../../utils/hooks';
import { hentTekst } from '../../../../utils/teksthåndtering';

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
      <Heading size="small" spacing={true}>
        {hentTekst('kvittering.tittel.huskeliste.erSyk', intl)}
      </Heading>

      <BodyShort>{hentTekst('kvittering.beskrivelse.huskeliste.erSyk', intl)}</BodyShort>
      <StyledLenke>
        <Link href={filPath} download>
          <img alt="Nedlastingsikon" src={download} />
          <Label as="p">
            {hentTekst('kvittering.knapp.huskeliste.erSyk', intl)}
            {filInformasjon}
          </Label>
        </Link>
      </StyledLenke>
    </SeksjonGruppe>
  );
};

export default SykSøker;
