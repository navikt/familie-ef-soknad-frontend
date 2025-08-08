import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { render, screen } from '@testing-library/react';
import { useOmDeg } from '../../OmDegContext';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';

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

  test('Skal vise feilmelding ved ugyldig fødselsnummer', async () => {
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

  test('Skal ikke vise fødselsdato velger før navn har verdi', () => {
    render(<OmDenTidligereSamboerenDin />);

    expect(screen.queryByRole('textbox', { name: 'Fødselsdato' })).not.toBeInTheDocument();
  });

  test('Skal vise fødselsdato velger når navn har verdi og gyldig ident er satt', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          navn: { label: 'Navn', verdi: 'Kari Nordmann' },
          ident: { label: 'Fødselsnummer / d-nummer (11 siffer)', verdi: '09469425085' },
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();
  });

  test('Skal vise fødselsdato velger navn har verdi og brukerIkkeIdent er true', () => {
    vi.mocked(useOmDeg).mockReturnValue({
      sivilstatus: {
        ...defaultSivilstatus,
        tidligereSamboerDetaljer: {
          ...defaultSivilstatus.tidligereSamboerDetaljer,
          navn: { label: 'Navn', verdi: 'Kari Nordmann' },
          kjennerIkkeIdent: true,
        },
      },
      settSivilstatus: mockSettSivilstatus,
    } as any);

    render(<OmDenTidligereSamboerenDin />);

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();
  });
});
