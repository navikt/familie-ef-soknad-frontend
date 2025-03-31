import logger from './logger';

export const envVar = (navn: string): string => {
  const envVariable = process.env[navn];
  if (!envVariable) {
    logger.info(`Mangler påkrevd miljøvariabel '${navn}'`);
    process.exit(1);
  } else {
    return envVariable as string;
  }
};
