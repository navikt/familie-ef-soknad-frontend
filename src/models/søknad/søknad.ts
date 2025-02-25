import { IAktivitet } from '../steg/aktivitet/aktivitet';
import { IPerson } from './person';
import { ISpørsmålBooleanFelt } from './søknadsfelter';
import { IBosituasjon } from '../steg/bosituasjon';
import { IDinSituasjon } from '../steg/dinsituasjon/meromsituasjon';
import { ISivilstatus } from '../steg/omDeg/sivilstatus';
import { IMedlemskap } from '../steg/omDeg/medlemskap';
import { IDokumentasjon } from '../steg/dokumentasjon';
import { IAdresseopplysninger } from '../steg/adresseopplysninger';
import { ISpørsmål, ISvar } from '../felles/spørsmålogsvar';

export interface ISøknad {
  innsendingsdato?: Date;
  person: IPerson;
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
  adresseopplysninger?: IAdresseopplysninger;
  sivilstatus: ISivilstatus;
  medlemskap: IMedlemskap;
  bosituasjon: IBosituasjon;
  aktivitet: IAktivitet;
  merOmDinSituasjon: IDinSituasjon;
  dokumentasjonsbehov: IDokumentasjon[];
  harBekreftet: boolean;
  locale: any;
  skalBehandlesINySaksbehandling?: boolean;
  datoPåbegyntSøknad?: string;
}

export enum ESøknad {
  søkerBorPåRegistrertAdresse = 'søkerBorPåRegistrertAdresse',
  årsakSøkerBorIkkePåRegistrertAdresse = 'årsakSøkerBorIkkePåRegistrertAdresse',
}

export interface LocationStateSøknad {
  kommerFraOppsummering?: boolean;
}

export type SettDokumentasjonsbehovBarn = (
  spørsmål: ISpørsmål,
  valgtSvar: ISvar,
  barneid: string,
  barnapassid?: string
) => void;
