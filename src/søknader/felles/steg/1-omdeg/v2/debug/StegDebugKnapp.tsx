import React from 'react';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import styles from './StegDebugKnapp.module.css';
import { useOmDegV2 } from '../typer/OmDegContextV2';
import { hentTekst } from '../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';

export const StegDebugKnapp: React.FC = () => {
  const intl = useLokalIntlContext();
  const { hentStegData } = useOmDegV2();

  const onValiderKlikk = () => {
    const stegData = hentStegData();
    console.log('OmDegStegData er:', stegData);
  };

  return (
    <VStack gap={'4'} className={styles.container}>
      <BodyShort>{hentTekst('knapp.uu-tekst', intl)}</BodyShort>

      <HStack gap={'4'} justify={'center'}>
        <Button variant="secondary" size="medium">
          {hentTekst('knapp.tilbake', intl)}
        </Button>
        <Button variant="primary" size="medium" onClick={onValiderKlikk}>
          {hentTekst('knapp.neste', intl)}
        </Button>
      </HStack>

      <div className={styles.container}>
        <Button variant="danger" size="medium">
          {hentTekst('knapp.avbryt', intl)}
        </Button>
      </div>
    </VStack>
  );
};
