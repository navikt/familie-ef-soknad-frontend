import React, { SyntheticEvent } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IBarn } from '../../../../models/steg/barn';
import { IForelder } from '../../../../models/steg/forelder';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentBarnetsNavnEllerBeskrivelse, lagtTilAnnenForelderId } from '../../../../utils/barn';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import RadioPanelCustom from '../../../../components/panel/RadioPanel';
import { RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';

interface Props {
  barn: IBarn;
  forelder: IForelder;
  oppdaterAnnenForelder: (annenForelderId: string) => void;
  førsteBarnTilHverForelder?: IBarn[];
  settBarnHarSammeForelder: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  settForelder: (verdi: IForelder) => void;
  oppdaterBarn: (barn: IBarn, erFørsteAvflereBarn: boolean) => void;
}

const StyledAnnenForelderSpørsmål = styled.div`
  legend {
    display: none;
  }
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    padding-top: 1rem;
  }
`;
const AnnenForelderKnapper: React.FC<Props> = ({
  barn,
  forelder,
  oppdaterAnnenForelder,
  førsteBarnTilHverForelder,
  settBarnHarSammeForelder,
  settForelder,
  oppdaterBarn,
}) => {
  const intl = useLokalIntlContext();

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

    oppdaterBarn(
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
    <KomponentGruppe>
      <StyledAnnenForelderSpørsmål>
        <RadioGroup legend={null} value={barn.annenForelderId}>
          {førsteBarnTilHverForelder.map((barn) => {
            if (!barn.forelder?.borINorge && !barn.forelder?.kanIkkeOppgiAnnenForelderFar)
              return null;

            return (
              <RadioPanelCustom
                key={`${andreForelder}${barn.id}`}
                name={`${andreForelder}${barn.id}`}
                value={barn.id}
                checked={barn.annenForelderId === barn.id}
                onChange={(e) => leggTilSammeForelder(e, barn)}
              >{`${intl.formatMessage({
                id: 'barnasbosted.forelder.sammesom',
              })} ${hentBarnetsNavnEllerBeskrivelse(barn, intl)}`}</RadioPanelCustom>
            );
          })}
          <RadioPanelCustom
            key={andreForelderAnnen}
            name={`${andreForelder}${barn.navn}`}
            value={lagtTilAnnenForelderId}
            checked={barn.annenForelderId === lagtTilAnnenForelderId}
            onChange={() => leggTilAnnenForelder()}
          >
            {intl.formatMessage({ id: 'barnasbosted.forelder.annen' })}
          </RadioPanelCustom>
        </RadioGroup>
      </StyledAnnenForelderSpørsmål>
    </KomponentGruppe>
  );
};

export default AnnenForelderKnapper;
