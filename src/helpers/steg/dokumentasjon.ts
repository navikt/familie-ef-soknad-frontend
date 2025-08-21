import { IDokumentasjon } from '../../models/steg/dokumentasjon';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../utils/teksthåndtering';
import { LokalIntlShape } from '../../language/typer';

export const hentDokumentasjonTilFlersvarSpørsmål = (
  erHuketAv: boolean | undefined,
  dokumentasjonsbehov: IDokumentasjon[],
  valgtSvar: ISvar,
  intl: LokalIntlShape
) => {
  let endretDokumentasjonsbehov = dokumentasjonsbehov;
  if (erHuketAv === true) {
    endretDokumentasjonsbehov = dokumentasjonsbehov.filter(
      (behov) => behov.svarid !== valgtSvar.id
    );
  } else if (erHuketAv === false) {
    valgtSvar.dokumentasjonsbehov && endretDokumentasjonsbehov.push(valgtSvar.dokumentasjonsbehov);
  }
  return leggTilDokumentasjonLabel(endretDokumentasjonsbehov, intl);
};

export const oppdaterDokumentasjonTilEtSvarSpørsmål = (
  dokumentasjonsbehov: IDokumentasjon[],
  spørsmål: ISpørsmål,
  valgtSvar: ISvar,
  intl: LokalIntlShape
): IDokumentasjon[] => {
  let endretDokumentasjon = dokumentasjonsbehov.filter(
    (behov) => behov.spørsmålid !== spørsmål.søknadid
  );
  endretDokumentasjon = leggTilDokumentasjonsbehov(endretDokumentasjon, valgtSvar);
  return leggTilDokumentasjonLabel(endretDokumentasjon, intl);
};

const gjelderDetteBarnet = (
  dokbehov: IDokumentasjon,
  spørsmål: ISpørsmål,
  barneid: string,
  barnepassid: string | undefined
) => {
  return (
    dokbehov.spørsmålid === spørsmål.søknadid &&
    dokbehov.barneid === barneid &&
    (barnepassid === undefined || dokbehov.barnepassid === barnepassid)
  );
};

export const oppdaterDokumentasjonTilEtSvarSpørsmålForBarn = (
  dokumentasjonsbehov: IDokumentasjon[],
  spørsmål: ISpørsmål,
  valgtSvar: ISvar,
  intl: LokalIntlShape,
  barneid: string,
  barnepassid?: string
): IDokumentasjon[] => {
  let endretDokumentasjon = dokumentasjonsbehov.filter(
    (dokbehov) => !gjelderDetteBarnet(dokbehov, spørsmål, barneid, barnepassid)
  );
  endretDokumentasjon = leggTilDokumentasjonsbehov(
    endretDokumentasjon,
    valgtSvar,
    barneid,
    barnepassid
  );
  return leggTilDokumentasjonLabel(endretDokumentasjon, intl);
};

function leggTilDokumentasjonLabel(dokumentasjon: IDokumentasjon[], intl: LokalIntlShape) {
  return dokumentasjon.map((dokumentasjonsbehov) => {
    return {
      ...dokumentasjonsbehov,
      label: hentTekst(dokumentasjonsbehov.tittel, intl),
    };
  });
}

export const leggTilDokumentasjonsbehov = (
  dokumentasjonsbehov: IDokumentasjon[],
  valgtSvar: ISvar,
  barneid?: string,
  barnepassid?: string
) => {
  const endretDokBehov = dokumentasjonsbehov;
  if (valgtSvar.dokumentasjonsbehov) {
    const nyttDokumentasjonsbehov = {
      ...valgtSvar.dokumentasjonsbehov,
      barneid: barneid,
      barnepassid: barnepassid,
    };
    endretDokBehov.push(nyttDokumentasjonsbehov);
  }

  return endretDokBehov;
};
