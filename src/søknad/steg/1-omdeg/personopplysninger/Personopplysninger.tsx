import React from 'react';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { Søker } from '../../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/søknad';
import { OmDeg } from './OmDeg';
import { Alert, VStack } from '@navikt/ds-react';
import { OmDegQuestionSection } from '../../../../components/spørsmål/refaktorering/OmDegQuestionSection';
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

  settDokumentasjonsbehov;
  søkerBorPåRegistrertAdresse;
  settSøkerBorPåRegistrertAdresse;
  harMeldtAdresseendring;
  settHarMeldtAdresseendring;
  stønadstype;
  // TODO: Fjern disse

  return (
    <VStack gap={'8'}>
      <Alert variant="info" inline={true}>
        {hentTekst('personopplysninger.alert.infohentet', intl)}
      </Alert>
      <OmDeg
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstand={søker.sivilstand}
        adresse={søker.adresse}
      />

      <OmDegQuestionSection />
    </VStack>
  );
};

export default Personopplysninger;
