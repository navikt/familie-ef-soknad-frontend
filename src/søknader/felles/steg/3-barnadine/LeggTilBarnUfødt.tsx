import React from 'react';
import { ESvar } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { erDatoGyldigOgInnenforBegrensning } from '../../../../utils/gyldigeDatoerUtils';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Alert, VStack } from '@navikt/ds-react';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import JaNeiSpørsmål from '../../../../components/spørsmål/JaNeiSpørsmål';
import { skalBarnetBoHosSøker } from './BarneConfig';

interface Props {
  settBo: (nyttBo: string) => void;
  boHosDeg: string;
  settDato: (date: string) => void;
  barnDato: string;
}

export const LeggTilBarnUfødt: React.FC<Props> = ({ settBo, boHosDeg, settDato, barnDato }) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="space-24">
      <VStack gap="space-16">
        <Datovelger
          settDato={(e) => settDato(e)}
          valgtDato={barnDato}
          tekstid={'barnadine.termindato'}
          gyldigeDatoer={GyldigeDatoer.Fremtidige}
        />

        <Alert variant={'info'} size={'small'} inline>
          {hentTekst('barnadine.info.terminbekreftelse', intl)}
        </Alert>
      </VStack>
      {barnDato && erDatoGyldigOgInnenforBegrensning(barnDato, GyldigeDatoer.Fremtidige) && (
        <VStack gap="space-16">
          <JaNeiSpørsmål
            spørsmål={skalBarnetBoHosSøker(intl)}
            onChange={(_, svar) => settBo(svar.id)}
            valgtSvar={boHosDeg === ESvar.JA ? true : boHosDeg === ESvar.NEI ? false : undefined}
          />
          {boHosDeg === ESvar.NEI && (
            <Alert size="small" variant="warning" inline>
              {hentTekst('barnadine.advarsel.skalikkebo', intl)}
            </Alert>
          )}
        </VStack>
      )}
    </VStack>
  );
};
