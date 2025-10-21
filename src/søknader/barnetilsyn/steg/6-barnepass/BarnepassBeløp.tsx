import React, { FC } from 'react';
import InputLabelGruppe from '../../../../components/gruppe/InputLabelGruppe';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { BarnepassOrdning, EBarnepass, ETypeBarnepassOrdning } from '../../models/barnepass';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { erStrengGyldigTall } from '../../../../utils/autentiseringogvalidering/feltvalidering';
import { Detail, VStack } from '@navikt/ds-react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

interface Props {
  barnepassOrdning: BarnepassOrdning;
  settInputFelt: (e: React.FormEvent<HTMLInputElement>, nøkkel: string, label: string) => void;
  barnIndeks: number;
}
export const BarnepassBeløp: FC<Props> = ({ barnepassOrdning, settInputFelt, barnIndeks }) => {
  const intl = useLokalIntlContext();
  const beløp = barnepassOrdning.belop ? barnepassOrdning.belop.verdi : '';
  const beløpLabel = hentTekst('barnepass.label.beløp', intl);
  const alertstripeTekst =
    barnepassOrdning.hvaSlagsBarnepassOrdning?.svarid === ETypeBarnepassOrdning.barnehageOgLiknende
      ? 'barnepass.alert-dokumentasjon.beløp.barnehageOgLiknende'
      : 'barnepass.alert-dokumentasjon.beløp.privat';

  return (
    <VStack gap={'4'}>
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
        testId={`beløp-barn-${barnIndeks}`}
      />
      {!erStrengGyldigTall(beløp) && barnepassOrdning.belop && (
        <Detail>{hentTekst('feil.ugyldigTall.beløp', intl)}</Detail>
      )}
      <AlertStripeDokumentasjon>{hentHTMLTekst(alertstripeTekst, intl)}</AlertStripeDokumentasjon>
    </VStack>
  );
};
