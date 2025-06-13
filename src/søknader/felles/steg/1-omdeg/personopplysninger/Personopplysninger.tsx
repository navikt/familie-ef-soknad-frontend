import React from 'react';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import SøkerBorIkkePåAdresse from './SøkerBorIkkePåAdresse';
import {
  borDuPåDenneAdressen,
  harMeldtAdresseendringSpørsmål,
} from './PersonopplysningerConfig';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { Søker } from '../../../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../../../models/søknad/søknadsfelter';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import AlertStripeDokumentasjon from '../../../../../components/AlertstripeDokumentasjon';
import { hentTekst } from '../../../../../utils/søknad';
import { PersonopplysningerVisning } from './PersonopplysningerVisning';
import { Alert, VStack } from '@navikt/ds-react';

interface Props {
  søker: Søker;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
  settSøkerBorPåRegistrertAdresse: (
    søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt
  ) => void;
  harMeldtAdresseendring?: ISpørsmålBooleanFelt;
  settHarMeldtAdresseendring: (
    harMeldtAdresseendring: ISpørsmålBooleanFelt
  ) => void;
  stønadstype: Stønadstype;
}

const Personopplysninger: React.FC<Props> = ({
  søker,
  settDokumentasjonsbehov,
  søkerBorPåRegistrertAdresse,
  settSøkerBorPåRegistrertAdresse,
  harMeldtAdresseendring,
  settHarMeldtAdresseendring,
  stønadstype,
}) => {
  const intl = useLokalIntlContext();

  const settPersonopplysningerFelt = (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar
  ) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    settSøkerBorPåRegistrertAdresse({
      spørsmålid: spørsmål.søknadid,
      svarid: valgtSvar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar,
    });
  };

  const settMeldtAdresseendring = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    settHarMeldtAdresseendring({
      spørsmålid: spørsmål.søknadid,
      svarid: valgtSvar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar,
    });
    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  return (
    <VStack gap={'8'}>
      <Alert variant="info" inline={true}>
        {hentTekst('personopplysninger.alert.infohentet', intl)}
      </Alert>
      <PersonopplysningerVisning
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />
      {!søker?.erStrengtFortrolig && (
        <>
          <KomponentGruppe aria-live="polite">
            <JaNeiSpørsmål
              spørsmål={borDuPåDenneAdressen(intl)}
              valgtSvar={søkerBorPåRegistrertAdresse?.verdi}
              onChange={settPersonopplysningerFelt}
            />
          </KomponentGruppe>

          {søkerBorPåRegistrertAdresse?.verdi === false && (
            <KomponentGruppe>
              <JaNeiSpørsmål
                spørsmål={harMeldtAdresseendringSpørsmål(intl)}
                valgtSvar={harMeldtAdresseendring?.verdi}
                onChange={settMeldtAdresseendring}
              />
              {harMeldtAdresseendring?.verdi === true && (
                <AlertStripeDokumentasjon>
                  <LocaleTekst
                    tekst={'personopplysninger.alert.meldtAdresseendring'}
                  />
                </AlertStripeDokumentasjon>
              )}
              {harMeldtAdresseendring?.verdi === false && (
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
