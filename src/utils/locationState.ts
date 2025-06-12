import { LocationStateSøknad } from '../søknader/overgangsstønad/models/søknad';

function erAvTypen<T>(
  given: unknown
): given is Partial<Record<keyof T, unknown>> {
  return typeof given === 'object' && given !== null;
}

export const kommerFraOppsummeringen = (stateValue: unknown) => {
  return (
    erAvTypen<LocationStateSøknad>(stateValue) &&
    'kommerFraOppsummering' in stateValue &&
    stateValue.kommerFraOppsummering === true
  );
};
