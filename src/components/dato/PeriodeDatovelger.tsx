import { FC, useEffect, useState } from 'react';
import Feilmelding from '../feil/Feilmelding';
import { EPeriode, IPeriode } from '../../models/felles/periode';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import LesMerTekst from '../LesMerTekst';
import styled from 'styled-components';
import FeltGruppe from '../gruppe/FeltGruppe';
import KomponentGruppe from '../gruppe/KomponentGruppe';
import {
  erDatoerLike,
  erDatoInnenforBegrensing,
  erFraDatoSenereEnnTilDato,
  hentStartOgSluttDato,
} from './gyldigeDatoerUtils';
import { erGyldigDato } from '../../utils/dato';
import { Label } from '@navikt/ds-react';
import { GyldigeDatoer, Datovelger } from './Datovelger';

const PeriodeGruppe = styled.div`
  display: grid;
  grid-template-columns: repeat(2, min-content);
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
  className?: string;
  tekst: string;
  hjelpetekst?: IHjelpetekst;
  periode: IPeriode;
  fomTekstid?: string;
  tomTekstid?: string;
  settDato: (objektnøkkel: EPeriode, dato?: string) => void;
  datobegrensning: GyldigeDatoer;
  onValidate?: (isValid: boolean) => void;
}

const PeriodeDatovelgere: FC<Props> = ({
  className,
  periode,
  hjelpetekst,
  settDato,
  tekst,
  fomTekstid,
  tomTekstid,
  datobegrensning,
  onValidate,
}) => {
  const [feilmelding, settFeilmelding] = useState<string>('');

  const sammenlignDatoerOgHentFeilmelding = (
    periode: IPeriode,
    datobegrensning: GyldigeDatoer
  ): string => {
    const { startDato, sluttDato } = hentStartOgSluttDato(periode);
    const { fra, til } = periode;
    const erStartDatoUtenforBegrensninger: boolean =
      fra.verdi !== '' && !erDatoInnenforBegrensing(fra.verdi, datobegrensning);
    const erSluttUtenforBegrensninger: boolean =
      til.verdi !== '' && !erDatoInnenforBegrensing(til.verdi, datobegrensning);

    if (
      (fra.verdi !== '' && !erGyldigDato(fra.verdi)) ||
      (til.verdi !== '' && !erGyldigDato(til.verdi))
    )
      return 'datovelger.periode.ugyldigDato';
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
      return 'datovelger.periode.likeDatoer';
    else if (startDato && sluttDato && !erFraDatoSenereEnnTilDato(startDato, sluttDato))
      return 'datovelger.periode.startFørSlutt';
    else return '';
  };

  useEffect(() => {
    const harStartEllerSluttDato = periode.fra.verdi !== '' || periode.til.verdi !== '';

    harStartEllerSluttDato &&
      settFeilmelding(sammenlignDatoerOgHentFeilmelding(periode, datobegrensning));

    if (onValidate && feilmelding !== '') onValidate(true);
    if (onValidate && feilmelding === '') onValidate(false);
  }, [feilmelding, onValidate, periode, datobegrensning]);

  const settPeriode = (objektnøkkel: EPeriode, dato?: string) => {
    settDato(objektnøkkel, dato);
  };

  return (
    <KomponentGruppe className={className}>
      <FeltGruppe>
        <Label as="p">{tekst}</Label>
        {hjelpetekst && (
          <LesMerTekst
            åpneTekstid={hjelpetekst.headerTekstid}
            innholdTekstid={hjelpetekst.innholdTekstid}
          />
        )}
      </FeltGruppe>
      <PeriodeGruppe className="periodegruppe" aria-live="polite">
        <Datovelger
          settDato={(e) => settPeriode(EPeriode.fra, e)}
          valgtDato={periode.fra.verdi}
          tekstid={fomTekstid ? fomTekstid : 'periode.fra'}
          datobegrensning={datobegrensning}
        />

        <Datovelger
          settDato={(e) => settPeriode(EPeriode.til, e)}
          valgtDato={periode.til.verdi}
          tekstid={tomTekstid ? tomTekstid : 'periode.til'}
          datobegrensning={datobegrensning}
        />
        {feilmelding && feilmelding !== '' && (
          <Feilmelding className={'feilmelding'} tekstid={feilmelding} />
        )}
      </PeriodeGruppe>
    </KomponentGruppe>
  );
};

export default PeriodeDatovelgere;
