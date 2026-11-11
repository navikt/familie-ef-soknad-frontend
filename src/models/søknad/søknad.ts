import type { MellomlagretSøknadBarnetilsyn } from '../../søknader/barnetilsyn/models/mellomlagretSøknad';
import type { SøknadBarnetilsyn } from '../../søknader/barnetilsyn/models/søknad';
import type { MellomlagretSøknadOvergangsstønad } from '../../søknader/overgangsstønad/models/mellomlagretSøknad';
import type { SøknadOvergangsstønad } from '../../søknader/overgangsstønad/models/søknad';
import type { MellomlagretSøknadSkolepenger } from '../../søknader/skolepenger/models/mellomlagretSøknad';
import type { SøknadSkolepenger } from '../../søknader/skolepenger/models/søknad';

export type Søknad = SøknadOvergangsstønad | SøknadBarnetilsyn | SøknadSkolepenger;

export type MellomlagretSøknad =
    | MellomlagretSøknadOvergangsstønad
    | MellomlagretSøknadBarnetilsyn
    | MellomlagretSøknadSkolepenger;

export const erOvergangsstønadSøknad = (søknad: Søknad): søknad is SøknadOvergangsstønad =>
    'merOmDinSituasjon' in søknad;

export const erBarnetilsynSøknad = (søknad: Søknad): søknad is SøknadBarnetilsyn =>
    'aktivitet' in søknad && !('merOmDinSituasjon' in søknad) && !('utdanning' in søknad);

export const erSkolepengerSøknad = (søknad: Søknad): søknad is SøknadSkolepenger => 'utdanning' in søknad;
