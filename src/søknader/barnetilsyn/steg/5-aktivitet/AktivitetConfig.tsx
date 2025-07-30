import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EAktivitet,
  EArbeidssituasjon,
  ErIArbeid,
} from '../../../../models/steg/aktivitet/aktivitet';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

// --- DOKUMENTASJON

export const DokumentasjonSyk: IDokumentasjon = DokumentasjonsConfig.DokumentasjonSyk;

export const DokumentasjonOmVirksomhetenDuEtablerer: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonOmVirksomhetenDuEtablerer;

// --- SPØRSMÅL

export const ErDuIArbeidSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssituasjon.erDuIArbeid,
  tekstid: 'erDuIArbeid.spm',
  flersvar: false,
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'erDuIArbeid.hjelpetekst',
  },
  svaralternativer: [
    { id: ErIArbeid.JA, svar_tekst: hentTekst('svar.ja', intl) },
    {
      id: ErIArbeid.NeiFordiJegErSyk,
      svar_tekst: hentTekst('erDuIArbeid.svar.nei', intl),
      dokumentasjonsbehov: DokumentasjonSyk,
    },
  ],
});

export const hvaErDinArbeidssituasjonSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
  tekstid: 'arbeidssituasjon.spm',
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'arbeidssituasjon.spm.hjelpetekst',
  },
  flersvar: true,
  svaralternativer: [
    {
      id: EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser,
      svar_tekst: hentTekst(
        'arbeidssituasjon.svar.erArbeidstakerOgEllerLønnsmottakerFrilanser',
        intl
      ),
    },
    {
      id: EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser,
      svar_tekst: hentTekst(
        'arbeidssituasjon.svar.erSelvstendigNæringsdriveneEllerFrilanser',
        intl
      ),
    },
    {
      id: EAktivitet.erAnsattIEgetAS,
      svar_tekst: hentTekst('arbeidssituasjon.svar.erAnsattIEgetAS', intl),
    },
    {
      id: EAktivitet.etablererEgenVirksomhet,
      svar_tekst: hentTekst('arbeidssituasjon.svar.etablererEgenVirksomhet', intl),
      dokumentasjonsbehov: DokumentasjonOmVirksomhetenDuEtablerer,
    },
  ],
});
