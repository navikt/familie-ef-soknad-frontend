export const sanerBrukerInput = (verdi: string): string => {
  return verdi.replace(/\t/g, ' ').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};
