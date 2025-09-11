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
    expect(sanertSøknad.søkerFraBestemtMåned).toBeUndefined;
  });
});
