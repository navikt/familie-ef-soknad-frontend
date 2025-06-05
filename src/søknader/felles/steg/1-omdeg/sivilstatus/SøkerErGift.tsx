import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { harSøktSeparasjonSpørsmål } from './SivilstatusConfig';
import SøkerHarSøktSeparasjon from './SøkerHarSøktSeparasjon';
import { ISivilstatus } from '../../../../../models/steg/omDeg/sivilstatus';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert } from '@navikt/ds-react';

interface Props {
  settJaNeiFelt: (spørsmål: ISpørsmål, valgtSvar: ISvar) => void;
  sivilstatus: ISivilstatus;
}

const SøktSeparasjonAlert = styled(Alert)`
  margin-bottom: 3rem;
`;

const SøkerErGift: React.FC<Props> = ({ settJaNeiFelt, sivilstatus }) => {
  const separasjonsSpørsmål: ISpørsmål = harSøktSeparasjonSpørsmål(
    useLokalIntlContext()
  );
  const { harSøktSeparasjon } = sivilstatus;

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={separasjonsSpørsmål}
          onChange={settJaNeiFelt}
          valgtSvar={harSøktSeparasjon ? harSøktSeparasjon.verdi : undefined}
        />
      </KomponentGruppe>
      {harSøktSeparasjon?.verdi ? (
        <SøkerHarSøktSeparasjon />
      ) : (
        harSøktSeparasjon?.verdi === false && (
          <SøktSeparasjonAlert variant="warning" inline>
            <LocaleTekst tekst={'sivilstatus.alert-advarsel.søktSeparasjon'} />
          </SøktSeparasjonAlert>
        )
      )}
    </>
  );
};

export default SøkerErGift;
