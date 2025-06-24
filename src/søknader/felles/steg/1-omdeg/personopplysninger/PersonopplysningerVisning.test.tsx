import { describe, expect, test } from 'vitest';
import { Adresse, Søker } from '../../../../../models/søknad/person';
import { lagAdresse, lagSøker } from '../../../../../test/utils';
import { render } from '../../../../../test/render';
import { PersonopplysningerVisning } from './PersonopplysningerVisning';

const testAdresseMedPoststed: Adresse = lagAdresse();
const testSøkerMedPoststed: Søker = lagSøker({
  adresse: testAdresseMedPoststed,
});

describe('PersonopplysningerVisning', () => {
  test('skal vise PersonopplysningerVisning komponent gitt søker', async () => {
    const { screen } = render(
      <PersonopplysningerVisning
        personIdent={testSøkerMedPoststed.fnr}
        statsborgerskap={testSøkerMedPoststed.statsborgerskap}
        sivilstand={testSøkerMedPoststed.sivilstand}
        adresse={testSøkerMedPoststed.adresse}
      />
    );

    const { fnr, statsborgerskap, adresse } = testSøkerMedPoststed;
    const { adresse: street, postnummer, poststed } = adresse;

    expect(screen.getByText(fnr)).toBeInTheDocument();
    expect(screen.getByText(statsborgerskap)).toBeInTheDocument();
    expect(screen.getByText(street)).toBeInTheDocument();
    expect(screen.getByText(`${postnummer} - ${poststed}`)).toBeInTheDocument();
  });
});
