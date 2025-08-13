import { IPersonDetaljer } from '../models/søknad/person';
import { erDatoGyldigOgInnenforBegrensning } from './gyldigeDatoerUtils';
import { GyldigeDatoer } from '../components/dato/Datovelger';

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
      erDatoGyldigOgInnenforBegrensning(samboerDetaljer.fødselsdato.verdi, GyldigeDatoer.tidligere)
    : harFyltUtIdent;

  return valgfriIdentEllerFødselsdato
    ? harFyltUtNavn &&
        harFyltUtIdentEllerKjennerIkkeIdent &&
        erFødselsdatoUtfyltOgGyldigEllerTomtFelt(
          samboerDetaljer.fødselsdato?.verdi,
          GyldigeDatoer.tidligere
        )
    : harFyltUtNavn && harFyltUtFødselsdatoEllerIdent;
};

const erFødselsdatoUtfyltOgGyldigEllerTomtFelt = (
  dato: string | undefined,
  begrensning: GyldigeDatoer
) => {
  return dato ? erDatoGyldigOgInnenforBegrensning(dato, begrensning) : true;
};
