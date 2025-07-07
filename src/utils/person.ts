import { IPersonDetaljer } from '../models/søknad/person';
import { erDatoGyldigOgInnaforBegrensninger } from '../components/dato/utils';
import { DatoBegrensning } from '../components/dato/Datovelger';

export const harFyltUtSamboerDetaljer = (
  samboerDetaljer: IPersonDetaljer,
  valgfriIdentEllerFødselsdato: boolean
): boolean => {
  const harFyltUtNavn =
    samboerDetaljer?.navn?.verdi !== '' && samboerDetaljer?.navn?.verdi !== undefined;
  const harFyltUtIdent =
    samboerDetaljer?.ident?.verdi !== '' && samboerDetaljer?.ident?.verdi !== undefined;
  const harFyltUtIdentEllerKjennerIkkeIdent = harFyltUtIdent || samboerDetaljer.kjennerIkkeIdent;

  const harFyltUtFødselsdatoEllerIdent = samboerDetaljer.kjennerIkkeIdent
    ? samboerDetaljer.fødselsdato?.verdi !== undefined &&
      erDatoGyldigOgInnaforBegrensninger(
        samboerDetaljer.fødselsdato.verdi,
        DatoBegrensning.TidligereDatoer
      )
    : harFyltUtIdent;

  return valgfriIdentEllerFødselsdato
    ? harFyltUtNavn &&
        harFyltUtIdentEllerKjennerIkkeIdent &&
        erFødselsdatoUtfyltOgGyldigEllerTomtFelt(
          samboerDetaljer.fødselsdato?.verdi,
          DatoBegrensning.TidligereDatoer
        )
    : harFyltUtNavn && harFyltUtFødselsdatoEllerIdent;
};

const erFødselsdatoUtfyltOgGyldigEllerTomtFelt = (
  dato: string | undefined,
  begrensning: DatoBegrensning
) => {
  return dato ? erDatoGyldigOgInnaforBegrensninger(dato, begrensning) : true;
};
