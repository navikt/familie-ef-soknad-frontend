import { Alert } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { EAktivitet, type IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import type { UnderUtdanning } from '../../../../models/steg/aktivitet/utdanning';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { EgetAS } from './aksjeselskap/EgetAS';
import { OmArbeidsforholdetDitt } from './arbeidsforhold/OmArbeidsforholdetDitt';
import { Arbeidssøker } from './arbeidssøker/Arbeidssøker';
import { EtablererEgenVirksomhet } from './EtablererEgenVirksomhet';
import { OmFirmaeneDine } from './Firma/OmFirmaeneDine';
import { FåttJobbTilbud } from './FåttJobbTilbud';
import { TarUtdanning } from './utdanning/TarUtdanning';

interface Props {
    aktivitet: IAktivitet;
    settAktivitet: (arbeidssituasjon: IAktivitet) => void;
    svarid: string;
    settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
    overskuddsår: number;
}
export const AktivitetOppfølgingSpørsmål: FC<Props> = ({
    aktivitet,
    settAktivitet,
    svarid,
    settDokumentasjonsbehov,
    overskuddsår,
}) => {
    const intl = useLokalIntlContext();

    switch (svarid) {
        case EAktivitet.erHjemmeMedBarnUnderEttÅr:
            return (
                <Alert size="small" variant="info" inline>
                    {hentHTMLTekst('arbeidssituasjon.alert.aktivitetspliktFraEttÅr', intl)}
                </Alert>
            );

        case EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser:
            return (
                <OmArbeidsforholdetDitt
                    aktivitet={aktivitet}
                    settAktivitet={settAktivitet}
                    settDokumentasjonsbehov={settDokumentasjonsbehov}
                />
            );

        case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
            return (
                <OmFirmaeneDine
                    arbeidssituasjon={aktivitet}
                    settArbeidssituasjon={settAktivitet}
                    overskuddsår={overskuddsår}
                />
            );

        case EAktivitet.erAnsattIEgetAS:
            return <EgetAS arbeidssituasjon={aktivitet} settArbeidssituasjon={settAktivitet} />;

        case EAktivitet.etablererEgenVirksomhet:
            return <EtablererEgenVirksomhet arbeidssituasjon={aktivitet} settArbeidssituasjon={settAktivitet} />;

        case EAktivitet.erArbeidssøker:
            return (
                <Arbeidssøker
                    arbeidssituasjon={aktivitet}
                    settArbeidssituasjon={settAktivitet}
                    settDokumentasjonsbehov={settDokumentasjonsbehov}
                />
            );

        case EAktivitet.tarUtdanning:
            return (
                <TarUtdanning
                    stønadstype={Stønadstype.overgangsstønad}
                    underUtdanning={aktivitet.underUtdanning}
                    oppdaterUnderUtdanning={(utdanning: UnderUtdanning) =>
                        settAktivitet({
                            ...aktivitet,
                            underUtdanning: utdanning,
                        })
                    }
                />
            );

        case EAktivitet.harFåttJobbTilbud:
            return <FåttJobbTilbud arbeidssituasjon={aktivitet} settArbeidssituasjon={settAktivitet} />;

        default:
            return <></>;
    }
};
