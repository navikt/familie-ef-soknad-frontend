import React from 'react';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
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

const Personopplysninger: React.FC = () => {
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

  return (
    <VStack gap={'8'}>
      <PersonopplysningerVisning
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />

      {visAdresseSpørsmål && (
        <>
          <KomponentGruppe aria-live="polite">
            <JaNeiSpørsmål
              spørsmål={borDuPåDenneAdressen(intl)}
              valgtSvar={søkerBorPåRegistrertAdresse?.verdi}
              onChange={settSøkerBorPåRegistrertAdr}
            />
          </KomponentGruppe>

          {søkerBorPåRegistrertAdresse?.verdi === false && (
            <KomponentGruppe>
              <JaNeiSpørsmål
                spørsmål={harMeldtAdresseendringSpørsmål(intl)}
                valgtSvar={adresseopplysninger?.harMeldtAdresseendring?.verdi}
                onChange={settMeldtAdresseendring}
              />
              {adresseopplysninger?.harMeldtAdresseendring?.verdi === true && (
                <AlertStripeDokumentasjon>
                  {hentTekst('personopplysninger.alert.meldtAdresseendring', intl)}
                </AlertStripeDokumentasjon>
              )}
              {adresseopplysninger?.harMeldtAdresseendring?.verdi === false && (
                <SøkerBorIkkePåAdresse stønadstype={stønadstype} />
              )}
            </KomponentGruppe>
          )}
        </>
      )}
    </VStack>
  );
};

export default Personopplysninger;
