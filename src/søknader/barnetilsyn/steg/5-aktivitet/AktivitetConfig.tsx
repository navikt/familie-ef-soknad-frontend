import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EAktivitet,
  EArbeidssituasjon,
  ErIArbeid,
} from '../../../../models/steg/aktivitet/aktivitet';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';

// --- DOKUMENTASJON

export const DokumentasjonSyk: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonSyk;

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
    { id: ErIArbeid.JA, svar_tekst: intl.formatMessage({ id: 'svar.ja' }) },
    {
      id: ErIArbeid.NeiFordiJegErSyk,
      svar_tekst: intl.formatMessage({ id: 'erDuIArbeid.svar.nei' }),
      dokumentasjonsbehov: DokumentasjonSyk,
    },
  ],
});

export const hvaErDinArbeidssituasjonSpm = (
  intl: LokalIntlShape
): ISpørsmål => ({
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
      svar_tekst: intl.formatMessage({
        id: 'arbeidssituasjon.svar.erArbeidstakerOgEllerLønnsmottakerFrilanser',
      }),
    },
    {
      id: EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser,
      svar_tekst: intl.formatMessage({
        id: 'arbeidssituasjon.svar.erSelvstendigNæringsdriveneEllerFrilanser',
      }),
    },
    {
      id: EAktivitet.erAnsattIEgetAS,
      svar_tekst: intl.formatMessage({
        id: 'arbeidssituasjon.svar.erAnsattIEgetAS',
      }),
    },
    {
      id: EAktivitet.etablererEgenVirksomhet,
      svar_tekst: intl.formatMessage({
        id: 'arbeidssituasjon.svar.etablererEgenVirksomhet',
      }),
      dokumentasjonsbehov: DokumentasjonOmVirksomhetenDuEtablerer,
    },
  ],
});
