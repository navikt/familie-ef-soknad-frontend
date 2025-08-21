import { FC, useEffect, useState } from 'react';
import Feilmelding from '../feil/Feilmelding';
import { EPeriode, IPeriode } from '../../models/felles/periode';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import LesMerTekst from '../LesMerTekst';
import {
  erDatoerLike,
  erDatoInnenforBegrensing,
  erFraDatoSenereEnnTilDato,
  hentStartOgSluttDato,
} from '../../utils/gyldigeDatoerUtils';
import { erGyldigDato } from '../../utils/dato';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { Datovelger } from './Datovelger';
import { GyldigeDatoer } from './GyldigeDatoer';

interface Props {
  className?: string;
  tekst: string;
  hjelpetekst?: IHjelpetekst;
  periode: IPeriode;
  fomTekstid?: string;
  tomTekstid?: string;
  settDato: (objektnøkkel: EPeriode, dato?: string) => void;
  gyldigeDatoer: GyldigeDatoer;
  onValidate?: (isValid: boolean) => void;
}

export const PeriodeDatovelgere: FC<Props> = ({
  periode,
  hjelpetekst,
  settDato,
  tekst,
  fomTekstid,
  tomTekstid,
  gyldigeDatoer,
  onValidate,
}) => {
  const [feilmelding, settFeilmelding] = useState<string>('');

  const sammenlignDatoerOgHentFeilmelding = (
    periode: IPeriode,
    gyldigeDatoer: GyldigeDatoer
  ): string => {
    const { startDato, sluttDato } = hentStartOgSluttDato(periode);
    const { fra, til } = periode;
    const erStartDatoUtenforBegrensninger: boolean =
      fra.verdi !== '' && !erDatoInnenforBegrensing(fra.verdi, gyldigeDatoer);
    const erSluttUtenforBegrensninger: boolean =
      til.verdi !== '' && !erDatoInnenforBegrensing(til.verdi, gyldigeDatoer);

    if (
      (fra.verdi !== '' && !erGyldigDato(fra.verdi)) ||
      (til.verdi !== '' && !erGyldigDato(til.verdi))
    )
      return 'datovelger.periode.ugyldigDato';
    else if (
      (erStartDatoUtenforBegrensninger || erSluttUtenforBegrensninger) &&
      gyldigeDatoer === GyldigeDatoer.Tidligere
    )
      return 'datovelger.ugyldigDato.kunTidligereDatoer';
    else if (
      (erStartDatoUtenforBegrensninger || erSluttUtenforBegrensninger) &&
      gyldigeDatoer === GyldigeDatoer.Fremtidige
    )
      return 'datovelger.ugyldigDato.kunFremtidigeDatoer';
    else if (startDato && sluttDato && erDatoerLike(startDato, sluttDato))
      return 'datovelger.periode.likeDatoer';
    else if (startDato && sluttDato && !erFraDatoSenereEnnTilDato(startDato, sluttDato))
      return 'datovelger.periode.startFørSlutt';
    else return '';
  };

  useEffect(() => {
    const harStartEllerSluttDato = periode.fra.verdi !== '' || periode.til.verdi !== '';

    harStartEllerSluttDato &&
      settFeilmelding(sammenlignDatoerOgHentFeilmelding(periode, gyldigeDatoer));

    if (onValidate && feilmelding !== '') onValidate(true);
    if (onValidate && feilmelding === '') onValidate(false);
  }, [feilmelding, onValidate, periode, gyldigeDatoer]);

  const settPeriode = (objektnøkkel: EPeriode, dato?: string) => {
    settDato(objektnøkkel, dato);
  };

  return (
    <VStack gap={'6'}>
      <VStack>
        <Heading size={'xsmall'}>{tekst}</Heading>
        {hjelpetekst && (
          <LesMerTekst
            åpneTekstid={hjelpetekst.headerTekstid}
            innholdTekstid={hjelpetekst.innholdTekstid}
          />
        )}
      </VStack>

      <HStack gap={'6'}>
        <Datovelger
          settDato={(e) => settPeriode(EPeriode.fra, e)}
          valgtDato={periode.fra.verdi}
          tekstid={fomTekstid ? fomTekstid : 'periode.fra'}
          gyldigeDatoer={gyldigeDatoer}
        />

        <Datovelger
          settDato={(e) => settPeriode(EPeriode.til, e)}
          valgtDato={periode.til.verdi}
          tekstid={tomTekstid ? tomTekstid : 'periode.til'}
          gyldigeDatoer={gyldigeDatoer}
        />
      </HStack>

      {feilmelding && feilmelding !== '' && (
        <Feilmelding className={'feilmelding'} tekstid={feilmelding} />
      )}
    </VStack>
  );
};
