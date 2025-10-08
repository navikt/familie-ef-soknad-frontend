import { SøknadOvergangsstønad } from '../../models/søknad';
import {
  ESagtOppEllerRedusertStilling,
  ESøkerFraBestemtMåned,
  IDinSituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { harSøkerMindreEnnHalvStilling } from '../../../felles/steg/6-meromsituasjon/SituasjonUtil';
import {
  IDatoFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
  ITekstFelt,
} from '../../../../models/søknad/søknadsfelter';

export const sanerMerOmDinSituasjonSteg = (
  søknad: SøknadOvergangsstønad
): SøknadOvergangsstønad => {
  const sanertDinSituasjon = sanerDinSituasjon(søknad.merOmDinSituasjon, søknad);

  return {
    ...søknad,
    merOmDinSituasjon: sanertDinSituasjon,
  };
};

const sanerDinSituasjon = (
  dinSituasjon: IDinSituasjon,
  søknad: SøknadOvergangsstønad
): IDinSituasjon => {
  const harValgtMinstEttAlternativ = dinSituasjon.gjelderDetteDeg.svarid.length > 0;

  if (!harValgtMinstEttAlternativ) {
    return {
      gjelderDetteDeg: dinSituasjon.gjelderDetteDeg,
      søknadsdato: undefined,
      sagtOppEllerRedusertStilling: undefined,
      begrunnelseSagtOppEllerRedusertStilling: undefined,
      datoSagtOppEllerRedusertStilling: undefined,
      søkerFraBestemtMåned: undefined,
    };
  }

  const søkerJobberMindreEnnFemtiProsent = harSøkerMindreEnnHalvStilling(søknad);
  const sanertSagtOppEllerRedusertStilling = søkerJobberMindreEnnFemtiProsent
    ? dinSituasjon.sagtOppEllerRedusertStilling
    : undefined;

  const sanertBegrunnelseSagtOppEllerRedusertStilling =
    sanerBegrunnelseSagtOppEllerRedusertStilling(
      søkerJobberMindreEnnFemtiProsent,
      dinSituasjon.sagtOppEllerRedusertStilling,
      dinSituasjon.begrunnelseSagtOppEllerRedusertStilling
    );

  const sanertDatoSagtOppEllerRedusertStilling = sanerDatoSagtOppEllerRedusertStilling(
    søkerJobberMindreEnnFemtiProsent,
    dinSituasjon.sagtOppEllerRedusertStilling,
    dinSituasjon.datoSagtOppEllerRedusertStilling
  );

  const sanertSøknadsdato = sanerSøknadsdato(
    dinSituasjon.søkerFraBestemtMåned,
    dinSituasjon.søknadsdato
  );

  return {
    gjelderDetteDeg: dinSituasjon.gjelderDetteDeg,
    søknadsdato: sanertSøknadsdato,
    sagtOppEllerRedusertStilling: sanertSagtOppEllerRedusertStilling,
    begrunnelseSagtOppEllerRedusertStilling: sanertBegrunnelseSagtOppEllerRedusertStilling,
    datoSagtOppEllerRedusertStilling: sanertDatoSagtOppEllerRedusertStilling,
    søkerFraBestemtMåned: dinSituasjon.søkerFraBestemtMåned,
  };
};

const sanerBegrunnelseSagtOppEllerRedusertStilling = (
  søkerJobberMindreEnnFemtiProsent: boolean,
  sagtOppEllerRedusertStilling?: ISpørsmålFelt,
  begrunnelseSagtOppEllerRedusertStilling?: ITekstFelt
): ITekstFelt | undefined => {
  if (!søkerJobberMindreEnnFemtiProsent) {
    return undefined;
  }

  const skalHaBegrunnelse =
    sagtOppEllerRedusertStilling?.svarid === ESagtOppEllerRedusertStilling.sagtOpp ||
    sagtOppEllerRedusertStilling?.svarid === ESagtOppEllerRedusertStilling.redusertStilling;

  return skalHaBegrunnelse ? begrunnelseSagtOppEllerRedusertStilling : undefined;
};

const sanerDatoSagtOppEllerRedusertStilling = (
  søkerJobberMindreEnnFemtiProsent: boolean,
  sagtOppEllerRedusertStilling?: ISpørsmålFelt,
  datoSagtOppEllerRedusertStilling?: IDatoFelt
): IDatoFelt | undefined => {
  if (!søkerJobberMindreEnnFemtiProsent) {
    return undefined;
  }

  const skalHaDato =
    sagtOppEllerRedusertStilling?.svarid === ESagtOppEllerRedusertStilling.sagtOpp ||
    sagtOppEllerRedusertStilling?.svarid === ESagtOppEllerRedusertStilling.redusertStilling;

  return skalHaDato ? datoSagtOppEllerRedusertStilling : undefined;
};

const sanerSøknadsdato = (
  søkerFraBestemtMåned?: ISpørsmålBooleanFelt,
  søknadsdato?: IDatoFelt
): IDatoFelt | undefined => {
  const skalHaSøknadsdato = søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.ja;

  return skalHaSøknadsdato ? søknadsdato : undefined;
};
