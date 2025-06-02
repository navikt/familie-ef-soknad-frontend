import React, { FC } from 'react';
import { EForelder, IForelder } from '../../../../../models/steg/forelder';
import {
  ESvar,
  ISpørsmål,
  ISvar,
} from '../../../../../models/felles/spørsmålogsvar';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { borINorge } from '../ForeldreConfig';
import { hentTekst } from '../../../../../utils/søknad';
import JaNeiSpørsmålMedNavn from '../../../../../components/spørsmål/JaNeiSpørsmålMedNavn';
import { IBarn } from '../../../../../models/steg/barn';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import {
  erJaNeiSvar,
  hentBooleanFraValgtSvar,
} from '../../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import SelectSpørsmål from '../../../../../components/spørsmål/SelectSpørsmål';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { hentLand } from '../../1-omdeg/medlemskap/MedlemskapConfig';
import { ILandMedKode } from '../../../../../models/steg/omDeg/medlemskap';
import { SettDokumentasjonsbehovBarn } from '../../../../../models/søknad/søknad';

const utledOppholdslandConfig = (land: ILandMedKode[]): ISpørsmål => ({
  søknadid: 'denAndreForelderensOppholdsland',
  tekstid: 'barnasbosted.hvilketLand',
  flersvar: false,
  svaralternativer: land,
});

interface Props {
  barn: IBarn;
  forelder: IForelder;
  settForelder: (verdi: IForelder) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

const BorForelderINorge: FC<Props> = ({
  settForelder,
  barn,
  forelder,
  settDokumentasjonsbehovForBarn,
}) => {
  const [locale] = useSpråkContext();
  const land = hentLand(locale);
  const oppholdslandConfig = utledOppholdslandConfig(land);
  const intl = useLokalIntlContext();

  const settFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
    const nyForelder = {
      ...forelder,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: erJaNeiSvar(svar)
          ? hentBooleanFraValgtSvar(svar)
          : svar.svar_tekst,
      },
    };

    if (
      spørsmål.søknadid === EForelder.borINorge &&
      nyForelder.land &&
      svar.id === ESvar.JA
    ) {
      delete nyForelder.land;
    }
    settForelder(nyForelder);
    settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id);
  };

  const oppdaterMedforeldersOppholdsland = (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar
  ) => {
    settForelder({
      ...forelder,
      land: {
        label: hentTekst('barnasbosted.land', intl),
        verdi: valgtSvar.svar_tekst,
        svarid: valgtSvar.id,
        spørsmålid: spørsmål.søknadid,
      },
    });
  };

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmålMedNavn
          spørsmål={borINorge(intl)}
          spørsmålTekst={hentBarnNavnEllerBarnet(
            barn,
            borINorge(intl).tekstid,
            intl
          )}
          onChange={settFelt}
          valgtSvar={forelder.borINorge?.verdi}
        />
      </KomponentGruppe>
      {forelder.borINorge?.verdi === false && (
        <KomponentGruppe>
          <SelectSpørsmål
            spørsmål={oppholdslandConfig}
            valgtSvarId={forelder.land?.svarid}
            settSpørsmålOgSvar={oppdaterMedforeldersOppholdsland}
          />
        </KomponentGruppe>
      )}
    </>
  );
};

export default BorForelderINorge;
