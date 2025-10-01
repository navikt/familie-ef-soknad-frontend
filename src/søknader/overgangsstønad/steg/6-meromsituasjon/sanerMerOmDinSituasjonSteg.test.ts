import {
  lagDinSituasjon,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagSpørsmålListeFelt,
  lagSøknadOvergangsstønad,
  lagTekstfelt,
} from '../../../../test/domeneUtils';
import { SøknadOvergangsstønad } from '../../models/søknad';
import {
  ESagtOppEllerRedusertStilling,
  ESituasjon,
  ESøkerFraBestemtMåned,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { sanerMerOmDinSituasjonSteg } from './sanerMerOmDinSituasjonSteg';

describe('Skal sanere felter tilhørende merOmDinSituasjon steget', () => {
  describe('Når ingen svar er valgt i gjelderDetteDeg spørsmål', () => {
    test('skal alle felter bli undefined', () => {
      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(ESituasjon.gjelderDetteDeg, [], []),
          søknadsdato: lagTekstfelt({ label: ESituasjon.søknadsdato, verdi: '2025-01-01' }),
          sagtOppEllerRedusertStilling: lagSpørsmålFelt({
            svarid: ESagtOppEllerRedusertStilling.sagtOpp,
            label: 'Har du sagt opp eller redusert stilling?',
            verdi: ESagtOppEllerRedusertStilling.sagtOpp,
          }),
          begrunnelseSagtOppEllerRedusertStilling: lagTekstfelt({
            label: 'Begrunnelse',
            verdi: 'Dette er en begrunnelse',
          }),
          datoSagtOppEllerRedusertStilling: lagTekstfelt({
            label: ESituasjon.datoSagtOppEllerRedusertStilling,
            verdi: '2025-01-15',
          }),
          søkerFraBestemtMåned: lagSpørsmålBooleanFelt({
            spørsmålid: ESituasjon.søkerFraBestemtMåned,
            svarid: ESøkerFraBestemtMåned.ja,
            label: 'Søker du fra bestemt måned?',
            verdi: true,
          }),
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.søknadsdato).toBe(undefined);
      expect(sanertSøknad.merOmDinSituasjon.sagtOppEllerRedusertStilling).toBe(undefined);
      expect(sanertSøknad.merOmDinSituasjon.begrunnelseSagtOppEllerRedusertStilling).toBe(
        undefined
      );
      expect(sanertSøknad.merOmDinSituasjon.datoSagtOppEllerRedusertStilling).toBe(undefined);
      expect(sanertSøknad.merOmDinSituasjon.søkerFraBestemtMåned).toBe(undefined);
    });
  });
});
