import { IForelder } from '../../../../models/steg/forelder';
import React, { FC } from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hvorMyeSammen } from '../ForeldreConfig';
import { hentTekst } from '../../../../utils/søknad';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { EHvorMyeSammen } from '../../../../models/steg/barnasbosted';
import { IBarn } from '../../../../models/steg/barn';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Textarea } from '@navikt/ds-react';

interface Props {
  forelder: IForelder;
  barn: IBarn;
  settForelder: (verdi: IForelder) => void;
}
const HvorMyeSammen: FC<Props> = ({ forelder, barn, settForelder }) => {
  const intl = useLokalIntlContext();

  const hvorMyeSammenConfig = hvorMyeSammen(intl, barn);
  const settHvorMyeSammen = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const nyForelder = {
      ...forelder,
      [hvorMyeSammenConfig.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst('barnasbosted.spm.hvorMyeSammen', intl),
        verdi: valgtSvar.svar_tekst,
      },
    };

    if (
      (valgtSvar.id === EHvorMyeSammen.kunNårLeveres ||
        valgtSvar.id === EHvorMyeSammen.møtesIkke) &&
      nyForelder.beskrivSamværUtenBarn?.verdi
    ) {
      delete nyForelder.beskrivSamværUtenBarn;
    }

    settForelder(nyForelder);
  };

  const settBeskrivSamværUtenBarn = (beskrivelse: string) => {
    settForelder({
      ...forelder,
      beskrivSamværUtenBarn: {
        label: hentTekst('barnasbosted.spm.beskrivSamværUtenBarn', intl),
        verdi: beskrivelse,
      },
    });
  };
  return (
    <>
      <KomponentGruppe>
        <MultiSvarSpørsmålMedNavn
          key={hvorMyeSammenConfig.søknadid}
          spørsmål={hvorMyeSammenConfig}
          spørsmålTekst={hentBarnNavnEllerBarnet(
            barn,
            hvorMyeSammenConfig.tekstid,
            intl
          )}
          valgtSvar={forelder.hvorMyeSammen?.verdi}
          settSpørsmålOgSvar={(spørsmål, svar) =>
            settHvorMyeSammen(spørsmål, svar)
          }
        />
      </KomponentGruppe>
      {forelder.hvorMyeSammen?.svarid === EHvorMyeSammen.møtesUtenom && (
        <>
          <FeltGruppe>
            <Textarea
              autoComplete={'off'}
              value={
                forelder.beskrivSamværUtenBarn &&
                forelder.beskrivSamværUtenBarn.verdi
                  ? forelder.beskrivSamværUtenBarn.verdi
                  : ''
              }
              onChange={(e) => settBeskrivSamværUtenBarn(e.target.value)}
              label={hentBarnNavnEllerBarnet(
                barn,
                'barnasbosted.spm.beskrivSamværUtenBarn',
                intl
              )}
            />
          </FeltGruppe>
        </>
      )}
    </>
  );
};
export default HvorMyeSammen;
