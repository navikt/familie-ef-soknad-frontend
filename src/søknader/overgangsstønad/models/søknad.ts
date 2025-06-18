import { IAktivitet } from '../../../models/steg/aktivitet/aktivitet';
import { IPerson } from '../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';
import { IBosituasjon } from '../../../models/steg/bosituasjon';
import { IDinSituasjon } from '../../../models/steg/dinsituasjon/meromsituasjon';
import { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import { IAdresseopplysninger } from '../../../models/steg/adresseopplysninger';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';

// TODO: Fjern skalBehandlesINySaksbehandling
export interface SøknadOvergangsstønad {
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
