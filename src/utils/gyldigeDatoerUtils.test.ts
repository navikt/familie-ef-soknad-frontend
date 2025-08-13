import { addMonths, addYears, subYears } from 'date-fns';
import {
  erDatoGyldigOgInnenforBegrensning,
  erDatoInnenforBegrensing,
  erPeriodeInnenforBegrensning,
  erPeriodeGyldigOgInnenforBegrensning,
  hentStartOgSluttDato,
  erFraDatoSenereEnnTilDato,
  erDatoerLike,
} from './gyldigeDatoerUtils';
import { GyldigeDatoer } from '../components/dato/GyldigeDatoer';
import { dagensDato, formatIsoDate, strengTilDato } from './dato';
import { isoDatoEnMånedFrem } from '../test/dato';
import { lagPeriode } from '../test/domeneUtils';

describe('gyldigeDatoerUtils', () => {
  const testDato = formatIsoDate(dagensDato);

  const enMånedFrem = isoDatoEnMånedFrem;

  const seksMånederFrem = formatIsoDate(addMonths(testDato, 6));
  const syvMånederFrem = formatIsoDate(addMonths(testDato, 7));

  const ettÅrTilbake = formatIsoDate(subYears(testDato, 1));
  const femÅrTilbake = formatIsoDate(subYears(testDato, 5));
  const seksÅrTilbake = formatIsoDate(subYears(testDato, 6));
  const femtiÅrTilbake = formatIsoDate(subYears(testDato, 50));
  const femtiEttÅrTilbake = formatIsoDate(subYears(testDato, 51));

  describe('erDatoGyldigOgInnenforBegrensning', () => {
    it('skal returnere false for ugyldig datoformat', () => {
      expect(erDatoGyldigOgInnenforBegrensning('BINK BONK', GyldigeDatoer.alle)).toBe(false);
      expect(erDatoGyldigOgInnenforBegrensning('31.12.2025', GyldigeDatoer.alle)).toBe(false);
    });

    it('skal returnere true for gyldig dato innenfor begrensning', () => {
      expect(erDatoGyldigOgInnenforBegrensning(testDato, GyldigeDatoer.alle)).toBe(true);
      expect(erDatoGyldigOgInnenforBegrensning(enMånedFrem, GyldigeDatoer.fremtidige)).toBe(true);
    });

    it('skal returnere false for gyldig dato utenfor begrensning', () => {
      expect(erDatoGyldigOgInnenforBegrensning(ettÅrTilbake, GyldigeDatoer.fremtidige)).toBe(false);
      expect(erDatoGyldigOgInnenforBegrensning(enMånedFrem, GyldigeDatoer.tidligere)).toBe(false);
    });
  });

  describe('erDatoInnenforBegrensing', () => {
    describe('GyldigeDatoer.alle', () => {
      it('skal godta alle ikke-tomme datoer', () => {
        expect(erDatoInnenforBegrensing(testDato, GyldigeDatoer.alle)).toBe(true);
        expect(erDatoInnenforBegrensing(femtiÅrTilbake, GyldigeDatoer.alle)).toBe(true);
        expect(erDatoInnenforBegrensing(enMånedFrem, GyldigeDatoer.alle)).toBe(true);
      });

      it('skal ikke godta tom streng', () => {
        expect(erDatoInnenforBegrensing('', GyldigeDatoer.alle)).toBe(false);
      });
    });

    describe('GyldigeDatoer.fremtidige', () => {
      it('skal godta dagens dato og fremtidige datoer', () => {
        expect(erDatoInnenforBegrensing(testDato, GyldigeDatoer.fremtidige)).toBe(true);
        expect(erDatoInnenforBegrensing(enMånedFrem, GyldigeDatoer.fremtidige)).toBe(true);
        expect(erDatoInnenforBegrensing(seksMånederFrem, GyldigeDatoer.fremtidige)).toBe(true);
      });

      it('skal ikke godta tidligere datoer', () => {
        expect(erDatoInnenforBegrensing(ettÅrTilbake, GyldigeDatoer.fremtidige)).toBe(false);
      });

      it('skal ikke godta datoer mer enn 100 år frem', () => {
        const hundreEttÅrFrem = formatIsoDate(addYears(testDato, 101));
        expect(erDatoInnenforBegrensing(hundreEttÅrFrem, GyldigeDatoer.fremtidige)).toBe(false);
      });
    });

    describe('GyldigeDatoer.tidligere', () => {
      it('skal godta dagens dato og tidligere datoer', () => {
        expect(erDatoInnenforBegrensing(testDato, GyldigeDatoer.tidligere)).toBe(true);
        expect(erDatoInnenforBegrensing(ettÅrTilbake, GyldigeDatoer.tidligere)).toBe(true);
        expect(erDatoInnenforBegrensing(femtiÅrTilbake, GyldigeDatoer.tidligere)).toBe(true);
      });

      it('skal ikke godta fremtidige datoer', () => {
        expect(erDatoInnenforBegrensing(enMånedFrem, GyldigeDatoer.tidligere)).toBe(false);
      });

      it('skal ikke godta datoer mer enn 100 år tilbake', () => {
        const hundreEttÅrTilbake = formatIsoDate(subYears(testDato, 101));
        expect(erDatoInnenforBegrensing(hundreEttÅrTilbake, GyldigeDatoer.tidligere)).toBe(false);
      });
    });

    describe('GyldigeDatoer.tidligereOgSeksMånederFrem', () => {
      it('skal godta datoer fra 100 år tilbake til 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(femtiÅrTilbake, GyldigeDatoer.tidligereOgSeksMånederFrem)
        ).toBe(true);
        expect(erDatoInnenforBegrensing(testDato, GyldigeDatoer.tidligereOgSeksMånederFrem)).toBe(
          true
        );
        expect(
          erDatoInnenforBegrensing(seksMånederFrem, GyldigeDatoer.tidligereOgSeksMånederFrem)
        ).toBe(true);
      });

      it('skal ikke godta datoer mer enn 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(syvMånederFrem, GyldigeDatoer.tidligereOgSeksMånederFrem)
        ).toBe(false);
      });
    });

    describe('GyldigeDatoer.femÅrTidligereOgSeksMånederFrem', () => {
      it('skal godta datoer fra 5 år tilbake til 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(femÅrTilbake, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
        expect(
          erDatoInnenforBegrensing(testDato, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
        expect(
          erDatoInnenforBegrensing(seksMånederFrem, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
      });

      it('skal ikke godta datoer mer enn 5 år tilbake', () => {
        expect(
          erDatoInnenforBegrensing(seksÅrTilbake, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
        ).toBe(false);
      });

      it('skal ikke godta datoer mer enn 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(syvMånederFrem, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
        ).toBe(false);
      });
    });

    describe('GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem', () => {
      it('skal godta datoer fra 50 år tilbake til 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(femtiÅrTilbake, GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
        expect(
          erDatoInnenforBegrensing(testDato, GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
        expect(
          erDatoInnenforBegrensing(seksMånederFrem, GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem)
        ).toBe(true);
      });

      it('skal ikke godta datoer mer enn 50 år tilbake', () => {
        expect(
          erDatoInnenforBegrensing(
            femtiEttÅrTilbake,
            GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem
          )
        ).toBe(false);
      });

      it('skal ikke godta datoer mer enn 6 måneder frem', () => {
        expect(
          erDatoInnenforBegrensing(syvMånederFrem, GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem)
        ).toBe(false);
      });
    });
  });

  describe('erPeriodeInnenforBegrensning', () => {
    it('skal returnere true når både fra og til er innenfor begrensning', () => {
      const periode = lagPeriode(ettÅrTilbake, testDato);
      expect(erPeriodeInnenforBegrensning(periode, GyldigeDatoer.tidligere)).toBe(true);
    });

    it('skal returnere false når fra-dato er utenfor begrensning', () => {
      const periode = lagPeriode(ettÅrTilbake, enMånedFrem);
      expect(erPeriodeInnenforBegrensning(periode, GyldigeDatoer.fremtidige)).toBe(false);
    });

    it('skal returnere false når til-dato er utenfor begrensning', () => {
      const periode = lagPeriode(testDato, syvMånederFrem);
      expect(erPeriodeInnenforBegrensning(periode, GyldigeDatoer.tidligereOgSeksMånederFrem)).toBe(
        false
      );
    });

    it('skal returnere true for periode innenfor femÅrTidligereOgSeksMånederFrem', () => {
      const periode = lagPeriode(femÅrTilbake, seksMånederFrem);
      expect(
        erPeriodeInnenforBegrensning(periode, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
      ).toBe(true);
    });
  });

  describe('erPeriodeGyldigOgInnenforforBegrensning', () => {
    it('skal returnere false for ugyldige datoformater', () => {
      const periode = lagPeriode('ikke-en-dato', testDato);
      expect(erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.alle)).toBe(false);
    });

    it('skal returnere false når fra-dato er senere enn til-dato', () => {
      const periode = lagPeriode(enMånedFrem, testDato);
      expect(erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.alle)).toBe(false);
    });

    it('skal returnere false når datoene er like', () => {
      const periode = lagPeriode(testDato, testDato);
      expect(erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.alle)).toBe(false);
    });

    it('skal returnere true for gyldig periode med fra før til', () => {
      const periode = lagPeriode(testDato, enMånedFrem);
      expect(erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.fremtidige)).toBe(true);
    });

    it('skal returnere false når periode er utenfor begrensning', () => {
      const periode = lagPeriode(seksÅrTilbake, femÅrTilbake);
      expect(
        erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.femÅrTidligereOgSeksMånederFrem)
      ).toBe(false);
    });

    it('skal håndtere tomme verdier', () => {
      const periode = lagPeriode('', '');
      expect(erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.alle)).toBe(false);
    });
  });

  describe('hentStartOgSluttDato', () => {
    it('skal returnere riktige datoer for gyldig periode', () => {
      const periode = lagPeriode(ettÅrTilbake, testDato);
      const { startDato, sluttDato } = hentStartOgSluttDato(periode);

      expect(startDato).toEqual(strengTilDato(ettÅrTilbake));
      expect(sluttDato).toEqual(strengTilDato(testDato));
    });

    it('skal returnere undefined for tomme verdier', () => {
      const periode = lagPeriode('', '');
      const { startDato, sluttDato } = hentStartOgSluttDato(periode);

      expect(startDato).toBeUndefined();
      expect(sluttDato).toBeUndefined();
    });
  });

  describe('erFraDatoSenereEnnTilDato', () => {
    it('skal returnere false når fraDato er senere enn tilDato', () => {
      const fraDato = new Date(enMånedFrem);
      const tilDato = new Date(testDato);

      expect(erFraDatoSenereEnnTilDato(fraDato, tilDato)).toBe(false);
    });

    it('skal returnere true når fraDato er før tilDato', () => {
      const fraDato = new Date(testDato);
      const tilDato = new Date(enMånedFrem);

      expect(erFraDatoSenereEnnTilDato(fraDato, tilDato)).toBe(true);
    });

    it('skal returnere false når datoene er like', () => {
      const fraDato = new Date(testDato);
      const tilDato = new Date(testDato);

      expect(erFraDatoSenereEnnTilDato(fraDato, tilDato)).toBe(false);
    });

    it('skal returnere undefined når en av datoene er undefined', () => {
      expect(erFraDatoSenereEnnTilDato(undefined, new Date(testDato))).toBeUndefined();
      expect(erFraDatoSenereEnnTilDato(new Date(testDato), undefined)).toBeUndefined();
      expect(erFraDatoSenereEnnTilDato(undefined, undefined)).toBeUndefined();
    });
  });

  describe('erDatoerLike', () => {
    it('skal returnere true når datoene er like', () => {
      const dato1 = new Date(testDato);
      const dato2 = new Date(testDato);

      expect(erDatoerLike(dato1, dato2)).toBe(true);
    });

    it('skal returnere false når datoene er forskjellige', () => {
      const dato1 = new Date(testDato);
      const dato2 = new Date(enMånedFrem);

      expect(erDatoerLike(dato1, dato2)).toBe(false);
    });

    it('skal returnere undefined når en av datoene er undefined', () => {
      expect(erDatoerLike(undefined, new Date(testDato))).toBeUndefined();
      expect(erDatoerLike(new Date(testDato), undefined)).toBeUndefined();
      expect(erDatoerLike(undefined, undefined)).toBeUndefined();
    });
  });
});
