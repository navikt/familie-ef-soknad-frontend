import {
  ISpørsmålListeFelt,
  ISpørsmålFelt,
  ITekstFelt,
  IDatoFelt,
} from '../../søknad/søknadsfelter';
import { UnderUtdanning } from './utdanning';
import { IArbeidsgiver } from './arbeidsgiver';
import { IArbeidssøker } from './arbeidssøker';
import { IFirma } from './firma';

export interface IAktivitet {
  erIArbeid?: ISpørsmålFelt;
  hvaErDinArbeidssituasjon: ISpørsmålListeFelt;
  etablererEgenVirksomhet?: ISpørsmålFelt;
  arbeidsforhold?: IArbeidsgiver[];
  datoOppstartJobb?: IDatoFelt;
  arbeidssøker?: IArbeidssøker;
  egetAS?: IAksjeselskap[];
  firma?: IFirma;
  firmaer?: IFirma[];
  underUtdanning?: UnderUtdanning;
}

export interface IAksjeselskap {
  id: string;
  navn: ITekstFelt;
  arbeidsmengde?: ITekstFelt;
}

export enum EArbeidssituasjon {
  erDuIArbeid = 'erDuIArbeid',
  hvaErDinArbeidssituasjon = 'hvaErDinArbeidssituasjon',
  etablererEgenVirksomhet = 'etablererEgenVirksomhet',
  datoOppstartJobb = 'datoOppstartJobb',
}

export enum EAktivitet {
  erHjemmeMedBarnUnderEttÅr = 'erHjemmeMedBarnUnderEttÅr',
  erArbeidstakerOgEllerLønnsmottakerFrilanser = 'erArbeidstakerOgEllerLønnsmottakerFrilanser',
  erSelvstendigNæringsdriveneEllerFrilanser = 'erSelvstendigNæringsdriveneEllerFrilanser',
  erAnsattIEgetAS = 'erAnsattIEgetAS',
  etablererEgenVirksomhet = 'etablererEgenVirksomhet',
  erArbeidssøker = 'erArbeidssøker',
  tarUtdanning = 'tarUtdanning',
  harFåttJobbTilbud = 'harFåttJobbTilbud',
  erHverkenIArbeidUtdanningEllerArbeidssøker = 'erHverkenIArbeidUtdanningEllerArbeidssøker',
}

export enum EAksjeselskap {
  navn = 'navn',
  arbeidsmengde = 'arbeidsmengde',
}

export enum ErIArbeid {
  JA = 'JA',
  NeiFordiJegErSyk = 'NeiFordiJegErSyk',
}
