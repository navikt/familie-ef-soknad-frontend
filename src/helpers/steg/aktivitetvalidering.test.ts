import { describe, expect, test } from 'vitest';
import {
  erUnderUtdanningFerdigUtfylt,
  erAllUtdanningFerdigUtfyltForSkolepenger,
} from './aktivitetvalidering';
import {
  lagDetaljertUtdanning,
  lagSpørsmålFelt,
  lagTekstfelt,
  lagUnderUtdanning,
} from '../../test/domeneUtils';

describe('erUnderUtdanningFerdigUtfylt', () => {
  test('skal returnere false når heltidEllerDeltid mangler', () => {
    const utdanning = lagUnderUtdanning({
      heltidEllerDeltid: undefined,
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
    });

    expect(erUnderUtdanningFerdigUtfylt(utdanning)).toBe(false);
  });

  test('skal returnere true når heltid er valgt og målMedUtdanning er utfylt', () => {
    const utdanning = lagUnderUtdanning({
      heltidEllerDeltid: lagSpørsmålFelt({ verdi: 'Heltid', svarid: 'heltid' }),
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
    });

    expect(erUnderUtdanningFerdigUtfylt(utdanning)).toBe(true);
  });

  test('skal returnere false når heltid er valgt men målMedUtdanning mangler', () => {
    const utdanning = lagUnderUtdanning({
      heltidEllerDeltid: lagSpørsmålFelt({ verdi: 'Heltid', svarid: 'heltid' }),
      målMedUtdanning: undefined,
    });

    expect(erUnderUtdanningFerdigUtfylt(utdanning)).toBe(false);
  });

  test('skal returnere true når deltid er valgt med arbeidsmengde under 100 og mål utfylt', () => {
    const utdanning = lagUnderUtdanning({
      heltidEllerDeltid: lagSpørsmålFelt({ verdi: 'Deltid', svarid: 'deltid' }),
      arbeidsmengde: lagTekstfelt({ verdi: '50' }),
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
    });

    expect(erUnderUtdanningFerdigUtfylt(utdanning)).toBe(true);
  });

  test('skal returnere false når deltid er valgt men arbeidsmengde er 100', () => {
    const utdanning = lagUnderUtdanning({
      heltidEllerDeltid: lagSpørsmålFelt({ verdi: 'Deltid', svarid: 'deltid' }),
      arbeidsmengde: lagTekstfelt({ verdi: '100' }),
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
    });

    expect(erUnderUtdanningFerdigUtfylt(utdanning)).toBe(false);
  });
});

describe('erAllUtdanningFerdigUtfyltForSkolepenger', () => {
  test('skal returnere false når heltidEllerDeltid mangler selv om studiekostnader og mål er utfylt', () => {
    const utdanning = lagDetaljertUtdanning({
      heltidEllerDeltid: undefined,
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
      semesteravgift: lagTekstfelt({ verdi: '100' }),
      harTattUtdanningEtterGrunnskolen: { label: '', verdi: false },
    });

    expect(erAllUtdanningFerdigUtfyltForSkolepenger(utdanning)).toBe(false);
  });

  test('skal returnere true når alt er utfylt for skolepenger med heltid', () => {
    const utdanning = lagDetaljertUtdanning({
      heltidEllerDeltid: lagSpørsmålFelt({ verdi: 'Heltid', svarid: 'heltid' }),
      målMedUtdanning: lagTekstfelt({ verdi: 'Bli sykepleier' }),
      semesteravgift: lagTekstfelt({ verdi: '100' }),
      harTattUtdanningEtterGrunnskolen: { label: '', verdi: false },
    });

    expect(erAllUtdanningFerdigUtfyltForSkolepenger(utdanning)).toBe(true);
  });
});
