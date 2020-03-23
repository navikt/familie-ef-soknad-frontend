export const standardLabelsBarn = (key: string) => {
  const labels: any = {
    fnr: 'Fødselsnummer',
    navn: 'Navn',
    alder: 'Alder',
    fødselsdato: 'Fødselsdato',
    harSammeAdresse: 'Har barnet samme adresse som deg?',
    født: 'Er barnet født?',
  };

  return labels[key];
};
