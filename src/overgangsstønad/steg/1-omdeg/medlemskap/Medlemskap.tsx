import React from 'react';
import {
  ESvar,
  ISpørsmål,
  ISvar,
} from '../../../../models/felles/spørsmålogsvar';
import {
  oppholderSegINorge,
  bosattINorgeDeSisteFemÅr,
  søkersOppholdsland,
  hentLand,
} from './MedlemskapConfig';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../components/spørsmål/JaNeiSpørsmål';
import PeriodeBoddIUtlandet from './PeriodeBoddIUtlandet';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import {
  EMedlemskap,
  IMedlemskap,
} from '../../../../models/steg/omDeg/medlemskap';
import { hentBooleanFraValgtSvar } from '../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SelectSpørsmål from '../../../../components/spørsmål/SelectSpørsmål';
import { useSpråkContext } from '../../../../context/SpråkContext';

interface Props {
  medlemskap: IMedlemskap;
  settMedlemskap: (medlemskap: IMedlemskap) => void;
}
const Medlemskap: React.FC<Props> = ({ medlemskap, settMedlemskap }) => {
  const intl = useLokalIntlContext();
  const {
    søkerOppholderSegINorge,
    oppholdsland: oppholdsland,
    søkerBosattINorgeSisteTreÅr,
  } = medlemskap;

  const oppholderSegINorgeConfig = oppholderSegINorge(intl);

  const [locale] = useSpråkContext();
  const land = hentLand(locale);
  const oppholdslandConfig = søkersOppholdsland(land);

  const bosattINorgeDeSisteTreÅrConfig = bosattINorgeDeSisteFemÅr(intl);

  const settMedlemskapBooleanFelt = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    if (
      spørsmål.søknadid === EMedlemskap.søkerOppholderSegINorge &&
      valgtSvar.id === ESvar.JA &&
      medlemskap.oppholdsland
    ) {
      delete medlemskap.oppholdsland;
    }

    if (
      spørsmål.søknadid === EMedlemskap.søkerBosattINorgeSisteTreÅr &&
      valgtSvar.id === ESvar.JA &&
      medlemskap.perioderBoddIUtlandet
    ) {
      delete medlemskap.perioderBoddIUtlandet;
    }

    settMedlemskap({
      ...medlemskap,
      [spørsmål.søknadid]: {
        label: intl.formatMessage({ id: spørsmål.tekstid }),
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

  const valgtSvarOppholderSegINorge = hentValgtSvar(
    oppholderSegINorgeConfig,
    medlemskap
  );

  return (
    <SeksjonGruppe aria-live="polite">
      <KomponentGruppe key={oppholderSegINorgeConfig.søknadid}>
        <JaNeiSpørsmål
          spørsmål={oppholderSegINorgeConfig}
          valgtSvar={valgtSvarOppholderSegINorge}
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
          <KomponentGruppe key={bosattINorgeDeSisteTreÅrConfig.søknadid}>
            <JaNeiSpørsmål
              spørsmål={bosattINorgeDeSisteTreÅrConfig}
              valgtSvar={hentValgtSvar(
                bosattINorgeDeSisteTreÅrConfig,
                medlemskap
              )}
              onChange={settMedlemskapBooleanFelt}
            />
          </KomponentGruppe>

          {søkerBosattINorgeSisteTreÅr?.verdi === false && (
            <PeriodeBoddIUtlandet
              medlemskap={medlemskap}
              settMedlemskap={settMedlemskap}
              land={land}
            />
          )}
        </>
      )}
    </SeksjonGruppe>
  );
};

export default Medlemskap;
