import { describe, expect } from 'vitest';
import {
  lagIBarn,
  lagIForelder,
  lagSpørsmålFelt,
  lagSøknadBarnetilsyn,
} from '../../../../test/domeneUtils';
import { sanerBarnasBostedSteg } from './sanerBarnasBostedSteg';
import { IBarn } from '../../../../models/steg/barn';
import {
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
} from '../../../../models/steg/barnasbosted';

const praktiserendeSamvær = lagSpørsmålFelt({
  label: 'Hvordan praktiserer dere samværet?',
  verdi: 'Ved å praktisere det!',
});

describe('Skal sanere felter tilhørende barnasBosted', () => {
  test('hvordanPraktiseresSamværet = undefined dersom medforelder ikke har mer samvær enn vanlig og de har beskrivende samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaIkkeMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet).toBe(undefined);
  });

  test('hvordanPraktiseresSamværet = undefined dersom medforelder ikke har mer samvær enn vanlig og de har ikke-beskrivende samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaIkkeMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet).toBe(undefined);
  });

  test('hvordanPraktiseresSamværet = undefined dersom medforelder ikke har mer samvær enn vanlig og de ikke har samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaIkkeMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.nei,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Nei',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet).toBe(undefined);
  });

  //Denne testen tester også at verdiene til de to andre forblir det samme når hvordanPraktiseresSamværet endres til undefined
  test('hvordanPraktiseresSamværet = undefined dersom medforelder har mer samvær enn vanlig og de har beskrivende samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.label).toBe(
      'Har den andre forelderen samvær med Barn 1?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.verdi).toBe(
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.svarid).toBe(
      EHarSamværMedBarn.jaMerEnnVanlig
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.label).toBe(
      'Har dere skriftlig samværsavtale for Barn 1?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.verdi).toBe(
      'Ja, og den beskriver når barnet er sammen med hver av foreldrene'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.svarid).toBe(
      EHarSkriftligSamværsavtale.jaKonkreteTidspunkter
    );

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet).toBe(undefined);
  });

  //Denne testen tester også at verdiene til de to andre forblir det samme når hvordanPraktiseresSamværet ikke endres
  test('hvordanPraktiseresSamværet har riktige verdier dersom medforelder har mer samvær enn vanlig og de har ikke-beskrivende samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.label).toBe(
      'Har den andre forelderen samvær med Barn 1?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.verdi).toBe(
      'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harAnnenForelderSamværMedBarn?.svarid).toBe(
      EHarSamværMedBarn.jaMerEnnVanlig
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.label).toBe(
      'Har dere skriftlig samværsavtale for Barn 1?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.verdi).toBe(
      'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene'
    );
    expect(sanertSøknad.person.barn[0].forelder?.harDereSkriftligSamværsavtale?.svarid).toBe(
      EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter
    );

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet?.label).toBe(
      'Hvordan praktiserer dere samværet?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet?.verdi).toBe(
      'Ved å praktisere det!'
    );
  });

  test('hvordanPraktiseresSamværet har riktige verdier dersom medforelder har mer samvær enn vanlig og de ikke har samværsavtale ', () => {
    const søknad = lagSøknadBarnetilsyn();

    const barnISøknad: IBarn[] = [
      lagIBarn({
        navn: lagSpørsmålFelt({ verdi: 'Barn 1' }),
        forelder: lagIForelder({
          harAnnenForelderSamværMedBarn: lagSpørsmålFelt({
            svarid: EHarSamværMedBarn.jaMerEnnVanlig,
            label: 'Har den andre forelderen samvær med Barn 1?',
            verdi:
              'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
          }),
          harDereSkriftligSamværsavtale: lagSpørsmålFelt({
            svarid: EHarSkriftligSamværsavtale.nei,
            label: 'Har dere skriftlig samværsavtale for Barn 1?',
            verdi: 'Nei',
          }),
          hvordanPraktiseresSamværet: praktiserendeSamvær,
        }),
      }),
    ];

    const sanertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad);

    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet?.label).toBe(
      'Hvordan praktiserer dere samværet?'
    );
    expect(sanertSøknad.person.barn[0].forelder?.hvordanPraktiseresSamværet?.verdi).toBe(
      'Ved å praktisere det!'
    );
  });
});
