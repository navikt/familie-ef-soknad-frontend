import React from 'react';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { harSøktSeparasjonSpørsmål } from './SivilstatusConfig';
import SøkerHarSøktSeparasjon from './SøkerHarSøktSeparasjon';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/søknad';
import { JaNeiSpørsmål } from '../../../../../components/spørsmål/JaNeiSpørsmål';

export const SøkerErGift: React.FC = () => {
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
    <VStack gap={'6'}>
      <JaNeiSpørsmål
        spørsmål={separasjonsSpørsmål}
        onChange={settHarSøktSeparasjon}
        valgtSvar={harSøktSeparasjon ? harSøktSeparasjon.verdi : undefined}
      />

      {harSøktSeparasjon?.verdi ? (
        <SøkerHarSøktSeparasjon />
      ) : (
        harSøktSeparasjon?.verdi === false && (
          <Alert variant={'warning'} inline size={'small'}>
            <LocaleTekst tekst={'sivilstatus.alert-advarsel.søktSeparasjon'} />
          </Alert>
        )
      )}
    </VStack>
  );
};
