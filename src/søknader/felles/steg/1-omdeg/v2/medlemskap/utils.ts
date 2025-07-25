import { hentTekst } from '../../../../../../utils/søknad';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { UtenlandsoppholdPeriode, PeriodeVisningsregler } from './typer';

export const opprettTomPeriode = (): UtenlandsoppholdPeriode => ({
  id: crypto.randomUUID(), // TODO: Denne trengs muligens ikke, bare glem den.
  land: '',
  fraDato: undefined,
  tilDato: undefined,
  begrunnelse: '',
  idNummer: '',
  harIkkeIdNummer: false,
  sisteAdresse: '',
});

export const finnLand = (landKode: string, landListe: ILandMedKode[]): ILandMedKode | undefined => {
  return landListe.find((land) => land.svar_tekst === landKode);
};

export const validerDatoperiode = (
  fraDato: Date | undefined,
  tilDato: Date | undefined,
  intl: any
) => {
  if (!fraDato || !tilDato) {
    return { erGyldig: false, feilmelding: '' };
  }

  if (fraDato.getTime() === tilDato.getTime()) {
    return {
      erGyldig: false,
      feilmelding: hentTekst('datovelger.periode.likeDatoer', intl),
    };
  }

  if (fraDato.getTime() > tilDato.getTime()) {
    return {
      erGyldig: false,
      feilmelding: hentTekst('datovelger.periode.startFørSlutt', intl),
    };
  }

  return { erGyldig: true, feilmelding: '' };
};

export const utledVisningsregler = (
  periode: UtenlandsoppholdPeriode,
  valgtLand: ILandMedKode | undefined,
  intl: any
): PeriodeVisningsregler => {
  const { fraDato, tilDato, begrunnelse, harIkkeIdNummer } = periode;
  const datoValidering = validerDatoperiode(fraDato, tilDato, intl);

  const harGyldigePeriodeData = datoValidering.erGyldig && periode.land !== '';
  const harBegrunnelse = begrunnelse.trim() !== '';
  const erEøsLand = valgtLand?.erEøsland ?? false;

  return {
    skalViseBegrunnelse: harGyldigePeriodeData,
    skalViseIdNummer: harGyldigePeriodeData && harBegrunnelse && erEøsLand,
    skalViseSisteAdresse: harIkkeIdNummer,
    skalViseAlert: !datoValidering.erGyldig && datoValidering.feilmelding !== '',
    alertTekst: datoValidering.feilmelding,
  };
};

export const erPeriodeUtfylt = (
  periode: UtenlandsoppholdPeriode,
  valgtLand: ILandMedKode | undefined
): boolean => {
  const { fraDato, tilDato, land, begrunnelse, idNummer, harIkkeIdNummer, sisteAdresse } = periode;

  if (!fraDato || !tilDato || !land || !begrunnelse.trim()) {
    return false;
  }

  const datoValidering = validerDatoperiode(fraDato, tilDato, {});
  if (!datoValidering.erGyldig) {
    return false;
  }

  const erEøsLand = valgtLand?.erEøsland ?? false;
  if (erEøsLand) {
    if (harIkkeIdNummer) {
      return sisteAdresse.trim() !== '';
    }
    return idNummer.trim() !== '';
  }

  return true;
};

export const kanLeggeTilNyPeriode = (
  perioder: UtenlandsoppholdPeriode[],
  landListe: ILandMedKode[]
): boolean => {
  if (perioder.length === 0) return false;

  return perioder.every((periode) => {
    const valgtLand = finnLand(periode.land, landListe);
    return erPeriodeUtfylt(periode, valgtLand);
  });
};
