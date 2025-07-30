import React from 'react';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import styles from './StegNavigasjonKnapper.module.css';
import { useOmDegV2 } from '../typer/OmDegContextV2';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';

export const StegNavigasjonKnapper: React.FC = () => {
  const intl = useLokalIntlContext();
  const { hentStegData } = useOmDegV2();

  const onValiderKlikk = () => {
    const stegData = hentStegData();
    console.log('OmDegStegData er:', stegData);
  };

  const visTilbakeKnapp = true; // TODO: Skal kun vises når bruker kommer fra oppsummering.
  const visUUTekst = true; // TODO: Skal IKKE vises når steg er komplett og data er gyldig.
  const visNesteKnapp = true; // TODO: Skal kun vises når steg er komplett og data er gyldig.

  return (
    <VStack gap={'4'} className={styles.container}>
      {visUUTekst && <BodyShort>{hentTekst('knapp.uu-tekst', intl)}</BodyShort>}

      <HStack gap={'4'} justify={'center'}>
        {visTilbakeKnapp && (
          <Button variant="secondary" size="medium">
            {hentTekst('knapp.tilbake', intl)}
          </Button>
        )}

        {visNesteKnapp && (
          <Button variant="primary" size="medium" onClick={onValiderKlikk}>
            {hentTekst('knapp.neste', intl)}
          </Button>
        )}
      </HStack>

      <div className={styles.container}>
        <Button variant="tertiary" size="medium">
          {hentTekst('knapp.avbryt', intl)}
        </Button>
      </div>
    </VStack>
  );
};
