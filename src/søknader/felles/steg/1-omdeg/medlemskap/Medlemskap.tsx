import React from 'react';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import {
  bosattINorgeDeSisteFemÅr,
  hentLand,
  oppholderSegINorge,
  søkersOppholdsland,
} from './MedlemskapConfig';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import PeriodeBoddIUtlandet from './PeriodeBoddIUtlandet';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import { IMedlemskap } from '../../../../../models/steg/omDeg/medlemskap';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import SelectSpørsmål from '../../../../../components/spørsmål/SelectSpørsmål';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { useOmDeg } from '../OmDegContext';
import { hentTekst } from '../../../../../utils/teksthåndtering';

const Medlemskap: React.FC = () => {
  const intl = useLokalIntlContext();
  const { medlemskap, settMedlemskap } = useOmDeg();

  const oppholderSegINorgeConfig = oppholderSegINorge(intl);

  const [locale] = useSpråkContext();

  if (!medlemskap) return null;

  const {
    søkerOppholderSegINorge,
    oppholdsland: oppholdsland,
    søkerBosattINorgeSisteTreÅr,
  } = medlemskap;

  const land = hentLand(locale);
  const oppholdslandConfig = søkersOppholdsland(land);

  const bosattINorgeDeSisteFemÅrConfig = bosattINorgeDeSisteFemÅr(intl);

  //TODO: Feltet heter søkerBosattINorgeSisteTreÅr men vi spør om fem år nå
  const settBosattSisteFemÅr = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    settMedlemskap({
      ...medlemskap,
      søkerBosattINorgeSisteTreÅr: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
    });
  };

  const settMedlemskapBooleanFelt = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    settMedlemskap({
      ...medlemskap,
      søkerOppholderSegINorge: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
    });
  };

  const settOppholdsland = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settMedlemskap({
      ...medlemskap,
      oppholdsland: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: valgtSvar.svar_tekst,
      },
    });
  };

  const hentValgtSvar = (spørsmål: ISpørsmål, medlemskap: IMedlemskap) => {
    for (const [key, value] of Object.entries(medlemskap)) {
      if (key === spørsmål.søknadid && value !== undefined && value !== null) {
        return value.verdi;
      }
    }
  };

  return (
    <SeksjonGruppe aria-live="polite">
      <KomponentGruppe key={oppholderSegINorgeConfig.søknadid}>
        <JaNeiSpørsmål
          spørsmål={oppholderSegINorgeConfig}
          valgtSvar={hentValgtSvar(oppholderSegINorgeConfig, medlemskap)}
          onChange={settMedlemskapBooleanFelt}
        />
      </KomponentGruppe>

      {søkerOppholderSegINorge?.verdi === false && (
        <KomponentGruppe>
          <SelectSpørsmål
            spørsmål={oppholdslandConfig}
            valgtSvarId={medlemskap.oppholdsland?.svarid}
            settSpørsmålOgSvar={settOppholdsland}
          />
        </KomponentGruppe>
      )}

      {(søkerOppholderSegINorge?.verdi === true ||
        (søkerOppholderSegINorge?.verdi === false &&
          // eslint-disable-next-line no-prototype-builtins
          oppholdsland?.hasOwnProperty('verdi'))) && (
        <>
          <KomponentGruppe key={bosattINorgeDeSisteFemÅrConfig.søknadid}>
            <JaNeiSpørsmål
              spørsmål={bosattINorgeDeSisteFemÅrConfig}
              valgtSvar={hentValgtSvar(bosattINorgeDeSisteFemÅrConfig, medlemskap)}
              onChange={settBosattSisteFemÅr}
            />
          </KomponentGruppe>

          {søkerBosattINorgeSisteTreÅr?.verdi === false && <PeriodeBoddIUtlandet land={land} />}
        </>
      )}
    </SeksjonGruppe>
  );
};

export default Medlemskap;
