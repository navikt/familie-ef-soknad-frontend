export const byteTilKilobyte = (tall: number | string): number => {
  return Number(tall) / 1024;
};

export const rundOppTilToDesimaler = (tall: number) => {
  return Number(Number(tall).toFixed(2));
};

export const filtypeTekst = (typeTekst: string): string => {
  return typeTekst.slice(typeTekst.indexOf('/') + 1).toUpperCase();
};

export const filtypeOgFilstørrelseStreng = (filtype: string, filstorrelse: number): string => {
  const skalViseFilInformasjon = filstorrelse != 0 && filtype != '';
  return skalViseFilInformasjon
    ? ` (${filtypeTekst(filtype)}, ${rundOppTilToDesimaler(filstorrelse)}kb)`
    : '';
};
