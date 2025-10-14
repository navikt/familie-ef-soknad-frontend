import { FC, useEffect, useState } from 'react';
import Feilmelding from '../feil/Feilmelding';
import { erGyldigDato, strengTilDato } from '../../utils/dato';
import { EPeriode, IPeriode } from '../../models/felles/periode';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import styled from 'styled-components';
import FeltGruppe from '../gruppe/FeltGruppe';
import MånedÅrVelger from './MånedÅrVelger';
import {
  erDatoerLike,
  erDatoInnenforBegrensing,
  erFraDatoSenereEnnTilDato,
  hentStartOgSluttDato,
} from '../../utils/gyldigeDatoerUtils';
import { Label } from '@navikt/ds-react';
import { GyldigeDatoer } from './GyldigeDatoer';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

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
  gyldigeDatoer: GyldigeDatoer;
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
  gyldigeDatoer,
  onValidate,
  testIder,
}) => {
  const [feilmelding, settFeilmelding] = useState('');

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
      return 'datovelger.periode.feilFormatMndÅr';
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
      return 'datovelger.periode.likMndÅr';
    else if (startDato && sluttDato && !erFraDatoSenereEnnTilDato(startDato, sluttDato))
      return 'datovelger.periode.startMndÅrFørSluttMndÅr';
    else return '';
  };

  useEffect(() => {
    const harStartEllerSluttDato = periode.fra.verdi !== '' || periode.til.verdi !== '';

    harStartEllerSluttDato &&
      settFeilmelding(sammenlignDatoerOgHentFeilmelding(periode, gyldigeDatoer));
    if (onValidate && feilmelding !== '') onValidate(true);
    if (onValidate && feilmelding === '') onValidate(false);
  }, [feilmelding, periode, gyldigeDatoer, onValidate]);

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
            gyldigeDatoer={gyldigeDatoer}
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
            gyldigeDatoer={gyldigeDatoer}
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
