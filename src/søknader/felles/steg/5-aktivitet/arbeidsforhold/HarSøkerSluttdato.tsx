import React from 'react';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { harDuSluttdato } from './ArbeidsgiverConfig';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { Datovelger } from '../../../../../components/dato/Datovelger';
import { EArbeidsgiver, IArbeidsgiver } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import { VStack } from '@navikt/ds-react';

interface Props {
  arbeidsgiver: IArbeidsgiver;
  settArbeidsgiver: (arbeidsgiver: IArbeidsgiver) => void;
}

export const HarSøkerSluttdato: React.FC<Props> = ({ arbeidsgiver, settArbeidsgiver }) => {
  const intl = useLokalIntlContext();

  const settDato = (dato: string) => {
    dato !== null &&
      settArbeidsgiver({
        ...arbeidsgiver,
        [EArbeidsgiver.sluttdato]: {
          label: hentTekst(sluttdatoTekstid, intl),
          verdi: dato,
        },
      });
  };

  const settHarSluttDato = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    const harSluttDatoFelt = {
      spørsmålid: spørsmål.søknadid,
      svarid: valgtSvar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar,
    };
    if (svar === false && arbeidsgiver.sluttdato) {
      const endretArbeidsgiver = arbeidsgiver;
      delete endretArbeidsgiver.sluttdato;
      settArbeidsgiver({
        ...endretArbeidsgiver,
        [EArbeidsgiver.harSluttDato]: harSluttDatoFelt,
      });
    } else {
      settArbeidsgiver({
        ...arbeidsgiver,
        [EArbeidsgiver.harSluttDato]: harSluttDatoFelt,
      });
    }
  };

  const sluttdatoTekstid = 'arbeidsforhold.datovelger.sluttdato';

  return (
    <VStack gap={'4'}>
      <JaNeiSpørsmål
        spørsmål={harDuSluttdato(intl)}
        onChange={settHarSluttDato}
        valgtSvar={arbeidsgiver.harSluttDato?.verdi}
      />
      {arbeidsgiver.harSluttDato?.verdi === true && (
        <Datovelger
          valgtDato={arbeidsgiver.sluttdato?.verdi}
          tekstid={sluttdatoTekstid}
          gyldigeDatoer={GyldigeDatoer.Fremtidige}
          settDato={(e) => settDato(e)}
        />
      )}
    </VStack>
  );
};
