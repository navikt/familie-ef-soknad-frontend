import { describe } from 'vitest';
import { erDatoGyldigOgInnaforBegrensninger } from './datoBegrensningUtils';
import { GyldigeDatoer } from './Datovelger';
import { dagensDato } from '../../utils/dato';

const DAGENS_DATO = dagensDato;

describe('datoBegrensningUtils', () => {
  describe('erDatoGyldigOgInnaforBegrensninger', () => {
    it('skal returnere false for ugyldig datoformat', () => {
      expect(erDatoGyldigOgInnaforBegrensninger('01.01.2025X', GyldigeDatoer.alle)).toBe(false);
      expect(erDatoGyldigOgInnaforBegrensninger('32.13.2025', GyldigeDatoer.alle)).toBe(false);
    });
  });
});
