import {
  EStilling,
  IArbeidsgiver,
} from '../../models/steg/aktivitet/arbeidsgiver';
import {
  EAktivitet,
  IAksjeselskap,
  IAktivitet,
} from '../../models/steg/aktivitet/aktivitet';
import { harValgtSvar } from '../../utils/spørsmålogsvar';
import {
  IUnderUtdanning,
  IUtdanning,
} from '../../models/steg/aktivitet/utdanning';
import { erPeriodeGyldig } from '../../utils/dato';

export const erSisteArbeidsgiverFerdigUtfylt = (
  arbeidsforhold: IArbeidsgiver[]
) => {
  return arbeidsforhold?.every((arbeidsgiver) =>
    arbeidsgiver.ansettelsesforhold?.svarid === EStilling.midlertidig
      ? arbeidsgiver.harSluttDato?.verdi === false ||
        arbeidsgiver.sluttdato?.verdi
      : arbeidsgiver.ansettelsesforhold?.verdi
  );
};

export const erAksjeselskapFerdigUtfylt = (egetAS: IAksjeselskap[]) => {
  return egetAS?.every((aksjeselskap) => aksjeselskap.arbeidsmengde?.verdi);
};

export const erTidligereUtdanningFerdigUtfylt = (
  tidligereUtdanning: IUtdanning[]
): boolean => {
  return tidligereUtdanning.every(
    (utdanning) =>
      utdanning.linjeKursGrad?.verdi !== '' &&
      erPeriodeGyldig(utdanning?.periode)
  );
};

export const erUnderUtdanningFerdigUtfylt = (
  underUtdanning: IUnderUtdanning
): boolean => {
  return harValgtSvar(underUtdanning?.målMedUtdanning?.verdi);
};

export const erAktivitetSeksjonFerdigUtfylt = (
  svarid: string,
  arbeidssituasjon: IAktivitet
): boolean => {
  const {
    arbeidsforhold,
    firma,
    egetAS,
    etablererEgenVirksomhet,
    arbeidssøker,
    underUtdanning,
    datoOppstartJobb,
  } = arbeidssituasjon;

  switch (svarid) {
    case EAktivitet.erHjemmeMedBarnUnderEttÅr:
      return true;

    case EAktivitet.erArbeidstaker:
      return (
        arbeidsforhold !== undefined &&
        erSisteArbeidsgiverFerdigUtfylt(arbeidsforhold)
      );

    case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
      return harValgtSvar(firma?.arbeidsuke?.verdi);

    case EAktivitet.erAnsattIEgetAS:
      return egetAS !== undefined && erAksjeselskapFerdigUtfylt(egetAS);

    case EAktivitet.etablererEgenVirksomhet:
      return (
        etablererEgenVirksomhet !== undefined &&
        harValgtSvar(etablererEgenVirksomhet.verdi)
      );

    case EAktivitet.erArbeidssøker:
      return (
        arbeidssøker !== undefined &&
        harValgtSvar(arbeidssøker.ønskerSøker50ProsentStilling?.verdi)
      );

    case EAktivitet.tarUtdanning:
      if (underUtdanning?.harTattUtdanningEtterGrunnskolen?.verdi === false) {
        return underUtdanning && erUnderUtdanningFerdigUtfylt(underUtdanning);
      } else {
        const tidligereUtdanning = underUtdanning?.tidligereUtdanning;
        return (
          underUtdanning !== undefined &&
          tidligereUtdanning !== undefined &&
          erUnderUtdanningFerdigUtfylt(underUtdanning) &&
          erTidligereUtdanningFerdigUtfylt(tidligereUtdanning)
        );
      }

    case EAktivitet.harFåttJobbTilbud:
      return datoOppstartJobb !== undefined;

    case EAktivitet.erHverkenIArbeidUtdanningEllerArbeidssøker:
      return true;

    default:
      return false;
  }
};
