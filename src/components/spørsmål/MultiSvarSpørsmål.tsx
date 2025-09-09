import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioGroup, ReadMore } from '@navikt/ds-react';
import { RadioPanelCustom } from '../panel/RadioPanel';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import styles from './MultiSvarSpørsmål.module.css';

interface Props {
  className?: string;
  spørsmål: ISpørsmål;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: string | undefined;
}

export const MultiSvarSpørsmål: FC<Props> = ({
  className,
  spørsmål,
  settSpørsmålOgSvar,
  valgtSvar,
}) => {
  const intl = useLokalIntlContext();

  const legend = hentTekst(spørsmål.tekstid, intl);

  return (
    <RadioGroup
      key={spørsmål.søknadid}
      className={`${styles.multiSvarSpørsmål} ${className || ''}`}
      legend={legend}
      value={valgtSvar}
      description={
        spørsmål.lesmer && (
          <ReadMore header={hentTekst(spørsmål.lesmer.headerTekstid, intl)} size={'small'}>
            {hentHTMLTekst(spørsmål.lesmer.innholdTekstid, intl)}
          </ReadMore>
        )
      }
    >
      {spørsmål.svaralternativer.map((svar: ISvar) => {
        const svarISøknad = svar.svar_tekst === valgtSvar;
        return (
          <RadioPanelCustom
            key={svar.svar_tekst}
            name={spørsmål.søknadid}
            value={svar.svar_tekst}
            checked={svarISøknad ? svarISøknad : false}
            onChange={() => {
              settSpørsmålOgSvar(spørsmål, svar);
            }}
          >
            {svar.svar_tekst}
          </RadioPanelCustom>
        );
      })}
    </RadioGroup>
  );
};
