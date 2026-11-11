import type { UnderUtdanning } from '../../../models/steg/aktivitet/utdanning';
import type { ITekstFelt } from '../../../models/søknad/søknadsfelter';

export interface DetaljertUtdanning extends UnderUtdanning {
    semesteravgift?: ITekstFelt;
    studieavgift?: ITekstFelt;
    eksamensgebyr?: ITekstFelt;
}
