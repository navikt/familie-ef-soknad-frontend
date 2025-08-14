import React from 'react';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import SøkerBorIkkePåAdresse from './SøkerBorIkkePåAdresse';
import { borDuPåDenneAdressen, harMeldtAdresseendringSpørsmål } from './PersonopplysningerConfig';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import AlertStripeDokumentasjon from '../../../../../components/AlertstripeDokumentasjon';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { PersonopplysningerVisning } from './PersonopplysningerVisning';
import { VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';

export const Personopplysninger: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    settDokumentasjonsbehov,
    søkerBorPåRegistrertAdresse,
    settSøkerBorPåRegistrertAdresse,
    adresseopplysninger,
    settAdresseopplysninger,
    stønadstype,
  } = useOmDeg();
  const { søker } = søknad.person;

  const settSøkerBorPåRegistrertAdr = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    settSøkerBorPåRegistrertAdresse({
      spørsmålid: spørsmål.søknadid,
      svarid: valgtSvar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: hentBooleanFraValgtSvar(valgtSvar),
    });
  };

  const settMeldtAdresseendring = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    settAdresseopplysninger({
      harMeldtAdresseendring: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
    });
    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const visAdresseSpørsmål = !søker?.erStrengtFortrolig;
  const visMeldtAdresseEndringSpørsmål = søkerBorPåRegistrertAdresse?.verdi === false;
  const visMeldtAdresseEndringAlert = adresseopplysninger?.harMeldtAdresseendring?.verdi === true;
  const visSøkerBorIkkePåAdresse = adresseopplysninger?.harMeldtAdresseendring?.verdi === false;

  return (
    <VStack gap={'8'}>
      <PersonopplysningerVisning
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />

      {visAdresseSpørsmål && (
        <VStack gap={'8'}>
          <JaNeiSpørsmål
            spørsmål={borDuPåDenneAdressen(intl)}
            valgtSvar={søkerBorPåRegistrertAdresse?.verdi}
            onChange={settSøkerBorPåRegistrertAdr}
          />

          {visMeldtAdresseEndringSpørsmål && (
            <JaNeiSpørsmål
              spørsmål={harMeldtAdresseendringSpørsmål(intl)}
              valgtSvar={adresseopplysninger?.harMeldtAdresseendring?.verdi}
              onChange={settMeldtAdresseendring}
            />
          )}

          {visMeldtAdresseEndringAlert && (
            <AlertStripeDokumentasjon>
              {hentTekst('personopplysninger.alert.meldtAdresseendring', intl)}
            </AlertStripeDokumentasjon>
          )}

          {visSøkerBorIkkePåAdresse && <SøkerBorIkkePåAdresse stønadstype={stønadstype} />}
        </VStack>
      )}
    </VStack>
  );
};
