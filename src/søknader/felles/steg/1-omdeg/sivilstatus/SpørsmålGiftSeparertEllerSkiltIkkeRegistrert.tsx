import { erUformeltGiftSpørsmål, erUformeltSeparertEllerSkiltSpørsmål } from './SivilstatusConfig';
import { ESvar, ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { hentSvarAlertFraSpørsmål, hentTekst } from '../../../../../utils/søknad';
import React from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentValgtSvar } from '../../../../../utils/sivilstatus';
import { useOmDeg } from '../OmDegContext';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { JaNeiSpørsmål } from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { Alert, VStack } from '@navikt/ds-react';

export const SpørsmålGiftSeparertEllerSkiltIkkeRegistrert: React.FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { erUformeltGift } = sivilstatus;

  const harSvartJaPåUformeltGift = sivilstatus.erUformeltGift?.svarid === ESvar.JA;

  const harSvartJaUformeltSeparertEllerSkilt =
    sivilstatus.erUformeltSeparertEllerSkilt?.svarid === ESvar.JA;

  const harSvartPåUformeltGiftSpørsmålet = erUformeltGift?.verdi !== undefined;

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
  };

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmål
        spørsmål={erUformeltGiftSpørsmål(intl)}
        onChange={settErUformeltGift}
        valgtSvar={hentValgtSvar(erUformeltGiftSpørsmål(intl), sivilstatus)}
      />
      {harSvartJaPåUformeltGift && (
        <Alert variant={'info'} inline size={'small'}>
          <LocaleTekst tekst={hentSvarAlertFraSpørsmål(ESvar.JA, erUformeltGiftSpørsmål(intl))} />
        </Alert>
      )}

      {harSvartPåUformeltGiftSpørsmålet && (
        <JaNeiSpørsmål
          spørsmål={erUformeltSeparertEllerSkiltSpørsmål(intl)}
          onChange={settErUformeltSeparertEllerSkilt}
          valgtSvar={hentValgtSvar(erUformeltSeparertEllerSkiltSpørsmål(intl), sivilstatus)}
        />
      )}

      {harSvartJaUformeltSeparertEllerSkilt && (
        <Alert variant={'info'} inline size={'small'}>
          <LocaleTekst
            tekst={hentSvarAlertFraSpørsmål(ESvar.JA, erUformeltSeparertEllerSkiltSpørsmål(intl))}
          />
        </Alert>
      )}
    </VStack>
  );
};
