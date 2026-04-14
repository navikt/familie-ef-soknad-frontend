import { EHvaSituasjon } from '../../../../models/steg/dinsituasjon/nyeSituasjonTyper';
import { SøknadOvergangsstønad } from '../../models/søknad';

export const hvisHarBarnMedSærligeTilsynFritekstUtfylt = (
  søknad: SøknadOvergangsstønad
): boolean => {
  const { merOmDinSituasjon, person } = søknad;

  const harValgtBarnSærligTilsyn = merOmDinSituasjon.hvaSituasjon?.svarid.includes(
    EHvaSituasjon.barnSærligTilsyn
  );

  const barnMedSærligeTilsyn = person.barn
    .filter((b) => b.særligeTilsynsbehov)
    .map((b) => b.særligeTilsynsbehov);

  return harValgtBarnSærligTilsyn
    ? barnMedSærligeTilsyn.length > 0 &&
        barnMedSærligeTilsyn.every((v) => (v ? v.verdi.length > 0 : false))
    : true;
};
