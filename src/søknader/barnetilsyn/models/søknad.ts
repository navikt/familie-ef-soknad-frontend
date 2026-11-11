import type { IAdresseopplysninger } from '../../../models/steg/adresseopplysninger';
import type { IAktivitet } from '../../../models/steg/aktivitet/aktivitet';
import type { IBosituasjon } from '../../../models/steg/bosituasjon';
import type { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import type { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import type { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import type { IPerson, IPersonTilGjenbruk } from '../../../models/søknad/person';
import type { IDatoFelt, ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';

export interface SøknadBarnetilsyn {
    innsendingsdato?: Date;
    person: IPerson;
    søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
    sivilstatus: ISivilstatus;
    medlemskap: IMedlemskap;
    bosituasjon: IBosituasjon;
    aktivitet: IAktivitet;
    søkerFraBestemtMåned?: ISpørsmålBooleanFelt;
    adresseopplysninger?: IAdresseopplysninger;
    søknadsdato?: IDatoFelt;
    dokumentasjonsbehov: IDokumentasjon[];
    harBekreftet: boolean;
    datoPåbegyntSøknad?: string;
    locale: string;
}

export interface ForrigeSøknad {
    sivilstatus: ISivilstatus;
    medlemskap: IMedlemskap;
    bositusjon: IBosituasjon;
    person: IPersonTilGjenbruk;
    locale: string;
}
