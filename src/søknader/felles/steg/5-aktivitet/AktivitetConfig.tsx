import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import { EAktivitet, EArbeidssituasjon } from '../../../../models/steg/aktivitet/aktivitet';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

// --- DOKUMENTASJON

export const DokumentasjonUtgifterUtdanning: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonUtgifterUtdanning;

export const DokumentasjonUtdanning: IDokumentasjon = DokumentasjonsConfig.DokumentasjonUtdanning;

const DokumentasjonArbeidskontrakt: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonArbeidskontrakt;

export const DokumentasjonIkkeVilligTilArbeid: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonIkkeVilligTilArbeid;

export const DokumentasjonOmVirksomhetenDuEtablerer: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonOmVirksomhetenDuEtablerer;

// --- SPØRSMÅL

export const hvaErDinArbeidssituasjonSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
  tekstid: 'arbeidssituasjon.spm',
  lesmer: {
    headerTekstid: 'arbeidssituasjon.spm.hjelpetekst-åpne',
    innholdTekstid: 'arbeidssituasjon.spm.hjelpetekst-innhold',
  },
  flersvar: true,
  svaralternativer: [
    {
      id: EAktivitet.erHjemmeMedBarnUnderEttÅr,
      svar_tekst: hentTekst('arbeidssituasjon.svar.erHjemmeMedBarnUnderEttÅr', intl),
    },
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
      id: EAktivitet.harFåttJobbTilbud,
      svar_tekst: hentTekst('arbeidssituasjon.svar.harFåttJobbTilbud', intl),
      dokumentasjonsbehov: DokumentasjonArbeidskontrakt,
    },
    {
      id: EAktivitet.etablererEgenVirksomhet,
      svar_tekst: hentTekst('arbeidssituasjon.svar.etablererEgenVirksomhet', intl),
      dokumentasjonsbehov: DokumentasjonOmVirksomhetenDuEtablerer,
    },
    {
      id: EAktivitet.erArbeidssøker,
      svar_tekst: hentTekst('arbeidssituasjon.svar.erArbeidssøker', intl),
    },
    {
      id: EAktivitet.tarUtdanning,
      svar_tekst: hentTekst('arbeidssituasjon.svar.tarUtdanning', intl),
      dokumentasjonsbehov: DokumentasjonUtdanning,
    },
    {
      id: EAktivitet.erHverkenIArbeidUtdanningEllerArbeidssøker,
      svar_tekst: hentTekst(
        'arbeidssituasjon.svar.erHverkenIArbeidUtdanningEllerArbeidssøker',
        intl
      ),
    },
  ],
});
