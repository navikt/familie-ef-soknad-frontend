import { describe, expect, test } from 'vitest';
import { søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring } from './omdeg';
import {
  lagAdresseopplysninger,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagSøker,
  lagSøknad,
} from '../../test/utils';

describe('skal validere rendering av spørsmål om sivilstand på side: Om deg', () => {
  test('skal vise sivilstandsspørsmål dersom søker er strengt fortrolig', () => {
    const søker = { ...lagSøker(), erStrengtFortrolig: true };
    const person = { ...lagPerson(), søker: søker };
    const søknad = { ...lagSøknad(), person };
    const validering =
      søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal vise sivilstandsspørsmål dersom søker bor på registrert adresse', () => {
    const søkerBorPåRegistrertAdresse = {
      ...lagSpørsmålBooleanFelt(),
      verdi: true,
    };
    const søknad = { ...lagSøknad(), søkerBorPåRegistrertAdresse };
    const validering =
      søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal vise sivilstandsspørsmål dersom søker har meldt adresseendring', () => {
    const harMeldtAdresseendring = { ...lagSpørsmålBooleanFelt(), verdi: true };
    const adresseopplysninger = {
      ...lagAdresseopplysninger(),
      harMeldtAdresseendring,
    };
    const søknad = { ...lagSøknad(), adresseopplysninger };
    const validering =
      søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal ikke vise sivilstandsspørsmål dersom relevante spørsmål ikke er utfylt', () => {
    const søknad = lagSøknad();
    const validering =
      søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(false);
  });
});
