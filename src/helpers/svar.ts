import { ESvar, ESvarTekstid, ISvar } from '../models/felles/spørsmålogsvar';
import { LokalIntlShape } from '../language/typer';

export const JaNeiSvar = (intl: LokalIntlShape): ISvar[] => [JaSvar(intl), NeiSvar(intl)];

export const NeiSvar = (intl: LokalIntlShape): ISvar => ({
  id: ESvar.NEI,
  svar_tekst: intl.formatMessage({ id: ESvarTekstid.NEI }),
});
export const JaSvar = (intl: LokalIntlShape): ISvar => ({
  id: ESvar.JA,
  svar_tekst: intl.formatMessage({ id: ESvarTekstid.JA }),
});
