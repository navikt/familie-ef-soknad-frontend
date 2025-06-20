import { IPersonDetaljer } from '../models/søknad/person';
import { erDatoGyldigOgInnaforBegrensninger } from '../components/dato/utils';
import { DatoBegrensning } from '../components/dato/Datovelger';

export const harFyltUtSamboerDetaljer = (
  samboerDetaljer: IPersonDetaljer,
  valgfriIdentEllerFødselsdato: boolean
): boolean => {
  const harFyltUtFødselsdatoEllerIdent = samboerDetaljer.kjennerIkkeIdent
    ? samboerDetaljer.fødselsdato?.verdi !== undefined &&
      erDatoGyldigOgInnaforBegrensninger(
        samboerDetaljer.fødselsdato.verdi,
        DatoBegrensning.TidligereDatoer
      )
    : samboerDetaljer?.ident?.verdi !== '' && samboerDetaljer?.ident?.verdi !== undefined;

  return valgfriIdentEllerFødselsdato
    ? samboerDetaljer?.navn?.verdi !== '' &&
        samboerDetaljer?.navn?.verdi !== undefined &&
        erFødselsdatoUtfyltOgGyldigEllerTomtFelt(
          samboerDetaljer.fødselsdato?.verdi,
          DatoBegrensning.TidligereDatoer
        )
    : harFyltUtFødselsdatoEllerIdent &&
        samboerDetaljer?.navn?.verdi !== '' &&
        samboerDetaljer?.navn?.verdi !== undefined;
};

export const erFødselsdatoUtfyltOgGyldigEllerTomtFelt = (
  dato: string | undefined,
  begrensning: DatoBegrensning
) => {
  return dato ? erDatoGyldigOgInnaforBegrensninger(dato, begrensning) : true;
};
