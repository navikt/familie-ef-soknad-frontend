import { BodyShort, Heading, Label, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { IMedlemskap, IUtenlandsopphold } from '../../../../models/steg/omDeg/medlemskap';
import type { ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import type { Søker } from '../../../../models/søknad/person';
import type { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { VisLabelOgSvar, verdiTilTekstsvar } from '../../../../utils/visning';

interface Props {
    søker: Søker;
    søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
    harMeldtAdresseendring?: ISpørsmålBooleanFelt;
    sivilstatus: ISivilstatus;
    medlemskap: IMedlemskap;
    endreInformasjonPath?: string;
}

const OppsummeringOmDeg: FC<Props> = ({
    søker,
    søkerBorPåRegistrertAdresse,
    harMeldtAdresseendring,
    sivilstatus,
    medlemskap,
    endreInformasjonPath,
}) => {
    const intl = useLokalIntlContext();

    const navigate = useNavigate();
    const utenlandsopphold: IUtenlandsopphold[] | undefined = medlemskap.perioderBoddIUtlandet;

    const datoFlyttetFraHverandre = VisLabelOgSvar(sivilstatus);
    const tidligereSamboer = VisLabelOgSvar(sivilstatus.tidligereSamboerDetaljer);
    const medlemskapSpørsmål = VisLabelOgSvar(medlemskap);

    return (
        <VStack gap={'space-48'}>
            <VStack gap={'space-32'}>
                <VStack>
                    <Label as="p">{hentTekst('person.ident', intl)}</Label>
                    <BodyShort>{søker.fnr}</BodyShort>
                </VStack>
                <VStack>
                    <Label as="p">{hentTekst('person.statsborgerskap', intl)}</Label>
                    <BodyShort>{søker.statsborgerskap}</BodyShort>
                </VStack>
                <VStack>
                    <Label as="p">{hentTekst('person.adresse', intl)}</Label>
                    <BodyShort>{søker.adresse.adresse}</BodyShort>
                    <BodyShort>
                        {søker.adresse.postnummer} {søker.adresse.poststed}
                    </BodyShort>
                </VStack>
                {søkerBorPåRegistrertAdresse && (
                    <VStack>
                        <Label as="p">{søkerBorPåRegistrertAdresse.label}</Label>
                        <BodyShort>{verdiTilTekstsvar(søkerBorPåRegistrertAdresse.verdi, intl)}</BodyShort>
                    </VStack>
                )}
                {harMeldtAdresseendring && (
                    <VStack>
                        <Label as="p">{harMeldtAdresseendring.label}</Label>
                        <BodyShort>{verdiTilTekstsvar(harMeldtAdresseendring.verdi, intl)}</BodyShort>
                    </VStack>
                )}
                {tidligereSamboer && (
                    <VStack>
                        <Heading size={'small'}>{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>
                        {tidligereSamboer}
                    </VStack>
                )}
                {datoFlyttetFraHverandre}
                {medlemskapSpørsmål}

                {utenlandsopphold && (
                    <VStack>
                        {utenlandsopphold.map((land, index) => {
                            const utenlandsoppholdDeltittel =
                                index === 0
                                    ? hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)
                                    : `${hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)} ${index + 1}`;

                            return (
                                <VStack key={index}>
                                    {index !== 0 && <hr style={{ width: '100%' }} />}
                                    <Heading size={'small'} level={'4'}>
                                        {utenlandsoppholdDeltittel}
                                    </Heading>
                                    {VisLabelOgSvar(land)}
                                </VStack>
                            );
                        })}
                    </VStack>
                )}
            </VStack>

            <LenkeMedIkon
                onClick={() => navigate({ pathname: endreInformasjonPath }, { state: { kommerFraOppsummering: true } })}
                tekst_id="barnasbosted.knapp.endre"
                ikon={endre}
            />
        </VStack>
    );
};

export default OppsummeringOmDeg;
