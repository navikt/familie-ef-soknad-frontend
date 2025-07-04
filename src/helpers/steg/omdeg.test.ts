import { describe, expect, test } from 'vitest';
import { søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring } from './omdeg';
import {
  lagAdresseopplysninger,
  lagPerson,
  lagSpørsmålBooleanFelt,
  lagSøker,
  lagSøknadOvergangsstønad,
} from '../../test/utils';

describe('skal validere rendering av spørsmål om sivilstand på side: Om deg', () => {
  test('skal vise sivilstandsspørsmål dersom søker er strengt fortrolig', () => {
    const søker = lagSøker({ erStrengtFortrolig: true });
    const person = lagPerson({ søker: søker });
    const søknad = lagSøknadOvergangsstønad({ person: person });
    const validering = søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal vise sivilstandsspørsmål dersom søker bor på registrert adresse', () => {
    const søkerBorPåRegistrertAdresse = lagSpørsmålBooleanFelt({ verdi: true });
    const søknad = lagSøknadOvergangsstønad({
      søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
    });
    const validering = søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal vise sivilstandsspørsmål dersom søker har meldt adresseendring', () => {
    const harMeldtAdresseendring = lagSpørsmålBooleanFelt({ verdi: true });
    const adresseopplysninger = lagAdresseopplysninger({
      harMeldtAdresseendring: harMeldtAdresseendring,
    });
    const søknad = lagSøknadOvergangsstønad({
      adresseopplysninger: adresseopplysninger,
    });
    const validering = søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(true);
  });

  test('skal ikke vise sivilstandsspørsmål dersom relevante spørsmål ikke er utfylt', () => {
    const søknad = lagSøknadOvergangsstønad();
    const validering = søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

    expect(validering).toBe(false);
  });
});
