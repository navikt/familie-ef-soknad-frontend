import React from 'react';
import LocaleTekst from '../../../../../language/LocaleTekst';
import SøkerBorIkkePåAdresse from './SøkerBorIkkePåAdresse';
import {
  borDuPåDenneAdressenStegSpørsmål,
  harMeldtAdresseendringStegSpørsmål,
} from './PersonopplysningerConfig';
import { ESvar, SvarAlternativ } from '../../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { PersonopplysningerVisning } from './PersonopplysningerVisning';
import { Alert, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';
import { JaNeiSpørsmålV2 } from '../../../../../components/spørsmål/JaNeiSpørsmålV2';

export const Personopplysninger: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    søkerBorPåRegistrertAdresse,
    settSøkerBorPåRegistrertAdresse,
    adresseopplysninger,
    settAdresseopplysninger,
    stønadstype,
  } = useOmDeg();
  const { søker } = søknad.person;

  const settSøkerBorPåAdresseMedSvar = (svarAlternativ: SvarAlternativ) => {
    const spørsmål = borDuPåDenneAdressenStegSpørsmål();
    const svarVerdiSomBoolean = svarAlternativ.id === ESvar.JA;

    settSøkerBorPåRegistrertAdresse({
      spørsmålid: spørsmål.id,
      svarid: svarAlternativ.id,
      label: hentTekst(spørsmål.spørsmålKey, intl),
      verdi: svarVerdiSomBoolean,
    });
  };

  const settMeldtAdresseendringMedSvar = (svarAlternativ: SvarAlternativ) => {
    const spørsmål = harMeldtAdresseendringStegSpørsmål();
    const svarVerdiSomBoolean = svarAlternativ.id === ESvar.JA;

    settAdresseopplysninger({
      harMeldtAdresseendring: {
        spørsmålid: spørsmål.id,
        svarid: svarAlternativ.id,
        label: hentTekst(spørsmål.spørsmålKey, intl),
        verdi: svarVerdiSomBoolean,
      },
    });

    // TODO: Fiks denne.
    // settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const skalViseSpørsmål = !søker?.erStrengtFortrolig;
  const skalViseSøkerBorPåRegistretAdresseSpørsmål = søkerBorPåRegistrertAdresse?.verdi === false;
  const skalViseSøkerBorPåRegistretAdresseAlert =
    adresseopplysninger?.harMeldtAdresseendring?.verdi === true;
  const skalViseSøkerBorIkkePåRegistrertAdresse =
    adresseopplysninger?.harMeldtAdresseendring?.verdi === false;

  return (
    <VStack gap={'8'}>
      <PersonopplysningerVisning
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />

      {skalViseSpørsmål && (
        <VStack gap={'6'}>
          <JaNeiSpørsmålV2
            spørsmål={borDuPåDenneAdressenStegSpørsmål()}
            onChange={settSøkerBorPåAdresseMedSvar}
          />

          {skalViseSøkerBorPåRegistretAdresseSpørsmål && (
            <JaNeiSpørsmålV2
              spørsmål={harMeldtAdresseendringStegSpørsmål()}
              onChange={settMeldtAdresseendringMedSvar}
            />
          )}

          {skalViseSøkerBorPåRegistretAdresseAlert && (
            <Alert variant={'info'} size={'small'} inline>
              <LocaleTekst tekst={'personopplysninger.alert.meldtAdresseendring'} />
            </Alert>
          )}

          {skalViseSøkerBorIkkePåRegistrertAdresse && (
            <SøkerBorIkkePåAdresse stønadstype={stønadstype} />
          )}
        </VStack>
      )}
    </VStack>
  );
};
