import React, { SyntheticEvent } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IBarn } from '../../../../models/steg/barn';
import { IForelder } from '../../../../models/steg/forelder';
import { harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentBarnetsNavnEllerBeskrivelse, lagtTilAnnenForelderId } from '../../../../utils/barn';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { RadioKnapp } from '../../../../components/panel/RadioKnapp';
import { RadioGroup } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { TypeBarn } from '../../../../models/steg/barnasbosted';
import { useBarnasBosted } from './BarnasBostedContext';
import styles from '../../../../components/spørsmål/Spørsmål.module.css';

interface Props {
  barn: IBarn;
  forelder: IForelder;
  førsteBarnTilHverForelder?: IBarn[];
  settBarnHarSammeForelder: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  settForelder: (verdi: IForelder) => void;
  typeBarn: TypeBarn;
}

export const AnnenForelderKnapper: React.FC<Props> = ({
  barn,
  forelder,
  førsteBarnTilHverForelder,
  settBarnHarSammeForelder,
  settForelder,
  typeBarn,
}) => {
  const intl = useLokalIntlContext();
  const { oppdaterBarnMedNyForelderInformasjon } = useBarnasBosted();

  const oppdaterAnnenForelder = (annenForelderId: string) => {
    oppdaterBarnMedNyForelderInformasjon(
      { ...barn, annenForelderId: annenForelderId },
      typeBarn === TypeBarn.BARN_MED_OPPRINNELIG_FORELDERINFORMASJON
    );
  };

  const leggTilSammeForelder = (e: SyntheticEvent<EventTarget, Event>, detAndreBarnet: IBarn) => {
    settBarnHarSammeForelder(true);
    const oppdatertForelder = structuredClone(detAndreBarnet.forelder);

    oppdaterAnnenForelder(detAndreBarnet.id);

    settForelder({
      ...barn.forelder,
      id: oppdatertForelder?.id,
      navn: oppdatertForelder?.navn,
      fødselsdato: oppdatertForelder?.fødselsdato,
      ident: oppdatertForelder?.ident,
      borINorge: oppdatertForelder?.borINorge,
      borAnnenForelderISammeHus: oppdatertForelder?.borAnnenForelderISammeHus,
      borAnnenForelderISammeHusBeskrivelse: oppdatertForelder?.borAnnenForelderISammeHusBeskrivelse,
      boddSammenFør: oppdatertForelder?.boddSammenFør,
      flyttetFra: oppdatertForelder?.flyttetFra,
      hvorMyeSammen: oppdatertForelder?.hvorMyeSammen,
      beskrivSamværUtenBarn: oppdatertForelder?.beskrivSamværUtenBarn,
      land: oppdatertForelder?.land,
      fraFolkeregister: oppdatertForelder?.fraFolkeregister,
      skalBarnetBoHosSøker: forelder.skalBarnetBoHosSøker,
      erKopiertFraAnnetBarn: true,
    });
  };

  const leggTilAnnenForelder = () => {
    settBarnHarSammeForelder(false);
    const id = hentUid();

    const annenForelder =
      !barn.harSammeAdresse.verdi && harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi)
        ? {
            skalBarnetBoHosSøker: forelder.skalBarnetBoHosSøker,
            id,
          }
        : { id };

    oppdaterBarnMedNyForelderInformasjon(
      {
        ...barn,
        annenForelderId: lagtTilAnnenForelderId,
        forelder: annenForelder,
      },
      false
    );
    settForelder(annenForelder);
  };

  const andreForelder = 'andre-forelder-';
  const andreForelderAnnen = 'andre-forelder-annen';

  if (!førsteBarnTilHverForelder) return null;

  return (
    <div className={`${styles.radioGruppe} ${styles.multiSvar} ${styles.hiddenLegend}`}>
      <RadioGroup legend={null} value={barn.annenForelderId}>
        {førsteBarnTilHverForelder.map((barn) => {
          if (!barn.forelder?.borINorge && !barn.forelder?.kanIkkeOppgiAnnenForelderFar)
            return null;

          return (
            <RadioKnapp
              key={`${andreForelder}${barn.id}`}
              name={`${andreForelder}${barn.id}`}
              value={barn.id}
              checked={barn.annenForelderId === barn.id}
              onChange={(e) => leggTilSammeForelder(e, barn)}
            >{`${hentTekst('barnasbosted.forelder.sammesom', intl)} ${hentBarnetsNavnEllerBeskrivelse(barn, intl)}`}</RadioKnapp>
          );
        })}
        <RadioKnapp
          key={andreForelderAnnen}
          name={`${andreForelder}${barn.navn}`}
          value={lagtTilAnnenForelderId}
          checked={barn.annenForelderId === lagtTilAnnenForelderId}
          onChange={() => leggTilAnnenForelder()}
        >
          {hentTekst('barnasbosted.forelder.annen', intl)}
        </RadioKnapp>
      </RadioGroup>
    </div>
  );
};
