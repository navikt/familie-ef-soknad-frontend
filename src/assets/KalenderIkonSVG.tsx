import * as React from 'react';
import { Accent500 } from '@navikt/ds-tokens/dist/tokens';

interface Props {
  height?: number;
  width?: number;
}
const KalenderIkonSVG: React.FC<Props> = ({ height, width }) => (
  <svg
    width={width || 24}
    height={height || 24}
    version="1.1"
    aria-labelledby="Kalender"
    color={Accent500}
    viewBox="0 0 18 18"
    role="presentation"
    focusable={false}
    style={{ pointerEvents: 'none' }}
  >
    <title>Kalenderikon</title>
    <g id="Kalender" stroke="#0067C5" strokeWidth={'1'} fill="none" fillRule="evenodd">
      <path d="M4 2.667H1.333v14h15.334v-14H14" />
      <path d="M4 1.333h2V4H4zm8 0h2V4h-2zM6 2h6M1.333 6h15.334" />
    </g>
  </svg>
);

export default KalenderIkonSVG;
