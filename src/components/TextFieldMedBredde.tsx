import styled, { CSSObject } from 'styled-components/macro';
import { TextField } from '@navikt/ds-react';

type bredde = 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';

interface Props {
  bredde?: bredde;
}

export const TextFieldMedBredde = styled(TextField)<Props>(
  (props: Props): CSSObject => {
    return props.bredde ? breddeTilStyle[props.bredde] : {};
  }
);

const breddeTilStyle: Record<bredde, CSSObject> = {
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
    width: '80px',
  },
  XXL: {
    width: '100%',
    maxWidth: '470px',
  },
  XXS: {
    width: '75px',
  },
  fullbredde: {
    width: '100%',
  },
};
