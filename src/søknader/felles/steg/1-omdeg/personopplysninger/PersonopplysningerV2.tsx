import React from 'react';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { borDuPåDenneAdressen, harMeldtAdresseendringSpørsmål } from './PersonopplysningerConfig';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { PersonopplysningerVisning } from './PersonopplysningerVisning';
import { Alert, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';
import { JaNeiSpørsmål } from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { SøkerBorIkkePåAdresse } from './SøkerBorIkkePåAdresse';

const PersonopplysningerV2: React.FC = () => {
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

  const skalViseBorPåAdresse = !søker?.erStrengtFortrolig;
  const skalViseHarMeldtAdresseEndring = søkerBorPåRegistrertAdresse?.verdi === false;
  const skalViseHarMeldtAdresseEndringAlert =
    adresseopplysninger?.harMeldtAdresseendring?.verdi === true;
  const skalViseSøkerBorIkkePåAdresse =
    adresseopplysninger?.harMeldtAdresseendring?.verdi === false;

  return (
    <VStack gap={'8'}>
      <PersonopplysningerVisning
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />

      {skalViseBorPåAdresse && (
        <VStack gap={'6'}>
          <JaNeiSpørsmål
            spørsmål={borDuPåDenneAdressen(intl)}
            valgtSvar={søkerBorPåRegistrertAdresse?.verdi}
            onChange={settSøkerBorPåRegistrertAdr}
          />

          {skalViseHarMeldtAdresseEndring && (
            <VStack gap={'6'}>
              <JaNeiSpørsmål
                spørsmål={harMeldtAdresseendringSpørsmål(intl)}
                valgtSvar={adresseopplysninger?.harMeldtAdresseendring?.verdi}
                onChange={settMeldtAdresseendring}
              />

              {skalViseHarMeldtAdresseEndringAlert && (
                <Alert variant={'info'} inline size={'small'}>
                  <LocaleTekst tekst={'personopplysninger.alert.meldtAdresseendring'} />
                </Alert>
              )}
            </VStack>
          )}

          {skalViseSøkerBorIkkePåAdresse && <SøkerBorIkkePåAdresse stønadstype={stønadstype} />}
        </VStack>
      )}
    </VStack>
  );
};

export default PersonopplysningerV2;
