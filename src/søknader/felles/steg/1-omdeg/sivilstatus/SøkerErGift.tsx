import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { harSøktSeparasjonSpørsmål } from './SivilstatusConfig';
import SøkerHarSøktSeparasjon from './SøkerHarSøktSeparasjon';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/søknad';

const SøktSeparasjonAlert = styled(Alert)`
  margin-bottom: 3rem;
`;

const SøkerErGift: React.FC = () => {
  const intl = useLokalIntlContext();
  const separasjonsSpørsmål: ISpørsmål = harSøktSeparasjonSpørsmål(intl);
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { harSøktSeparasjon } = sivilstatus;

  const settHarSøktSeparasjon = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settSivilstatus({
      ...sivilstatus,
      harSøktSeparasjon: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentBooleanFraValgtSvar(valgtSvar),
      },
    });
  };

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={separasjonsSpørsmål}
          onChange={settHarSøktSeparasjon}
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
