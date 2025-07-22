import React, { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import InputLabelGruppe from '../../../../components/gruppe/InputLabelGruppe';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { EBarnepass, ETypeBarnepassOrdning, IBarnepassOrdning } from '../../models/barnepass';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { erStrengGyldigTall } from '../../../../utils/autentiseringogvalidering/feltvalidering';
import { Detail } from '@navikt/ds-react';

interface Props {
  barnepassOrdning: IBarnepassOrdning;
  settInputFelt: (e: React.FormEvent<HTMLInputElement>, nøkkel: string, label: string) => void;
}
const BarnepassBeløp: FC<Props> = ({ barnepassOrdning, settInputFelt }) => {
  const intl = useLokalIntlContext();
  const beløp = barnepassOrdning.belop ? barnepassOrdning.belop.verdi : '';
  const beløpLabel = hentTekst('barnepass.label.beløp', intl);
  const alertstripeTekst =
    barnepassOrdning.hvaSlagsBarnepassOrdning?.svarid === ETypeBarnepassOrdning.barnehageOgLiknende
      ? 'barnepass.alert-dokumentasjon.beløp.barnehageOgLiknende'
      : 'barnepass.alert-dokumentasjon.beløp.privat';

  return (
    <KomponentGruppe>
      <FeltGruppe>
        <InputLabelGruppe
          label={hentTekst('barnepass.label.beløp', intl)}
          nøkkel={EBarnepass.belop}
          type={'text'}
          hjelpetekst={{
            innholdTekstid: 'barnepass.hjelpetekst-innhold.beløp',
            headerTekstid: 'barnepass.hjelpetekst-åpne.beløp',
          }}
          bredde={'XS'}
          settInputFelt={(e) => settInputFelt(e, EBarnepass.belop, beløpLabel)}
          beskrivendeTekst={hentTekst('input.kroner', intl)}
          value={beløp}
        />
      </FeltGruppe>
      {!erStrengGyldigTall(beløp) && barnepassOrdning.belop && (
        <FeltGruppe>
          <Detail>{hentTekst('feil.ugyldigTall.beløp', intl)}</Detail>
        </FeltGruppe>
      )}
      <FeltGruppe>
        <AlertStripeDokumentasjon>{hentHTMLTekst(alertstripeTekst, intl)}</AlertStripeDokumentasjon>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default BarnepassBeløp;
