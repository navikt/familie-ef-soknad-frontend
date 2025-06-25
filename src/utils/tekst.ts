export const storeForbokstaver = (tekst: string): string => {
  return tekst
    .split(' ')
    .map((ord) =>
      ord
        .split('-')
        .map((navn) => navn.charAt(0).toUpperCase() + navn.slice(1).toLowerCase())
        .join('-')
    )
    .join(' ');
};
