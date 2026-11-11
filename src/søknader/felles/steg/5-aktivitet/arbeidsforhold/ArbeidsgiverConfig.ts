import { JaNeiSvar } from '../../../../../helpers/svar';
import type { LokalIntlShape } from '../../../../../language/typer';
import type { ISpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { EArbeidsgiver, EStilling } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import type { IDokumentasjon } from '../../../../../models/steg/dokumentasjon';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { DokumentasjonsConfig } from '../../../DokumentasjonsConfig';

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
            svar_tekst: hentTekst('arbeidsforhold.svar.fast', intl),
        },
        {
            id: EStilling.midlertidig,
            svar_tekst: hentTekst('arbeidsforhold.svar.midlertidig', intl),
        },
        {
            id: EStilling.lærling,
            svar_tekst: hentTekst('arbeidsforhold.svar.lærling', intl),
            dokumentasjonsbehov: DokumentasjonLærling,
        },
        {
            id: EStilling.tilkallingsvakt,
            svar_tekst: hentTekst('arbeidsforhold.svar.tilkallingsvakt', intl),
        },
    ],
});

export const harDuSluttdato = (intl: LokalIntlShape): ISpørsmål => ({
    søknadid: EArbeidsgiver.harSluttDato,
    tekstid: 'arbeidsforhold.label.sluttdato',
    flersvar: false,
    svaralternativer: JaNeiSvar(intl),
});
