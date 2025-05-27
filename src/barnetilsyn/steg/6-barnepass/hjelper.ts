import { IBarn } from '../../../models/steg/barn';
import {
  dagensDato,
  erEnMånedTilbakeITid,
  erPeriodeGyldig,
  strengTilDato,
} from '../../../utils/dato';
import {
  ETypeBarnepassOrdning,
  IBarnepassOrdning,
} from '../../models/barnepass';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { ESøkerFraBestemtMåned } from '../../../models/steg/dinsituasjon/meromsituasjon';
import { harValgtSvar } from '../../../utils/spørsmålogsvar';
import { erStrengGyldigTall } from '../../../utils/autentiseringogvalidering/feltvalidering';
import {
  IDatoFelt,
  ISpørsmålBooleanFelt,
} from '../../../models/søknad/søknadsfelter';

export const harBarnAvsluttetFjerdeKlasse = (fødselsdato: string): boolean => {
  const juniEllerFør = dagensDato.getMonth() < 6;
  const fødselsår: number = strengTilDato(fødselsdato).getFullYear();
  const gjeldendeÅr: number = dagensDato.getFullYear();

  if (juniEllerFør) {
    return fødselsår + 11 <= gjeldendeÅr;
  } else {
    return fødselsår + 10 <= gjeldendeÅr;
  }
};

export const erÅrsakBarnepassSpmBesvart = (barn: IBarn): boolean => {
  return (
    (harBarnAvsluttetFjerdeKlasse(barn.fødselsdato.verdi) &&
      barn.barnepass?.årsakBarnepass?.verdi !== undefined) ||
    !harBarnAvsluttetFjerdeKlasse(barn.fødselsdato.verdi)
  );
};

export const erBarnepassOrdningerUtfylt = (
  barnepassordninger: IBarnepassOrdning[]
): boolean => {
  const erBarnepassOrdningUtfylt = (barnepassordning: IBarnepassOrdning) => {
    const { hvaSlagsBarnepassOrdning, navn, periode, belop } = barnepassordning;
    return (
      hvaSlagsBarnepassOrdning?.verdi &&
      harValgtSvar(navn?.verdi) &&
      erPeriodeGyldig(periode) &&
      erStrengGyldigTall(belop?.verdi)
    );
  };

  return barnepassordninger.every((barnepassordning) =>
    erBarnepassOrdningUtfylt(barnepassordning)
  );
};

export const erBarnepassStegFerdigUtfylt = (
  barnSomSkalHaBarnepass: IBarn[],
  søknad: SøknadBarnetilsyn
): boolean => {
  const { søkerFraBestemtMåned, søknadsdato } = søknad;
  const erSpørsmålSøkerFraBestemtMånedBesvart =
    (søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.ja &&
      søknadsdato?.verdi !== undefined) ||
    søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.neiNavKanVurdere;
  const erSpørsmålForAlleBarnSomSkalHaBarnepassBesvart =
    erBarnepassForAlleBarnUtfylt(barnSomSkalHaBarnepass);
  return (
    erSpørsmålSøkerFraBestemtMånedBesvart &&
    erSpørsmålForAlleBarnSomSkalHaBarnepassBesvart
  );
};

export const erBarnepassForAlleBarnUtfylt = (barn: IBarn[]) => {
  return barn.every(
    (barn) =>
      barn?.barnepass?.barnepassordninger &&
      erBarnepassOrdningerUtfylt(barn?.barnepass?.barnepassordninger)
  );
};

export const erSpørsmålSeksjonForBarnFerdigUtfylt = (barn: IBarn) => {
  const barnepass = barn.barnepass;
  return (
    erÅrsakBarnepassSpmBesvart(barn) &&
    barnepass?.barnepassordninger &&
    erBarnepassOrdningerUtfylt(barnepass?.barnepassordninger)
  );
};

export const erBarnepassForBarnFørNåværendeUtfylt = (
  barn: IBarn,
  barnSomSkalHaBarnepass: IBarn[]
): boolean => {
  const barnIndex: number = barnSomSkalHaBarnepass.indexOf(barn);

  return barnSomSkalHaBarnepass
    .filter((barn, index) => index < barnIndex)
    .every((barn) => erSpørsmålSeksjonForBarnFerdigUtfylt(barn));
};

const harBarnMedBarbehageOgLignende = (barn: IBarn[]): boolean => {
  return barn.some((b: IBarn) => {
    return b.barnepass?.barnepassordninger.some((bpassordninger) => {
      return (
        bpassordninger.hvaSlagsBarnepassOrdning?.svarid ===
        ETypeBarnepassOrdning.barnehageOgLiknende
      );
    });
  });
};

export const skalDokumentereTidligereFakturaer = (
  barnSomSkalHaBarnepass: IBarn[],
  søkerFraBestemtMåned?: ISpørsmålBooleanFelt,
  søknadsdato?: IDatoFelt
): boolean => {
  const harValgtBHGellerSFO = harBarnMedBarbehageOgLignende(
    barnSomSkalHaBarnepass
  );

  const harSøktMinstEnMånedTilbakeITid: boolean =
    søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.ja &&
    søknadsdato?.verdi !== undefined &&
    erEnMånedTilbakeITid(søknadsdato.verdi);

  return (
    harSøktMinstEnMånedTilbakeITid &&
    harValgtBHGellerSFO &&
    søkerFraBestemtMåned?.verdi === true
  );
};
