import { describe, expect, test } from 'vitest';
import { Adresse, ISøker } from '../../../../models/søknad/person';
import { lagAdresse, lagSøker } from '../../../../test/utils';
import { render } from '../../../../test/testRender';
import { OmDeg } from './OmDeg';

const testAdresse: Adresse = lagAdresse('Testveien 1', '1234', 'Testby');
const testSøker: ISøker = lagSøker(
  '01012512345',
  25,
  undefined,
  testAdresse,
  'UGIFT',
  'NORGE',
  false
);
testSøker;

describe('OmDeg', () => {
  test('skal vise OmDeg komponent med gitt søker', async () => {
    const { screen } = render(
      <OmDeg
        personIdent={testSøker.fnr}
        statsborgerskap={testSøker.statsborgerskap}
        sivilstand={testSøker.sivilstand}
        adresse={testSøker.adresse}
      />
    );

    expect(screen.getByText(testSøker.fnr)).toBeInTheDocument();
    expect(screen.getByText(testSøker.statsborgerskap)).toBeInTheDocument();
    expect(screen.getByText(testAdresse.adresse)).toBeInTheDocument();
    expect(
      screen.getByText(`${testAdresse.postnummer} - ${testAdresse.poststed}`)
    ).toBeInTheDocument();
  });
});
