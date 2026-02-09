import React from 'react';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import {
  bosattINorgeDeSisteFemÅr,
  hentLand,
  oppholderSegINorge,
  søkersOppholdsland,
} from './MedlemskapConfig';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { PeriodeBoddIUtlandet } from './PeriodeBoddIUtlandet';
import { IMedlemskap } from '../../../../../models/steg/omDeg/medlemskap';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import SelectSpørsmål from '../../../../../components/spørsmål/SelectSpørsmål';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { useOmDeg } from '../OmDegContext';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { VStack } from '@navikt/ds-react';

export const Medlemskap: React.FC = () => {
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
  const harValgtOppholdsland = oppholdsland?.verdi !== undefined;

  const bosattINorgeDeSisteFemÅrConfig = bosattINorgeDeSisteFemÅr(intl);

  //TODO: Feltet heter søkerBosattINorgeSisteTreÅr men vi spør om fem år nå
  const settBosattSisteFemÅr = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    const tilbakestillOppholdsland = søkerOppholderSegINorge?.verdi;

    settMedlemskap({
      ...medlemskap,
      søkerBosattINorgeSisteTreÅr: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
      oppholdsland: tilbakestillOppholdsland ? undefined : medlemskap.oppholdsland,
      perioderBoddIUtlandet: undefined,
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

  const visOppholdsLandSpørsmål = søkerOppholderSegINorge?.verdi === false;
  const visBosattINorgeSiste5ÅrSpørsmål =
    søkerOppholderSegINorge?.verdi === true ||
    (søkerOppholderSegINorge?.verdi === false && harValgtOppholdsland);
  const visPeriodeBoddIUtland = søkerBosattINorgeSisteTreÅr?.verdi === false;

  return (
    <VStack gap={'space-24'}>
      <JaNeiSpørsmål
        spørsmål={oppholderSegINorgeConfig}
        valgtSvar={hentValgtSvar(oppholderSegINorgeConfig, medlemskap)}
        onChange={settMedlemskapBooleanFelt}
      />
      {visOppholdsLandSpørsmål && (
        <SelectSpørsmål
          spørsmål={oppholdslandConfig}
          valgtSvarId={medlemskap.oppholdsland?.svarid}
          settSpørsmålOgSvar={settOppholdsland}
        />
      )}
      {visBosattINorgeSiste5ÅrSpørsmål && (
        <JaNeiSpørsmål
          spørsmål={bosattINorgeDeSisteFemÅrConfig}
          valgtSvar={hentValgtSvar(bosattINorgeDeSisteFemÅrConfig, medlemskap)}
          onChange={settBosattSisteFemÅr}
        />
      )}
      {visPeriodeBoddIUtland && <PeriodeBoddIUtlandet land={land} />}
    </VStack>
  );
};
