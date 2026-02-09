import React from 'react';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { harSøktSeparasjonSpørsmål } from './SivilstatusConfig';
import { SøkerHarSøktSeparasjon } from './SøkerHarSøktSeparasjon';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';

export const SøkerErGift: React.FC = () => {
  const intl = useLokalIntlContext();
  const separasjonsSpørsmål: ISpørsmål = harSøktSeparasjonSpørsmål(intl);
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();
  const { harSøktSeparasjon } = sivilstatus;

  const settHarSøktSeparasjon = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settSivilstatus({
      ...sivilstatus,
      harSøktSeparasjon: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentBooleanFraValgtSvar(valgtSvar),
      },
    });

    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const visSøkerHarSøktSeperasjonSpørsmål = harSøktSeparasjon?.verdi;
  const visSøktSeperasjonAlert = harSøktSeparasjon?.verdi === false;

  return (
    <VStack gap={'space-24'}>
      <JaNeiSpørsmål
        spørsmål={separasjonsSpørsmål}
        onChange={settHarSøktSeparasjon}
        valgtSvar={harSøktSeparasjon ? harSøktSeparasjon.verdi : undefined}
      />
      {visSøkerHarSøktSeperasjonSpørsmål && <SøkerHarSøktSeparasjon />}
      {visSøktSeperasjonAlert && (
        <Alert variant={'warning'} size={'small'} inline>
          {hentTekst('sivilstatus.alert-advarsel.søktSeparasjon', intl)}
        </Alert>
      )}
    </VStack>
  );
};
