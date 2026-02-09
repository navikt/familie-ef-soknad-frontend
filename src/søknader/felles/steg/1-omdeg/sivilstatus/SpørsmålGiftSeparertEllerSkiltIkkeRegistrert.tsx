import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { erUformeltGiftSpørsmål, erUformeltSeparertEllerSkiltSpørsmål } from './SivilstatusConfig';
import { ESvar, ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { hentSvarAlertFraSpørsmål } from '../../../../../utils/søknad';
import React from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentValgtSvar } from '../../../../../utils/sivilstatus';
import { useOmDeg } from '../OmDegContext';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { Alert, VStack } from '@navikt/ds-react';

export const SpørsmålGiftSeparertEllerSkiltIkkeRegistrert: React.FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();
  const { erUformeltGift } = sivilstatus;

  const settErUformeltGift = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settSivilstatus({
      ...sivilstatus,
      erUformeltGift: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentBooleanFraValgtSvar(valgtSvar),
      },
    });

    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const settErUformeltSeparertEllerSkilt = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settSivilstatus({
      ...sivilstatus,
      erUformeltSeparertEllerSkilt: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentBooleanFraValgtSvar(valgtSvar),
      },
    });

    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const visUformeltGiftAlert = sivilstatus.erUformeltGift?.svarid === ESvar.JA;
  const visUformeltSeperertEllerSkiltSpørsmål = erUformeltGift?.verdi !== undefined;
  const visUformeltSeperertEllerSkiltAlert =
    sivilstatus.erUformeltSeparertEllerSkilt?.svarid === ESvar.JA;

  return (
    <VStack gap={'space-24'}>
      <JaNeiSpørsmål
        spørsmål={erUformeltGiftSpørsmål(intl)}
        onChange={settErUformeltGift}
        valgtSvar={hentValgtSvar(erUformeltGiftSpørsmål(intl), sivilstatus)}
      />
      {visUformeltGiftAlert && (
        <Alert variant={'info'} size={'small'} inline>
          {hentTekst(hentSvarAlertFraSpørsmål(ESvar.JA, erUformeltGiftSpørsmål(intl)), intl)}
        </Alert>
      )}
      {visUformeltSeperertEllerSkiltSpørsmål && (
        <JaNeiSpørsmål
          spørsmål={erUformeltSeparertEllerSkiltSpørsmål(intl)}
          onChange={settErUformeltSeparertEllerSkilt}
          valgtSvar={hentValgtSvar(erUformeltSeparertEllerSkiltSpørsmål(intl), sivilstatus)}
        />
      )}
      {visUformeltSeperertEllerSkiltAlert && (
        <Alert variant={'info'} size={'small'} inline>
          {hentTekst(
            hentSvarAlertFraSpørsmål(ESvar.JA, erUformeltSeparertEllerSkiltSpørsmål(intl)),
            intl
          )}
        </Alert>
      )}
    </VStack>
  );
};
