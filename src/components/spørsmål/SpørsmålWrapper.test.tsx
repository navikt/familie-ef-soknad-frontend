import { describe, expect, test } from 'vitest';
import { render } from '../../test/render';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { RadioTile } from './input/RadioTile';

describe('SpørsmålWrapper', () => {
  test('skal vise SpørsmålWrapper med tittel', () => {
    const spørsmålTekst = 'Har du noen spørsmål?';
    const svarAlternativer = ['Ja', 'Nei'];

    const { screen } = render(
      <SpørsmålWrapper tittel={spørsmålTekst}>
        <RadioTile
          legend={spørsmålTekst}
          svarAlternativer={svarAlternativer}
          radioTileLayoutDirection="horizontal"
          valgtVerdi={null}
          onChange={() => {}}
        />
      </SpørsmålWrapper>
    );

    expect(screen.getByRole('heading', { name: spørsmålTekst })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: spørsmålTekst })).toBeInTheDocument();
  });

  test('skal ikke vise LesMer hvis kun en av propsene er satt', () => {
    const { queryByText } = render(
      <SpørsmålWrapper tittel="Tittel" lesMerTittel="Les mer">
        <div>Innhold</div>
      </SpørsmålWrapper>
    );

    expect(queryByText('Les mer')).not.toBeInTheDocument();
  });

  test('skal vise LesMer hvis både lesMerTittel og lesMerTekst er satt', () => {
    const lesMerTittel = 'Les mer';
    const lesMerTekst = 'Dette er en utvidet forklaring.';

    const { screen } = render(
      <SpørsmålWrapper tittel="Tittel" lesMerTittel={lesMerTittel} lesMerTekst={lesMerTekst}>
        <div>Innhold</div>
      </SpørsmålWrapper>
    );

    expect(screen.getByText(lesMerTittel)).toBeInTheDocument();
  });
});
