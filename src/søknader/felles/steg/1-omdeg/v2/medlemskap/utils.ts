import { hentTekst } from '../../../../../../utils/søknad';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { UtenlandsoppholdFormState, UtenlandsoppholdValidering } from './typer';

export const opprettTomPeriode = (): UtenlandsoppholdFormState => ({
  id: crypto.randomUUID(),
  periodeLand: '',
  fraDato: undefined,
  tilDato: undefined,
  begrunnelsetekst: '',
  idNummer: '',
  harIkkeIdNummer: false,
  sisteAdresse: '',
});

export const validerPeriode = (
  periode: UtenlandsoppholdFormState,
  valgtLand: ILandMedKode | undefined,
  intl: any
): UtenlandsoppholdValidering => {
  const { fraDato, tilDato, begrunnelsetekst, idNummer, harIkkeIdNummer, sisteAdresse } = periode;

  let skalViseAlert = false;
  let alertTekst = '';
  let harGyldigDatoperiode = false;

  if (fraDato && tilDato) {
    const fraDatoTid = fraDato.getTime();
    const tilDatoTid = tilDato.getTime();

    if (fraDatoTid === tilDatoTid) {
      skalViseAlert = true;
      alertTekst = hentTekst('datovelger.periode.likeDatoer', intl);
    } else if (fraDatoTid > tilDatoTid) {
      skalViseAlert = true;
      alertTekst = hentTekst('datovelger.periode.startFørSlutt', intl);
    } else {
      harGyldigDatoperiode = true;
    }
  }

  const harBegrunnelseTekst = begrunnelsetekst.trim() !== '';
  const erEøsland = valgtLand?.erEøsland ?? false;

  const visHvorforOppholdTextArea = harGyldigDatoperiode && periode.periodeLand !== '';
  const visIdNummerTextfield = visHvorforOppholdTextArea && harBegrunnelseTekst && erEøsland;
  const visSisteAdresseTextfield = harIkkeIdNummer;

  let visLeggTilKnapp = false;
  if (harBegrunnelseTekst) {
    if (!erEøsland) {
      visLeggTilKnapp = true;
    } else if (erEøsland && idNummer.trim() !== '') {
      visLeggTilKnapp = true;
    } else if (harIkkeIdNummer && sisteAdresse.trim() !== '') {
      visLeggTilKnapp = true;
    }
  }

  return {
    skalViseAlert,
    alertTekst,
    harGyldigDatoperiode,
    harBegrunnelseTekst,
    visHvorforOppholdTextArea,
    visIdNummerTextfield,
    visSisteAdresseTextfield,
    visLeggTilKnapp,
  };
};

export const erPeriodeGyldig = (
  periode: UtenlandsoppholdFormState,
  valgtLand: ILandMedKode | undefined
): boolean => {
  const {
    fraDato,
    tilDato,
    begrunnelsetekst,
    idNummer,
    harIkkeIdNummer,
    sisteAdresse,
    periodeLand,
  } = periode;

  if (!fraDato || !tilDato || !periodeLand || begrunnelsetekst.trim() === '') {
    return false;
  }

  if (fraDato.getTime() >= tilDato.getTime()) {
    return false;
  }

  const erEøsland = valgtLand?.erEøsland ?? false;
  if (erEøsland) {
    if (harIkkeIdNummer) {
      return sisteAdresse.trim() !== '';
    } else {
      return idNummer.trim() !== '';
    }
  }

  return true;
};

export const erPerioderGyldige = (
  perioder: UtenlandsoppholdFormState[],
  landListe: ILandMedKode[]
): boolean => {
  return perioder.every((periode) => {
    const valgtLand = landListe.find((land) => land.svar_tekst === periode.periodeLand);
    return erPeriodeGyldig(periode, valgtLand);
  });
};

export const kanLeggeTilNyPeriode = (
  perioder: UtenlandsoppholdFormState[],
  landListe: ILandMedKode[]
): boolean => {
  if (perioder.length === 0) return false;

  const sistePeriode = perioder[perioder.length - 1];
  const valgtLand = landListe.find((land) => land.svar_tekst === sistePeriode.periodeLand);

  return erPeriodeGyldig(sistePeriode, valgtLand);
};
