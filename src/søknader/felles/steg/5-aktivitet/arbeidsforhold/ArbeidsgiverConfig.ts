import { ISpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { EArbeidsgiver, EStilling } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { JaNeiSvar } from '../../../../../helpers/svar';
import { IDokumentasjon } from '../../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../../language/typer';

// DOKUMENTASJON
const DokumentasjonLærling: IDokumentasjon = DokumentasjonsConfig.DokumentasjonLærling;

// SPØRSMÅL
export const hvaSlagsStilling = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidsgiver.ansettelsesforhold,
  tekstid: 'arbeidsforhold.label.ansettelsesforhold',
  flersvar: false,
  svaralternativer: [
    {
      id: EStilling.fast,
      svar_tekst: intl.formatMessage({ id: 'arbeidsforhold.svar.fast' }),
    },
    {
      id: EStilling.midlertidig,
      svar_tekst: intl.formatMessage({ id: 'arbeidsforhold.svar.midlertidig' }),
    },
    {
      id: EStilling.lærling,
      svar_tekst: intl.formatMessage({ id: 'arbeidsforhold.svar.lærling' }),
      dokumentasjonsbehov: DokumentasjonLærling,
    },
    {
      id: EStilling.tilkallingsvakt,
      svar_tekst: intl.formatMessage({
        id: 'arbeidsforhold.svar.tilkallingsvakt',
      }),
    },
  ],
});

export const harDuSluttdato = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidsgiver.harSluttDato,
  tekstid: 'arbeidsforhold.label.sluttdato',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});
