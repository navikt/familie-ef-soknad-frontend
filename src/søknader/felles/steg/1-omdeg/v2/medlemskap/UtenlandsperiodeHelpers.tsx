export interface Utenlandsopphold {
  id: string;
  periode: {
    fraDato: Date;
    tilDato: Date;
  };
  land: {
    kode: string;
    navn: string;
    erEøsland: boolean;
  };
  begrunnelse: string;
  // EØS-spesifikke felter - kun relevant for EØS-land
  personidentEøsland?: string;
  kanIkkeOppgiPersonident?: boolean;
  adresseEøsland?: string;
}

// Container for alle utenlandsopphold
export interface UtenlandsoppholdData {
  opphold: Utenlandsopphold[];
}

// Form state - matcher nåværende state
export interface UtenlandsoppholdFormState {
  periodeLand: string;
  fraDato: Date | undefined;
  tilDato: Date | undefined;
  begrunnelsetekst: string;
  idNummer: string;
  harIkkeIdNummer: boolean;
  sisteAdresse: string;
}

// Validering hjelper
export interface UtenlandsoppholdValidering {
  readonly erGyldigPeriode: boolean;
  readonly harValgtLand: boolean;
  readonly harBegrunnelse: boolean;
  readonly erKomplettForEøsland: boolean;
  readonly erKlar: boolean;
}

export type NyttUtenlandsopphold = Omit<Utenlandsopphold, 'id'>;

export type OpprettUtenlandsopphold = (
  formState: UtenlandsoppholdFormState,
  valgtLand: { kode: string; navn: string; erEøsland: boolean }
) => NyttUtenlandsopphold;

export interface UtenlandsoppholdHandlers {
  onLeggTil: (opphold: NyttUtenlandsopphold) => void;
  onSlett: (id: string) => void;
  onOppdater: (id: string, opphold: Partial<Utenlandsopphold>) => void;
}
