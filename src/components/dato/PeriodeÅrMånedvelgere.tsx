import { FC, useEffect, useState } from 'react';
import { GyldigeDatoer } from './Datovelger';
import Feilmelding from '../feil/Feilmelding';
import { erGyldigDato, strengTilDato } from '../../utils/dato';
import { EPeriode, IPeriode } from '../../models/felles/periode';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import LesMerTekst from '../LesMerTekst';
import styled from 'styled-components';
import FeltGruppe from '../gruppe/FeltGruppe';
import MånedÅrVelger from './MånedÅrVelger';
import {
  erDatoerLike,
  erDatoInnaforBegrensinger,
  erFraDatoSenereEnnTilDato,
  hentStartOgSluttDato,
} from './gyldigeDatoerUtils';
import { Label } from '@navikt/ds-react';

const PeriodeGruppe = styled.div`
  display: grid;
  grid-template-columns: repeat(2, min-content);
  grid-template-rows: repeat(2, min-content);
  grid-gap: 2rem;

  .feilmelding {
    grid-column: 1/3;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 2rem;

    .feilmelding {
      grid-column: 1/2;
    }
  }
`;

interface Props {
  tekst: string;
  hjelpetekst?: IHjelpetekst;
  periode: IPeriode;
  fomTekstid?: string;
  tomTekstid?: string;
  settDato: (dato: Date | null, objektnøkkel: EPeriode) => void;
  datobegrensing: GyldigeDatoer;
  onValidate?: (isValid: boolean) => void;
  testIder?: string[];
}

const PeriodeÅrMånedvelgere: FC<Props> = ({
  periode,
  hjelpetekst,
  settDato,
  tekst,
  fomTekstid,
  tomTekstid,
  datobegrensing,
  onValidate,
  testIder,
}) => {
  const [feilmelding, settFeilmelding] = useState('');

  const sammenlignDatoerOgHentFeilmelding = (
    periode: IPeriode,
    datobegrensning: GyldigeDatoer
  ): string => {
    const { startDato, sluttDato } = hentStartOgSluttDato(periode);
    const { fra, til } = periode;

    const erStartDatoUtenforBegrensninger: boolean =
      fra.verdi !== '' && !erDatoInnaforBegrensinger(fra.verdi, datobegrensning);
    const erSluttUtenforBegrensninger: boolean =
      til.verdi !== '' && !erDatoInnaforBegrensinger(til.verdi, datobegrensning);

    if (
      (fra.verdi !== '' && !erGyldigDato(fra.verdi)) ||
      (til.verdi !== '' && !erGyldigDato(til.verdi))
    )
      return 'datovelger.periode.feilFormatMndÅr';
    else if (
      (erStartDatoUtenforBegrensninger || erSluttUtenforBegrensninger) &&
      datobegrensning === GyldigeDatoer.tidligere
    )
      return 'datovelger.ugyldigDato.kunTidligereDatoer';
    else if (
      (erStartDatoUtenforBegrensninger || erSluttUtenforBegrensninger) &&
      datobegrensning === GyldigeDatoer.fremtidige
    )
      return 'datovelger.ugyldigDato.kunFremtidigeDatoer';
    else if (startDato && sluttDato && erDatoerLike(startDato, sluttDato))
      return 'datovelger.periode.likMndÅr';
    else if (startDato && sluttDato && !erFraDatoSenereEnnTilDato(startDato, sluttDato))
      return 'datovelger.periode.startMndÅrFørSluttMndÅr';
    else return '';
  };

  useEffect(() => {
    const harStartEllerSluttDato = periode.fra.verdi !== '' || periode.til.verdi !== '';

    harStartEllerSluttDato &&
      settFeilmelding(sammenlignDatoerOgHentFeilmelding(periode, datobegrensing));
    if (onValidate && feilmelding !== '') onValidate(true);
    if (onValidate && feilmelding === '') onValidate(false);
  }, [feilmelding, periode, datobegrensing, onValidate]);

  const settPeriode = (dato: Date | null, objektnøkkel: EPeriode) => {
    settDato(dato, objektnøkkel);
  };

  return (
    <>
      <FeltGruppe>
        <Label as="p">{tekst}</Label>
        {hjelpetekst && (
          <LesMerTekst
            åpneTekstid={hjelpetekst.headerTekstid}
            innholdTekstid={hjelpetekst.innholdTekstid}
          />
        )}
      </FeltGruppe>
      <PeriodeGruppe aria-live="polite">
        <>
          <MånedÅrVelger
            settDato={(e) => settPeriode(e, EPeriode.fra)}
            valgtDato={
              periode.fra.verdi && periode.fra.verdi !== ''
                ? strengTilDato(periode.fra.verdi)
                : undefined
            }
            tekstid={fomTekstid ? fomTekstid : 'periode.fra'}
            datobegrensning={datobegrensing}
            testId={testIder ? testIder[0] : ''}
          />

          <MånedÅrVelger
            settDato={(e) => settPeriode(e, EPeriode.til)}
            valgtDato={
              periode.til.verdi && periode.til.verdi !== ''
                ? strengTilDato(periode.til.verdi)
                : undefined
            }
            tekstid={tomTekstid ? tomTekstid : 'periode.til'}
            datobegrensning={datobegrensing}
            testId={testIder ? testIder[1] : ''}
          />
        </>
        {feilmelding && feilmelding !== '' && (
          <Feilmelding className={'feilmelding'} tekstid={feilmelding} />
        )}
      </PeriodeGruppe>
    </>
  );
};

export default PeriodeÅrMånedvelgere;
