import { UnderUtdanning } from '../../../models/steg/aktivitet/utdanning';
import { ITekstFelt } from '../../../models/søknad/søknadsfelter';

export interface DetaljertUtdanning extends UnderUtdanning {
  semesteravgift?: ITekstFelt;
  studieavgift?: ITekstFelt;
  eksamensgebyr?: ITekstFelt;
}
