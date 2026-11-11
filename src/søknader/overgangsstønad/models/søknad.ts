import type { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import type { IAdresseopplysninger } from '../../../models/steg/adresseopplysninger';
import type { IAktivitet } from '../../../models/steg/aktivitet/aktivitet';
import type { IBosituasjon } from '../../../models/steg/bosituasjon';
import type { IDinSituasjon } from '../../../models/steg/dinsituasjon/meromsituasjon';
import type { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import type { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import type { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import type { IPerson } from '../../../models/søknad/person';
import type { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';

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
