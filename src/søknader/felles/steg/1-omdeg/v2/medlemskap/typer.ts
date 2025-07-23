import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';

export interface UtenlandsoppholdFormState {
  id: string;
  periodeLand: string;
  fraDato: Date | undefined;
  tilDato: Date | undefined;
  begrunnelsetekst: string;
  idNummer: string;
  harIkkeIdNummer: boolean;
  sisteAdresse: string;
}

export interface UtenlandsoppholdValidering {
  skalViseAlert: boolean;
  alertTekst: string;
  harGyldigDatoperiode: boolean;
  harBegrunnelseTekst: boolean;
  visHvorforOppholdTextArea: boolean;
  visIdNummerTextfield: boolean;
  visSisteAdresseTextfield: boolean;
  visLeggTilKnapp: boolean;
}

export interface UtenlandsoppholdSkjemaProps {
  periode: UtenlandsoppholdFormState;
  periodeIndex: number;
  totaltAntallPerioder: number;
  landListe: ILandMedKode[];
  intl: any;
  nårOppholdtSøkerSegIUtlandetSpørsmål: StegSpørsmål;
  onOppdater: (oppdateringer: Partial<UtenlandsoppholdFormState>) => void;
  onLandEndring: (land: string) => void;
  onSlett: () => void;
  onLeggTilNy: () => void;
}
