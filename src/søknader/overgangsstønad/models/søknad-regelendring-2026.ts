import type { IAdresseopplysninger } from '../../../models/steg/adresseopplysninger';
import type { IFirma } from '../../../models/steg/aktivitet/firma';
import type { IBosituasjon } from '../../../models/steg/bosituasjon';
import type { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import type { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import type { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import type { IPerson } from '../../../models/søknad/person';
import type {
    IDatoFelt,
    ISpørsmålBooleanFelt,
    ISpørsmålFelt,
    ISpørsmålListeFelt,
    ITekstFelt,
} from '../../../models/søknad/søknadsfelter';
import type { SøknadOvergangsstønad } from './søknad';

export interface SøknadOvergangsstønadRegelendring2026 {
    erRegelendring2026: true;
    innsendingsdato?: Date;
    person: IPerson;
    søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
    adresseopplysninger?: IAdresseopplysninger;
    sivilstatus: ISivilstatus;
    medlemskap: IMedlemskap;
    bosituasjon: IBosituasjon;

    hvaSituasjon: ISpørsmålListeFelt;
    inntekter: ISpørsmålListeFelt;
    firmaer?: IFirma[];
    sagtOppEllerRedusertStilling?: ISpørsmålFelt;
    begrunnelseSagtOppEllerRedusertStilling?: ITekstFelt;
    datoSagtOppEllerRedusertStilling?: IDatoFelt;
    søkerFraBestemtMåned?: ISpørsmålBooleanFelt;
    søknadsdato?: IDatoFelt;

    dokumentasjonsbehov: IDokumentasjon[];
    harBekreftet: boolean;
    locale: any;
    datoPåbegyntSøknad?: string;
}

export const tilSøknadRegelendring2026 = (søknad: SøknadOvergangsstønad): SøknadOvergangsstønadRegelendring2026 => {
    const { merOmDinSituasjon, aktivitet, ...fellesfelter } = søknad;

    if (!merOmDinSituasjon.hvaSituasjon) {
        throw new Error('hvaSituasjon mangler i søknaden');
    }

    if (!merOmDinSituasjon.inntekter) {
        throw new Error('inntekter mangler i søknaden');
    }

    return {
        ...fellesfelter,
        erRegelendring2026: true,
        hvaSituasjon: merOmDinSituasjon.hvaSituasjon,
        inntekter: merOmDinSituasjon.inntekter,
        firmaer: aktivitet.firmaer,
        sagtOppEllerRedusertStilling: merOmDinSituasjon.sagtOppEllerRedusertStilling,
        begrunnelseSagtOppEllerRedusertStilling: merOmDinSituasjon.begrunnelseSagtOppEllerRedusertStilling,
        datoSagtOppEllerRedusertStilling: merOmDinSituasjon.datoSagtOppEllerRedusertStilling,
        søkerFraBestemtMåned: merOmDinSituasjon.søkerFraBestemtMåned,
        søknadsdato: merOmDinSituasjon.søknadsdato,
    };
};
