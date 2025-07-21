export const førsteBokstavStor = (tekst: string) => {
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
};

export const hentFilePath = (
  locale: 'nb' | 'en' | 'nn',
  filepaths: { nb: string; en: string; nn: string }
): string => {
  switch (locale) {
    case 'nn':
      return filepaths.nn;
    case 'en':
      return filepaths.en;
    default:
      return filepaths.nb;
  }
};
