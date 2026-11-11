import { Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useNavigate } from 'react-router';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { VisLabelOgSvar } from '../../../../utils/visning';
import type { DetaljertUtdanning } from '../../../skolepenger/models/detaljertUtdanning';

interface Props {
    utdanning: DetaljertUtdanning;
    endreInformasjonPath?: string;
}

const OppsummeringDetaljertUtdanning: React.FC<Props> = ({ utdanning, endreInformasjonPath }) => {
    const navigate = useNavigate();
    const intl = useLokalIntlContext();

    const underUtdanning = VisLabelOgSvar(utdanning);

    return (
        <VStack gap={'space-48'} marginBlock={'space-40 space-0'}>
            <VStack>
                <Heading size={'small'} level={'4'}>
                    {hentTekst('utdanning.tittel', intl)}
                </Heading>
                {underUtdanning}
            </VStack>
            {utdanning.tidligereUtdanning && (
                <VStack>
                    {utdanning.tidligereUtdanning.map((tidligereutdanning, index) => {
                        return (
                            <VStack key={index}>
                                {index !== 0 && <hr style={{ width: '100%' }} />}
                                <Heading
                                    size={'small'}
                                >{`${hentTekst('utdanning.tittel.tidligere', intl)} ${index + 1}`}</Heading>
                                {VisLabelOgSvar(tidligereutdanning)}
                            </VStack>
                        );
                    })}
                </VStack>
            )}
            <LenkeMedIkon
                onClick={() =>
                    navigate(
                        {
                            pathname: endreInformasjonPath,
                        },
                        { state: { kommerFraOppsummering: true }, replace: true }
                    )
                }
                tekst_id="barnasbosted.knapp.endre"
                ikon={endre}
            />
        </VStack>
    );
};

export default OppsummeringDetaljertUtdanning;
