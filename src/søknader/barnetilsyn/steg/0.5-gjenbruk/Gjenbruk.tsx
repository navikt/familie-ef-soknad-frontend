import React, { FC } from 'react';
import { ERouteBarnetilsyn, RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Box, GuidePanel, VStack } from '@navikt/ds-react';
import { hentPath } from '../../../../utils/routing';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { GjenbrukKnapp } from './GjenbrukKnapp';
import { KnappLocaleTekstOgNavigate } from '../../../../components/knapper/KnappLocaleTekstOgNavigate';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';

const Gjenbruk: FC = () => {
  const intl = useLokalIntlContext();
  const { søknad } = useBarnetilsynSøknad();

  const nesteSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.OmDeg) || '';
  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="4" className={'forside__panel'}>
          <GuidePanel poster>
            <VStack gap={'5'}>
              <BodyShort>
                {hentTekstMedEnVariabel('skjema.hei', intl, søknad.person.søker.forkortetNavn)}
              </BodyShort>
              <BodyShort>{hentTekst('tidligere.barnetilsyn.søknad.finnes', intl)}</BodyShort>
              <BodyShort>{hentTekst('gjenbruk.tidligere.barnetilsyn.søknad', intl)}</BodyShort>
            </VStack>
            <VStack gap={'2'} style={{ marginTop: '3rem' }}>
              <GjenbrukKnapp nesteSide={nesteSide} />
              <KnappLocaleTekstOgNavigate
                nesteSide={nesteSide}
                tekst="knapp.startTom"
                variant="secondary"
              />
            </VStack>
          </GuidePanel>
        </Box>
      </div>
    </div>
  );
};

export default Gjenbruk;
