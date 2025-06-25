export const erStrengGyldigTall = (input: string | undefined): boolean => {
  return input !== undefined && /^\d+\.?,?\d*$/.test(input);
};

export const erStrengGyldigOrganisasjonsnummer = (input: string | undefined): boolean => {
  return input !== undefined && /^\d{9}$/.test(input);
};
