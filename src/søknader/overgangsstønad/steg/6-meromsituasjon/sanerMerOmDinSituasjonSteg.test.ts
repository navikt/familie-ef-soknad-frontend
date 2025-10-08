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
  DinSituasjonType,
  ESagtOppEllerRedusertStilling,
  ESituasjon,
  ESøkerFraBestemtMåned,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { sanerMerOmDinSituasjonSteg } from './sanerMerOmDinSituasjonSteg';

describe('Skal sanere felter tilhørende merOmDinSituasjon steget', () => {
  describe('Når ingen svar er valgt i gjelderDetteDeg spørsmål', () => {
    test('skal ubesvarte felter bli undefined', () => {
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
            verdi: 'Bink bonk!',
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

    test('skal gjelderDetteDeg ha verdi', () => {
      const gjelderDetteDeg = lagSpørsmålListeFelt(ESituasjon.gjelderDetteDeg, [], []);

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.gjelderDetteDeg).toEqual(gjelderDetteDeg);
    });
  });

  describe('Når søkerFraBestemtMåned er nei', () => {
    test('skal søknadsdato bli undefined', () => {
      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(ESituasjon.gjelderDetteDeg, ['erSyk'], []),
          søknadsdato: lagTekstfelt({ label: ESituasjon.søknadsdato, verdi: '2025-01-01' }),
          søkerFraBestemtMåned: lagSpørsmålBooleanFelt({
            spørsmålid: ESituasjon.søkerFraBestemtMåned,
            svarid: ESøkerFraBestemtMåned.neiNavKanVurdere,
            label: 'Søker du fra bestemt måned?',
            verdi: false,
          }),
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.søknadsdato).toBe(undefined);
    });

    test('skal søkerFraBestemtMåned ha verdi', () => {
      const søkerFraBestemtMåned = lagSpørsmålBooleanFelt({
        spørsmålid: ESituasjon.søkerFraBestemtMåned,
        svarid: ESøkerFraBestemtMåned.neiNavKanVurdere,
        label: 'Søker du fra bestemt måned?',
        verdi: false,
      });

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          søkerFraBestemtMåned,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.søkerFraBestemtMåned).toEqual(søkerFraBestemtMåned);
    });
  });

  describe('Når søkerFraBestemtMåned er ja', () => {
    test('skal søknadsdato ha verdi', () => {
      const søknadsdato = lagTekstfelt({ label: ESituasjon.søknadsdato, verdi: '2025-01-01' });
      const søkerFraBestemtMåned = lagSpørsmålBooleanFelt({
        spørsmålid: ESituasjon.søkerFraBestemtMåned,
        svarid: ESøkerFraBestemtMåned.ja,
        label: 'Søker du fra bestemt måned?',
        verdi: true,
      });

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          søknadsdato,
          søkerFraBestemtMåned,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.søknadsdato).toEqual(søknadsdato);
      expect(sanertSøknad.merOmDinSituasjon.søkerFraBestemtMåned).toEqual(søkerFraBestemtMåned);
    });
  });

  describe('Når sagtOppEllerRedusertStilling er nei', () => {
    test('skal begrunnelseSagtOppEllerRedusertStilling og datoSagtOppEllerRedusertStilling bli undefined', () => {
      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          sagtOppEllerRedusertStilling: lagSpørsmålFelt({
            svarid: ESituasjon.sagtOppEllerRedusertStilling,
            label: 'Har du sagt opp eller redusert stilling?',
            verdi: ESagtOppEllerRedusertStilling.nei,
          }),
          begrunnelseSagtOppEllerRedusertStilling: lagTekstfelt({
            label: 'Begrunnelse',
            verdi: 'Bink bonk!',
          }),
          datoSagtOppEllerRedusertStilling: lagTekstfelt({
            label: ESituasjon.datoSagtOppEllerRedusertStilling,
            verdi: '2025-01-15',
          }),
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.begrunnelseSagtOppEllerRedusertStilling).toBe(
        undefined
      );
      expect(sanertSøknad.merOmDinSituasjon.datoSagtOppEllerRedusertStilling).toBe(undefined);
    });

    test('skal sagtOppEllerRedusertStilling ha verdi', () => {
      const sagtOppEllerRedusertStilling = lagSpørsmålFelt({
        svarid: ESagtOppEllerRedusertStilling.nei,
        label: 'Har du sagt opp eller redusert stilling?',
        verdi: 'Nei',
      });

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          sagtOppEllerRedusertStilling,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.sagtOppEllerRedusertStilling).toEqual(
        sagtOppEllerRedusertStilling
      );
    });
  });

  describe('Når sagtOppEllerRedusertStilling er sagtOpp', () => {
    test('skal begrunnelseSagtOppEllerRedusertStilling og datoSagtOppEllerRedusertStilling ha verdi', () => {
      const sagtOppEllerRedusertStilling = lagSpørsmålFelt({
        svarid: ESagtOppEllerRedusertStilling.sagtOpp,
        label: 'Har du sagt opp eller redusert stilling?',
        verdi: 'Jeg har sagt opp',
      });

      const begrunnelseSagtOppEllerRedusertStilling = lagTekstfelt({
        label: 'Begrunnelse',
        verdi: 'Dette er en begrunnelse',
      });

      const datoSagtOppEllerRedusertStilling = lagTekstfelt({
        label: ESituasjon.datoSagtOppEllerRedusertStilling,
        verdi: '2025-01-15',
      });

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          sagtOppEllerRedusertStilling,
          begrunnelseSagtOppEllerRedusertStilling,
          datoSagtOppEllerRedusertStilling,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.sagtOppEllerRedusertStilling).toEqual(
        sagtOppEllerRedusertStilling
      );
      expect(sanertSøknad.merOmDinSituasjon.begrunnelseSagtOppEllerRedusertStilling).toEqual(
        begrunnelseSagtOppEllerRedusertStilling
      );
      expect(sanertSøknad.merOmDinSituasjon.datoSagtOppEllerRedusertStilling).toEqual(
        datoSagtOppEllerRedusertStilling
      );
    });
  });

  describe('Når sagtOppEllerRedusertStilling er redusertStilling', () => {
    test('skal begrunnelseSagtOppEllerRedusertStilling og datoSagtOppEllerRedusertStilling ha verdi', () => {
      const sagtOppEllerRedusertStilling = lagSpørsmålFelt({
        svarid: ESagtOppEllerRedusertStilling.redusertStilling,
        label: 'Har du sagt opp eller redusert stilling?',
        verdi: 'Jeg har redusert stilling',
      });

      const begrunnelseSagtOppEllerRedusertStilling = lagTekstfelt({
        label: 'Begrunnelse',
        verdi: 'Jeg måtte redusere fordi...',
      });

      const datoSagtOppEllerRedusertStilling = lagTekstfelt({
        label: ESituasjon.datoSagtOppEllerRedusertStilling,
        verdi: '2025-02-01',
      });

      const søknad: SøknadOvergangsstønad = {
        ...lagSøknadOvergangsstønad(),
        merOmDinSituasjon: lagDinSituasjon({
          gjelderDetteDeg: lagSpørsmålListeFelt(
            ESituasjon.gjelderDetteDeg,
            [DinSituasjonType.erSyk],
            [
              DinSituasjonType.erSyk,
              DinSituasjonType.harSyktBarn,
              DinSituasjonType.harSøktBarnepassOgVenterEnnå,
              DinSituasjonType.harBarnMedSærligeBehov,
              DinSituasjonType.nei,
            ]
          ),
          sagtOppEllerRedusertStilling,
          begrunnelseSagtOppEllerRedusertStilling,
          datoSagtOppEllerRedusertStilling,
        }),
      };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(søknad);

      expect(sanertSøknad.merOmDinSituasjon.sagtOppEllerRedusertStilling).toEqual(
        sagtOppEllerRedusertStilling
      );
      expect(sanertSøknad.merOmDinSituasjon.begrunnelseSagtOppEllerRedusertStilling).toEqual(
        begrunnelseSagtOppEllerRedusertStilling
      );
      expect(sanertSøknad.merOmDinSituasjon.datoSagtOppEllerRedusertStilling).toEqual(
        datoSagtOppEllerRedusertStilling
      );
    });
  });
});
