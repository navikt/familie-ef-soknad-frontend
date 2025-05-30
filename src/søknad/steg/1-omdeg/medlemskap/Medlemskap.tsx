import React from 'react';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import {
  bosattINorgeDeSisteFemÅr,
  hentLand,
  oppholderSegINorge,
  søkersOppholdsland,
} from './MedlemskapConfig';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../components/spørsmål/JaNeiSpørsmål';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import { hentBooleanFraValgtSvar } from '../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOmDeg } from '../../../../barnetilsyn/steg/1-omdeg/OmDegContext';
import { useSpråkContext } from '../../../../context/SpråkContext';
import SelectSpørsmål from '../../../../components/spørsmål/SelectSpørsmål';
import PeriodeBoddIUtlandet from './PeriodeBoddIUtlandet';

const Medlemskap: React.FC = () => {
  const intl = useLokalIntlContext();
  const { medlemskap2, settMedlemskap2 } = useOmDeg();

  const oppholderSegINorgeConfig = oppholderSegINorge(intl);

  const [locale] = useSpråkContext();

  if (!medlemskap2) return null;

  const {
    søkerOppholderSegINorge,
    oppholdsland: oppholdsland,
    søkerBosattINorgeSisteTreÅr,
  } = medlemskap2;

  const land = hentLand(locale);
  const oppholdslandConfig = søkersOppholdsland(land);

  const bosattINorgeDeSisteFemÅrConfig = bosattINorgeDeSisteFemÅr(intl);

  const settBosattSisteFemÅr2 = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    settMedlemskap2({
      ...medlemskap2,
      søkerBosattINorgeSisteTreÅr: {
        label: intl.formatMessage({ id: spørsmål.tekstid }),
        verdi: svar,
      },
    });
  };

  const settMedlemskapBooleanFelt2 = (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar
  ) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    settMedlemskap2({
      ...medlemskap2,
      søkerOppholderSegINorge: {
        label: intl.formatMessage({ id: spørsmål.tekstid }),
        verdi: svar,
      },
    });
  };

  const settOppholdsland2 = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settMedlemskap2({
      ...medlemskap2,
      oppholdsland: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: intl.formatMessage({ id: spørsmål.tekstid }),
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
          valgtSvar={hentValgtSvar(oppholderSegINorgeConfig, medlemskap2)}
          onChange={settMedlemskapBooleanFelt2}
        />
      </KomponentGruppe>

      {søkerOppholderSegINorge?.verdi === false && (
        <KomponentGruppe>
          <SelectSpørsmål
            spørsmål={oppholdslandConfig}
            valgtSvarId={medlemskap2.oppholdsland?.svarid}
            settSpørsmålOgSvar={settOppholdsland2}
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
              valgtSvar={hentValgtSvar(
                bosattINorgeDeSisteFemÅrConfig,
                medlemskap2
              )}
              onChange={settBosattSisteFemÅr2}
            />
          </KomponentGruppe>

          {søkerBosattINorgeSisteTreÅr?.verdi === false && (
            <PeriodeBoddIUtlandet land={land} />
          )}
        </>
      )}
    </SeksjonGruppe>
  );
};

export default Medlemskap;
