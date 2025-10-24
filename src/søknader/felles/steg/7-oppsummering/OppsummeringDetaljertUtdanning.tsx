import React from 'react';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { VisLabelOgSvar } from '../../../../utils/visning';
import endre from '../../../../assets/endre.svg';
import { DetaljertUtdanning } from '../../../skolepenger/models/detaljertUtdanning';
import { useNavigate } from 'react-router-dom';
import { Heading, VStack } from '@navikt/ds-react';

interface Props {
  utdanning: DetaljertUtdanning;
  endreInformasjonPath?: string;
}

const OppsummeringDetaljertUtdanning: React.FC<Props> = ({ utdanning, endreInformasjonPath }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  const underUtdanning = VisLabelOgSvar(utdanning);

  return (
    <VStack gap={'12'} marginBlock={'10 0'}>
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
