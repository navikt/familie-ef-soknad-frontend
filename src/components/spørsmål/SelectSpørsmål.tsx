import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Select } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

interface Props {
  spørsmål: ISpørsmål;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvarId: string | undefined;
  skalLogges?: boolean;
}

const SelectSpørsmål: FC<Props> = ({ spørsmål, settSpørsmålOgSvar, valgtSvarId }) => {
  const intl = useLokalIntlContext();
  const legend = hentTekst(spørsmål.tekstid, intl);

  const håndterSelectChange = (valgtVerdi: string) => {
    const svar = spørsmål.svaralternativer.find((svar) => svar.id === valgtVerdi);

    if (svar !== undefined) {
      settSpørsmålOgSvar(spørsmål, svar);
    }
  };

  return (
    <Select
      label={legend}
      description={
        spørsmål.lesmer && (
          <LesMerTekst
            åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
            innholdTekstid={spørsmål.lesmer ? spørsmål!.lesmer!.innholdTekstid : ''}
          />
        )
      }
      onChange={(e) => håndterSelectChange(e.target.value)} // Logg spørsmål
      value={valgtSvarId}
    >
      <option value="" disabled selected>
        {hentTekst('landVelger.alternativ', intl)}
      </option>
      {spørsmål.svaralternativer.map((svar: ISvar) => (
        <option key={svar.id} value={svar.id}>
          {svar.svar_tekst}
        </option>
      ))}
    </Select>
  );
};

export default SelectSpørsmål;
