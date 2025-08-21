import { ESvar, ESvarTekstid, ISvar } from '../models/felles/spørsmålogsvar';
import { LokalIntlShape } from '../language/typer';
import { hentTekst } from '../utils/teksthåndtering';

export const JaNeiSvar = (intl: LokalIntlShape): ISvar[] => [JaSvar(intl), NeiSvar(intl)];

export const NeiSvar = (intl: LokalIntlShape): ISvar => ({
  id: ESvar.NEI,
  svar_tekst: hentTekst(ESvarTekstid.NEI, intl),
});
export const JaSvar = (intl: LokalIntlShape): ISvar => ({
  id: ESvar.JA,
  svar_tekst: hentTekst(ESvarTekstid.JA, intl),
});
