import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { render, screen } from '@testing-library/react';
import { useOmDeg } from '../../OmDegContext';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';
import userEvent from '@testing-library/user-event';

vi.mock('../../OmDegContext');
vi.mock('../../../../../../context/LokalIntlContext');
vi.mock('../../../../../../utils/teksthåndtering', () => ({
  hentTekst: (key: string) => {
    const tekstMap: Record<string, string> = {
      'sivilstatus.tittel.samlivsbruddAndre': 'Om den tidligere samboeren din',
      'person.navn': 'Navn',
      'person.ident': 'Fødselsnummer / d-nummer (11 siffer)',
      'person.checkbox.ident': 'Jeg kjenner ikke fødselsnummer / d-nummer',
      'person.feilmelding.ident': 'Ugyldig fødselsnummer eller d-nummer',
      'datovelger.fødselsdato': 'Fødselsdato',
      'sivilstatus.datovelger.flyttetFraHverandre': 'Når flyttet dere fra hverandre?',
    };
    return tekstMap[key] || key;
  },
}));

describe('OmDenTidligereSamboerenDin', () => {
  const mockSettSivilstatus = vi.fn();
  const defaultSivilstatus = {
    tidligereSamboerDetaljer: {
      navn: { label: 'Navn', verdi: '' },
      ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '' },
      kjennerIkkeIdent: false,
      fødselsdato: { label: 'Fødselsdato', verdi: '' },
    },
    datoFlyttetFraHverandre: { label: 'Når flyttet dere fra hverandre?', verdi: '' },
  };

  const testIdent = '17499019114'; // Dette er en test ident fra Dolly.

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useLokalIntlContext).mockReturnValue({} as any);
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: defaultSivilstatus,
      settSivilstatus: mockSettSivilstatus,
    } as any);
  });

  test('Skal vise alle initielle inputfelt og tekster', () => {
    render(<OmDenTidligereSamboerenDin />);

    expect(
      screen.getByRole('heading', { name: 'Om den tidligere samboeren din' })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).toBeInTheDocument();
  });

  test('Skal vise feilmelding ved ugyldig ident', async () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '12345' },
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(screen.getByText('Ugyldig fødselsnummer eller d-nummer')).toBeInTheDocument();
  });

  test('Skal ikke vise fødselsdato velger før ident felt har verdi', () => {
    render(<OmDenTidligereSamboerenDin />);

    expect(screen.queryByRole('textbox', { name: 'Fødselsdato' })).not.toBeInTheDocument();
  });

  test('Skal vise flyttedato velger når navn har verdi og ident har verdi, men IKKE gyldig', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          navn: { label: 'Navn', verdi: 'Bink Bonk' },
          ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '1234' },
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();
  });

  test('Skal vise fødselsdato velger navn har verdi og brukerIkkeIdent er true', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          navn: { label: 'Navn', verdi: 'Bink Bonk' },
          kjennerIkkeIdent: true,
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();
  });

  test('Skal disable ident felt når brukerIkkeIdent er true', async () => {
    const user = userEvent.setup();
    render(<OmDenTidligereSamboerenDin />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Jeg kjenner ikke fødselsnummer / d-nummer',
    });
    const identFelt = screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' });

    expect(identFelt).not.toBeDisabled();

    await user.click(checkbox);

    expect(mockSettSivilstatus).toHaveBeenCalledWith(
      expect.objectContaining({
        tidligereSamboerDetaljer: expect.objectContaining({
          kjennerIkkeIdent: true,
        }),
      })
    );
  });

  test('Skal vise flyttedato velger når fødselsdato er satt', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          navn: { label: 'Navn', verdi: 'Bink Bonk' },
          ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: testIdent },
          fødselsdato: { label: 'Fødselsdato', verdi: '1990-01-01' },
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();
  });

  test('Skal cleare ident felt når brukerIkkeIdent er true', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '12345' },
          kjennerIkkeIdent: true,
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    const identFelt = screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' });

    expect(identFelt).toHaveValue('');
    expect(identFelt).toBeDisabled();
  });
});
