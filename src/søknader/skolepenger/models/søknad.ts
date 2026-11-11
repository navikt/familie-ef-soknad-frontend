import type { IAdresseopplysninger } from '../../../models/steg/adresseopplysninger';
import type { IBosituasjon } from '../../../models/steg/bosituasjon';
import type { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import type { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import type { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import type { IPerson } from '../../../models/søknad/person';
import type { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';
import type { DetaljertUtdanning } from './detaljertUtdanning';

export interface SøknadSkolepenger {
    innsendingsdato?: Date;
    person: IPerson;
    søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
    adresseopplysninger?: IAdresseopplysninger;
    sivilstatus: ISivilstatus;
    medlemskap: IMedlemskap;
    bosituasjon: IBosituasjon;
    utdanning: DetaljertUtdanning;
    dokumentasjonsbehov: IDokumentasjon[];
    harBekreftet: boolean;
    locale: string;
}
