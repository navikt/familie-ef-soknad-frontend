import { describe, expect, test } from 'vitest';
import { Adresse, Søker } from '../../../../models/søknad/person';
import { lagAdresse, lagSøker } from '../../../../test/utils';
import { render } from '../../../../test/testRender';
import { OmDeg } from './OmDeg';

const testAdresseMedPoststed: Adresse = lagAdresse(
  'Testveien 1',
  '1234',
  'Testby'
);
const testSøkerMedPoststed: Søker = lagSøker(
  '01012512345',
  25,
  undefined,
  testAdresseMedPoststed,
  'UGIFT',
  'NORGE',
  false
);

describe('OmDeg', () => {
  test('skal vise OmDeg komponent med gitt søker', async () => {
    const { screen } = render(
      <OmDeg
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
