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

  // Dato validering
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

  // Kondisjonal visning
  const visHvorforOppholdTextArea = harGyldigDatoperiode && periode.periodeLand !== '';
  const visIdNummerTextfield = visHvorforOppholdTextArea && harBegrunnelseTekst && erEøsland;
  const visSisteAdresseTextfield = harIkkeIdNummer;

  // Legg til knapp logic
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
