import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';

export interface UtenlandsoppholdPeriode {
  id: string;
  land: string;
  fraDato: Date | undefined;
  tilDato: Date | undefined;
  begrunnelse: string;
  idNummer: string;
  harIkkeIdNummer: boolean;
  sisteAdresse: string;
}

export interface PeriodeVisningsregler {
  skalViseBegrunnelse: boolean;
  skalViseIdNummer: boolean;
  skalViseSisteAdresse: boolean;
  skalViseAlert: boolean;
  alertTekst: string;
}

export interface SkjemaProps {
  periode: UtenlandsoppholdPeriode;
  periodeNummer: number;
  totalAntallPerioder: number;
  landListe: ILandMedKode[];
  intl: any;
  spørsmål: StegSpørsmål;
  onOppdater: (oppdateringer: Partial<UtenlandsoppholdPeriode>) => void;
  onSlett: () => void;
}
