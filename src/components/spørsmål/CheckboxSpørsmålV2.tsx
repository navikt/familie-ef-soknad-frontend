import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Checkbox, CheckboxGroup, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import styles from './CheckboxSpørsmålV2.module.css';

interface Props {
  spørsmål: ISpørsmål;
  settValgteSvar: (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => void;
  valgteSvar: string[];
  brukSvarIdSomVerdi?: boolean;
}

export const CheckboxSpørsmålV2: React.FC<Props> = ({
  spørsmål,
  settValgteSvar,
  valgteSvar,
  brukSvarIdSomVerdi,
}) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap={'6'}>
      <VStack gap={'2'}>
        <Heading size={'xsmall'}>{hentTekst(spørsmål.tekstid, intl)}</Heading>

        {spørsmål.lesmer && (
          <ReadMore header={hentTekst(spørsmål.lesmer.headerTekstid, intl)} size={'small'}>
            {hentTekst(spørsmål.lesmer.innholdTekstid, intl)}
          </ReadMore>
        )}
      </VStack>

      <CheckboxGroup legend={hentTekst(spørsmål.tekstid, intl)} onChange={() => {}} hideLegend>
        {spørsmål.svaralternativer.map((svar) => {
          const verdi = brukSvarIdSomVerdi ? svar.id : svar.svar_tekst;
          const erValgt = valgteSvar.includes(verdi);

          return (
            <Checkbox
              key={svar.id}
              value={verdi}
              checked={erValgt}
              onChange={(e) => settValgteSvar(spørsmål, e.target.checked, svar)}
              className={
                erValgt ? `${styles.checkboxPanel} ${styles.active}` : styles.checkboxPanel
              }
            >
              {hentTekst(svar.svar_tekst, intl)}
            </Checkbox>
          );
        })}
      </CheckboxGroup>
    </VStack>
  );
};
