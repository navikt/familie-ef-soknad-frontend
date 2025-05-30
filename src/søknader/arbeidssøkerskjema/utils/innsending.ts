import { IArbeidssøker } from '../../../models/steg/aktivitet/arbeidssøker';

export const mapDataTilLabelOgVerdiTyper = (skjema: IArbeidssøker) => {
  const nyttSkjemaObjekt: Record<string, object> = {};

  for (const [key, value] of Object.entries(skjema)) {
    nyttSkjemaObjekt[key] = { label: value['label'], verdi: value['verdi'] };
  }
  return nyttSkjemaObjekt;
};
