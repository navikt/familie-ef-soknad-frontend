import { CSSProperties } from 'react';
import { TextField, TextFieldProps } from '@navikt/ds-react';

type bredde = 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';

interface Props extends TextFieldProps {
  bredde?: bredde;
}

export const TextFieldMedBredde = ({ bredde, style, ...props }: Props) => (
  <TextField style={bredde ? { ...breddeTilStyle[bredde], ...style } : style} {...props} />
);

const breddeTilStyle: Record<bredde, CSSProperties> = {
  L: {
    width: '100%',
    maxWidth: '315px',
  },
  M: {
    width: '100%',
    maxWidth: '235px',
  },
  S: {
    width: '160px',
  },
  XL: {
    width: '100%',
    maxWidth: '400px',
  },
  XS: {
    width: '110px',
  },
  XXL: {
    width: '100%',
    maxWidth: '470px',
  },
  XXS: {
    width: '80px',
  },
  fullbredde: {
    width: '100%',
  },
};
