import { describe } from 'vitest';
import { erDatoGyldigOgInnaforBegrensninger } from './datoBegrensningUtils';
import { DatoBegrensning } from './Datovelger';

describe('datoBegrensningUtils', () => {
  describe('erDatoGyldigOgInnaforBegrensninger', () => {
    it('skal returnere false for ugyldig datoformat', () => {
      expect(erDatoGyldigOgInnaforBegrensninger('01.01.2025X', DatoBegrensning.AlleDatoer)).toBe(
        false
      );
      expect(erDatoGyldigOgInnaforBegrensninger('32.13.2025', DatoBegrensning.AlleDatoer)).toBe(
        false
      );
    });
  });
});
