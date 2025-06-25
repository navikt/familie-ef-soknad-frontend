import { SøknadOvergangsstønad } from '../../søknader/overgangsstønad/models/søknad';
import { SøknadBarnetilsyn } from '../../søknader/barnetilsyn/models/søknad';
import { SøknadSkolepenger } from '../../søknader/skolepenger/models/søknad';
import { MellomlagretSøknadOvergangsstønad } from '../../søknader/overgangsstønad/models/mellomlagretSøknad';
import { MellomlagretSøknadBarnetilsyn } from '../../søknader/barnetilsyn/models/mellomlagretSøknad';
import { MellomlagretSøknadSkolepenger } from '../../søknader/skolepenger/models/mellomlagretSøknad';

export type Søknad = SøknadOvergangsstønad | SøknadBarnetilsyn | SøknadSkolepenger;

export type MellomlagretSøknad =
  | MellomlagretSøknadOvergangsstønad
  | MellomlagretSøknadBarnetilsyn
  | MellomlagretSøknadSkolepenger;

export const erOvergangsstønadSøknad = (søknad: Søknad): søknad is SøknadOvergangsstønad =>
  'merOmDinSituasjon' in søknad;

export const erBarnetilsynSøknad = (søknad: Søknad): søknad is SøknadBarnetilsyn =>
  'aktivitet' in søknad && !('merOmDinSituasjon' in søknad) && !('utdanning' in søknad);

export const erSkolepengerSøknad = (søknad: Søknad): søknad is SøknadSkolepenger =>
  'utdanning' in søknad;
