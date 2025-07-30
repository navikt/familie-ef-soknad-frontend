import { ESvarTekstid, ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  DinSituasjonType,
  ESagtOppEllerRedusertStilling,
  ESituasjon,
  ESøkerFraBestemtMåned,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

// DOKUMENTASJON
export const DokumentasjonSykdom: IDokumentasjon = DokumentasjonsConfig.DokumentasjonSykdom;

export const DokumentasjonSyktBarn: IDokumentasjon = DokumentasjonsConfig.DokumentasjonSyktBarn;

export const DokumentasjonBarnepassMangel: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonBarnepassMangel;

export const DokumentasjonBarnetilsynBehov: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonBarnetilsynBehov;

export const ArbeidsforholdOgOppsigelsesårsak: IDokumentasjon =
  DokumentasjonsConfig.ArbeidsforholdOgOppsigelsesårsak;

export const ArbeidsforholdOgRedusertArbeidstid: IDokumentasjon =
  DokumentasjonsConfig.ArbeidsforholdOgRedusertArbeidstid;

// SPØRSMÅL
export const gjelderNoeAvDetteDeg = (intl: LokalIntlShape): ISpørsmål => {
  return {
    søknadid: ESituasjon.gjelderDetteDeg,
    tekstid: 'dinSituasjon.spm',
    flersvar: true,
    svaralternativer: [
      {
        id: DinSituasjonType.erSyk,
        svar_tekst: hentTekst('dinSituasjon.svar.erSyk', intl),
        dokumentasjonsbehov: DokumentasjonSykdom,
      },
      {
        id: DinSituasjonType.harSyktBarn,
        svar_tekst: hentTekst('dinSituasjon.svar.harSyktBarn', intl),
        dokumentasjonsbehov: DokumentasjonSyktBarn,
      },
      {
        id: DinSituasjonType.harSøktBarnepassOgVenterEnnå,
        svar_tekst: hentTekst('dinSituasjon.svar.harSøktBarnepassOgVenterEnnå', intl),
        dokumentasjonsbehov: DokumentasjonBarnepassMangel,
      },
      {
        id: DinSituasjonType.harBarnMedSærligeBehov,
        svar_tekst: hentTekst('dinSituasjon.svar.harBarnMedSærligeBehov', intl),
        dokumentasjonsbehov: DokumentasjonBarnetilsynBehov,
      },
      {
        id: DinSituasjonType.nei,
        svar_tekst: hentTekst('dinSituasjon.svar.nei', intl),
      },
    ],
  };
};

export const SagtOppEllerRedusertStillingSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ESituasjon.sagtOppEllerRedusertStilling,
  tekstid: 'dinSituasjon.spm.sagtOppEllerRedusertStilling',
  flersvar: false,
  lesmer: {
    headerTekstid: 'dinSituasjon.lesmer-åpne',
    innholdTekstid: 'dinSituasjon.lesmer-innhold',
  },
  svaralternativer: [
    {
      id: ESagtOppEllerRedusertStilling.sagtOpp,
      svar_tekst: hentTekst('dinSituasjon.svar.sagtOpp', intl),
      alert_tekstid: 'dinSituasjon.alert.sagtOpp',
      dokumentasjonsbehov: ArbeidsforholdOgOppsigelsesårsak,
    },
    {
      id: ESagtOppEllerRedusertStilling.redusertStilling,
      svar_tekst: hentTekst('dinSituasjon.svar.redusertStilling', intl),
      alert_tekstid: 'dinSituasjon.alert.redusertStilling',
      dokumentasjonsbehov: ArbeidsforholdOgRedusertArbeidstid,
    },
    {
      id: ESagtOppEllerRedusertStilling.nei,
      svar_tekst: hentTekst('svar.nei', intl),
    },
  ],
});

export const SøkerFraBestemtMånedSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ESituasjon.søkerFraBestemtMåned,
  tekstid: 'søkerFraBestemtMåned.spm.overgangsstønad',
  flersvar: false,
  lesmer: {
    headerTekstid: 'søkerFraBestemtMåned.hjelpetekst-åpne',
    innholdTekstid: 'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del1',
  },
  svaralternativer: [
    {
      id: ESøkerFraBestemtMåned.ja,
      svar_tekst: hentTekst(ESvarTekstid.JA, intl),
    },
    {
      id: ESøkerFraBestemtMåned.neiNavKanVurdere,
      svar_tekst: hentTekst('søkerFraBestemtMåned.svar.neiNavKanVurdere', intl),
    },
  ],
});
