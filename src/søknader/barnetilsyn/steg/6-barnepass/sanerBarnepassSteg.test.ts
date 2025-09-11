import { describe, expect } from 'vitest';
import { lagSøknadBarnetilsyn } from '../../../../test/domeneUtils';
import { sanerBarnepassSteg } from './sanerBarnepassSteg';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { EBarnepass } from '../../models/barnepass';

describe('Skal sanere felter tilhørende barnepass', () => {
  test('Fjerner søknadsdato dersom bruker ikke søker fra bestemt dato', () => {
    const søknad = lagSøknadBarnetilsyn({
      søknadsdato: { label: 'En dato her', verdi: '02.02.0220' },
      søkerFraBestemtMåned: {
        label: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
        verdi: false,
        spørsmålid: EBarnepass.søkerFraBestemtMåned,
        svarid: ESøkerFraBestemtMåned.neiNavKanVurdere,
      },
    });

    const sanertSøknad = sanerBarnepassSteg(
      søknad,
      søknad.person.barn,
      søknad.søknadsdato,
      søknad.søkerFraBestemtMåned
    );

    expect(sanertSøknad.søkerFraBestemtMåned?.spørsmålid).toBe(EBarnepass.søkerFraBestemtMåned);
    expect(sanertSøknad.søkerFraBestemtMåned?.svarid).toBe(ESøkerFraBestemtMåned.neiNavKanVurdere);
    expect(sanertSøknad.søkerFraBestemtMåned?.label).toBe(
      'Søker du om stønad til barnetilsyn fra en bestemt måned?'
    );
    expect(sanertSøknad.søkerFraBestemtMåned?.verdi).toBe(false);
    expect(sanertSøknad.søknadsdato).toBeUndefined();
  });

  test('Beholder søknadsdato dersom bruker søker fra bestemt dato', () => {
    const søknad = lagSøknadBarnetilsyn({
      søknadsdato: { label: 'Når søker du stønad fra?', verdi: '02.02.0220' },
      søkerFraBestemtMåned: {
        label: 'Søker du om stønad til barnetilsyn fra en bestemt måned?',
        verdi: true,
        spørsmålid: EBarnepass.søkerFraBestemtMåned,
        svarid: ESøkerFraBestemtMåned.ja,
      },
    });

    const sanertSøknad = sanerBarnepassSteg(
      søknad,
      søknad.person.barn,
      søknad.søknadsdato,
      søknad.søkerFraBestemtMåned
    );

    expect(sanertSøknad.søknadsdato).not.toBeUndefined();

    expect(sanertSøknad.søkerFraBestemtMåned?.spørsmålid).toBe(EBarnepass.søkerFraBestemtMåned);
    expect(sanertSøknad.søkerFraBestemtMåned?.svarid).toBe(ESøkerFraBestemtMåned.ja);
    expect(sanertSøknad.søkerFraBestemtMåned?.label).toBe(
      'Søker du om stønad til barnetilsyn fra en bestemt måned?'
    );
    expect(sanertSøknad.søkerFraBestemtMåned?.verdi).toBe(true);

    expect(sanertSøknad.søknadsdato?.label).toBe('Når søker du stønad fra?');
    expect(sanertSøknad.søknadsdato?.verdi).toBe('02.02.0220');
  });
});
