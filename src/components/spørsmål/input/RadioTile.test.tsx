import { render } from '../../../test/render';
import { RadioTile } from './RadioTile';

describe('RadioTile komponent', () => {
  test('Rendrer alternativer', async () => {
    const svarAlternativer = ['Ja', 'Nei'];

    const { screen } = render(
      <RadioTile
        legend={'RadioTile horistontalt'}
        svarAlternativer={svarAlternativer}
        radioTileLayoutDirection={'horizontal'}
        valgtVerdi={null}
        onChange={() => {}}
      />
    );

    svarAlternativer.forEach((alternativ) => {
      expect(screen.getByRole('radio', { name: alternativ })).toBeInTheDocument();
    });
  });
});
