import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Checkbox, CheckboxGroup, ReadMore } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import styles from './CheckboxSpørsmål.module.css';


interface Props {
  spørsmål: ISpørsmål;
  settValgteSvar: (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => void;
  valgteSvar: string[];
  brukSvarIdSomVerdi?: boolean;
}

const CheckboxSpørsmål: React.FC<Props> = ({
  spørsmål,
  settValgteSvar,
  valgteSvar,
  brukSvarIdSomVerdi,
}) => {
  const intl = useLokalIntlContext();

  return (
    <CheckboxGroup
      legend={hentTekst(spørsmål.tekstid, intl)}
      value={valgteSvar}
      description={
        spørsmål.lesmer && (
          <ReadMore header={hentTekst(spørsmål.lesmer.headerTekstid, intl)} size={'small'}>
            {hentTekst(spørsmål.lesmer.innholdTekstid, intl)}
          </ReadMore>
        )
      }
    >
      {spørsmål.svaralternativer.map((svar) => {
        const alleredeHuketAvISøknad = valgteSvar.some((valgtSvar) => {
          return valgtSvar === svar.svar_tekst || valgtSvar === svar.id;
        });

        return (
          <Checkbox
            key={svar.svar_tekst}
            value={brukSvarIdSomVerdi ? svar.id : svar.svar_tekst}
            checked={alleredeHuketAvISøknad}
            onChange={() => {
              settValgteSvar(spørsmål, alleredeHuketAvISøknad, svar);
            }}
            className={
              alleredeHuketAvISøknad
                ? `${styles.checkboxPanel} ${styles.active}`
                : styles.checkboxPanel
            }
          >
            {hentTekst(svar.svar_tekst, intl)}
          </Checkbox>
        );
      })}
    </CheckboxGroup>
  );
};

export default CheckboxSpørsmål;
