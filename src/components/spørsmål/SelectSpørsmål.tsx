import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import LesMerTekst from '../LesMerTekst';
import Show from '../../utils/showIf';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Select } from '@navikt/ds-react';
import { hentTekst } from '../../utils/søknad';

interface Props {
  spørsmål: ISpørsmål;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvarId: string | undefined;
  skalLogges?: boolean;
}

const SelectSpørsmål: FC<Props> = ({
  spørsmål,
  settSpørsmålOgSvar,
  valgtSvarId,
}) => {
  const intl = useLokalIntlContext();
  const legend = intl.formatMessage({ id: spørsmål.tekstid });

  const håndterSelectChange = (valgtVerdi: string) => {
    const svar = spørsmål.svaralternativer.find(
      (svar) => svar.id === valgtVerdi
    );

    if (svar !== undefined) {
      settSpørsmålOgSvar(spørsmål, svar);
    }
  };

  return (
    <Select
      label={legend}
      description={
        <Show if={spørsmål.lesmer}>
          <LesMerTekst
            åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
            innholdTekstid={
              spørsmål.lesmer ? spørsmål!.lesmer!.innholdTekstid : ''
            }
          />
        </Show>
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
