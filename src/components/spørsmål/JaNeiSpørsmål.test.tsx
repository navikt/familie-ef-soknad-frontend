import { describe, expect, test, vi } from 'vitest';
import { JaNeiSpørsmål } from './JaNeiSpørsmål';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { render } from '../../test/render';

describe('JaNeiSpørsmål', () => {
  const svarJa: ISvar = { id: 'svar.ja', svar_tekst: 'Ja' };
  const svarNei: ISvar = { id: 'svar.nei', svar_tekst: 'Nei' };

  const spørsmålMock: ISpørsmål = {
    søknadid: 'omdeg.borPåAdresse',
    tekstid: 'spørsmål.tekstid',
    flersvar: false,
    svaralternativer: [svarJa, svarNei],
  };

  test('kaller onChange når bruker velger ja', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<JaNeiSpørsmål spørsmål={spørsmålMock} valgtSvar={undefined} onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Ja' }));

    expect(onChange).toHaveBeenCalledWith(spørsmålMock, svarJa);
  });
});
