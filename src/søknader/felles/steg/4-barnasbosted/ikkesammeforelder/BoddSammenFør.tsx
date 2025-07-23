import { IForelder } from '../../../../../models/steg/forelder';
import React, { FC } from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { boddSammenFør } from '../ForeldreConfig';
import { ESvar, ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import JaNeiSpørsmålMedNavn from '../../../../../components/spørsmål/JaNeiSpørsmålMedNavn';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { IBarn } from '../../../../../models/steg/barn';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { DatoBegrensning, Datovelger } from '../../../../../components/dato/Datovelger';

interface Props {
  forelder: IForelder;
  settForelder: (verdi: IForelder) => void;
  barn: IBarn;
}
const BoddSammenFør: FC<Props> = ({ forelder, barn, settForelder }) => {
  const intl = useLokalIntlContext();
  const boddSammenFørSpm = boddSammenFør(intl);

  const settHarBoddsammenFør = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const nyForelder = {
      ...forelder,
      [boddSammenFørSpm.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentBooleanFraValgtSvar(valgtSvar),
      },
    };

    if (valgtSvar.id === ESvar.NEI) {
      delete nyForelder.flyttetFra;
    }

    settForelder(nyForelder);
  };

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmålMedNavn
          spørsmål={boddSammenFørSpm}
          spørsmålTekst={hentBarnNavnEllerBarnet(barn, boddSammenFørSpm.tekstid, intl)}
          onChange={(spørsmål, svar) => settHarBoddsammenFør(spørsmål, svar)}
          valgtSvar={forelder.boddSammenFør?.verdi}
        />
      </KomponentGruppe>
      {forelder.boddSammenFør?.verdi && (
        <KomponentGruppe>
          <Datovelger
            settDato={(dato: string) => {
              settForelder({
                ...forelder,
                flyttetFra: {
                  label: hentTekst('barnasbosted.normaltekst.nårflyttetfra', intl),
                  verdi: dato,
                },
              });
            }}
            valgtDato={
              forelder.flyttetFra && forelder.flyttetFra.verdi
                ? forelder.flyttetFra.verdi
                : undefined
            }
            tekstid={'barnasbosted.normaltekst.nårflyttetfra'}
            datobegrensning={DatoBegrensning.AlleDatoer}
          />
        </KomponentGruppe>
      )}
    </>
  );
};
export default BoddSammenFør;
