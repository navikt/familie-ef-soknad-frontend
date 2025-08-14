import { ESøkerDelerBolig, IBosituasjon } from '../../models/steg/bosituasjon';
import { harFyltUtSamboerDetaljer } from '../../utils/person';
import { IPersonDetaljer } from '../../models/søknad/person';
import { harValgtSvar } from '../../utils/spørsmålogsvar';
import { erDatoGyldigOgInnenforBegrensning } from '../../utils/gyldigeDatoerUtils';
import { stringHarVerdiOgErIkkeTom } from '../../utils/typer';
import { IDatoFelt } from '../../models/søknad/søknadsfelter';
import { GyldigeDatoer } from '../../components/dato/GyldigeDatoer';

const harPlanerOmÅBliSamboerEllerSkalGifteSeg = (bosituasjon: IBosituasjon) => {
  const { skalGifteSegEllerBliSamboer } = bosituasjon;

  return skalGifteSegEllerBliSamboer !== undefined && skalGifteSegEllerBliSamboer.verdi;
};

const harSattFødselsdato = (fødselsdato?: string): boolean =>
  stringHarVerdiOgErIkkeTom(fødselsdato) &&
  erDatoGyldigOgInnenforBegrensning(fødselsdato, GyldigeDatoer.Tidligere);

const harSattIdent = (ident?: string): boolean => stringHarVerdiOgErIkkeTom(ident);

const harFerdigUtfyltOmSamboer = (
  samboerDetaljer?: IPersonDetaljer,
  erIdentValgfritt?: boolean
): boolean =>
  harValgtSvar(samboerDetaljer?.navn?.verdi) &&
  (erIdentValgfritt
    ? samboerDetaljer?.kjennerIkkeIdent || harSattIdent(samboerDetaljer?.ident?.verdi)
    : harSattIdent(samboerDetaljer?.ident?.verdi) ||
      harSattFødselsdato(samboerDetaljer?.fødselsdato?.verdi));

export const erDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid = (
  datoSkalGifteSegEllerBliSamboer: IDatoFelt | undefined
) => {
  if (!datoSkalGifteSegEllerBliSamboer) {
    return false;
  }

  return (
    erDatoGyldigOgInnenforBegrensning(
      datoSkalGifteSegEllerBliSamboer.verdi,
      GyldigeDatoer.Fremtidige
    ) ||
    erDatoGyldigOgInnenforBegrensning(
      datoSkalGifteSegEllerBliSamboer.verdi,
      GyldigeDatoer.Tidligere
    )
  );
};

const harFerdigUtfyltPlanerOmÅBliSamboerEllerBliGift = (bosituasjon: IBosituasjon): boolean => {
  const { skalGifteSegEllerBliSamboer, datoSkalGifteSegEllerBliSamboer, vordendeSamboerEktefelle } =
    bosituasjon;

  const erSattDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid =
    erDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid(datoSkalGifteSegEllerBliSamboer);

  return !!(
    (skalGifteSegEllerBliSamboer && skalGifteSegEllerBliSamboer?.verdi === false) ||
    (harPlanerOmÅBliSamboerEllerSkalGifteSeg(bosituasjon) &&
      erSattDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid &&
      harFerdigUtfyltOmSamboer(vordendeSamboerEktefelle, false))
  );
};

const harSattDatoFlyttetFraHverandre = (bosituasjon: IBosituasjon) => {
  const { datoFlyttetFraHverandre } = bosituasjon;
  return (
    stringHarVerdiOgErIkkeTom(datoFlyttetFraHverandre) &&
    erDatoGyldigOgInnenforBegrensning(datoFlyttetFraHverandre?.verdi, GyldigeDatoer.Alle)
  );
};

export const erFerdigUtfylt = (bosituasjon: IBosituasjon) => {
  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetSammenMedSamboer } = bosituasjon;

  switch (delerBoligMedAndreVoksne.svarid) {
    case ESøkerDelerBolig.borAleneMedBarnEllerGravid:
      return harFerdigUtfyltPlanerOmÅBliSamboerEllerBliGift(bosituasjon);

    case ESøkerDelerBolig.borMidlertidigFraHverandre:
      return true;

    case ESøkerDelerBolig.borSammenOgVenterBarn:
      return true;

    case ESøkerDelerBolig.harEkteskapsliknendeForhold:
      return !!(
        datoFlyttetSammenMedSamboer &&
        erDatoGyldigOgInnenforBegrensning(
          datoFlyttetSammenMedSamboer.verdi,
          GyldigeDatoer.Tidligere
        ) &&
        samboerDetaljer &&
        harFyltUtSamboerDetaljer(samboerDetaljer, false)
      );

    case ESøkerDelerBolig.delerBoligMedAndreVoksne:
      return harFerdigUtfyltPlanerOmÅBliSamboerEllerBliGift(bosituasjon);

    case ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse:
      return (
        harFerdigUtfyltOmSamboer(samboerDetaljer, true) &&
        harSattDatoFlyttetFraHverandre(bosituasjon) &&
        harFerdigUtfyltPlanerOmÅBliSamboerEllerBliGift(bosituasjon)
      );
  }
};
