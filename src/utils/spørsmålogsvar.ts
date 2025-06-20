import { ESvar, ISvar } from '../models/felles/spørsmålogsvar';
import { ISpørsmålListeFelt } from '../models/søknad/søknadsfelter';

export const hentBooleanFraValgtSvar = (valgtSvar: ISvar) => valgtSvar.id === ESvar.JA;

export const erJaNeiSvar = (svar: ISvar) => {
  return svar.id === ESvar.JA || svar.id === ESvar.NEI;
};

export const harValgtSvar = (svar: boolean | undefined | string | string[]) => {
  if (typeof svar === 'boolean') {
    return true;
  } else if (typeof svar === 'string') {
    return svar.toString() !== '';
  } else if (Array.isArray(svar) && svar.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const strengErMerEnnNull = (svar: string | undefined) => {
  return svar ? parseInt(svar) > 0 : false;
};

export const erValgtSvarLiktSomSvar = (valgtSvar: string | undefined, annetSvarTekstid: string) => {
  return valgtSvar === annetSvarTekstid;
};

export const returnerAvhukedeSvar = (
  spørsmålliste: ISpørsmålListeFelt,
  erHuketAv: boolean,
  svar: ISvar
) => {
  let avhukedeSvar: string[] = spørsmålliste.verdi;
  let svarider: string[] = spørsmålliste.svarid;
  const svarTekst = svar.svar_tekst;

  if (erHuketAv) {
    avhukedeSvar = avhukedeSvar.filter((valgtSvar) => {
      return valgtSvar !== svarTekst;
    });
    svarider = svarider.filter((valgtSvar) => {
      return valgtSvar !== svar.id;
    });
  } else {
    avhukedeSvar.push(svarTekst);
    svarider.push(svar.id);
  }
  return { avhukedeSvar, svarider };
};
