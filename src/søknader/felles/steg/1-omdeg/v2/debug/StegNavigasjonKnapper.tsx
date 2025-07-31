import React from 'react';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import styles from './StegNavigasjonKnapper.module.css';
import { useOmDegV2 } from '../typer/OmDegContextV2';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { erOmDegStegKomplettOgGyldig } from '../typer/OmDegV2Helpers';

export const StegNavigasjonKnapper: React.FC = () => {
  const intl = useLokalIntlContext();
  const { hentStegData, personopplysningerData, sivilstatusData, medlemskapData, søker } =
    useOmDegV2();

  // Sjekk om steget er komplett og gyldig
  const erStegKomplettOgGyldig = erOmDegStegKomplettOgGyldig(
    personopplysningerData,
    sivilstatusData,
    medlemskapData,
    søker.sivilstand
  );

  const onNesteKlikk = () => {
    const stegData = hentStegData();
    console.log('OmDegStegData er:', stegData);
    // TODO: Naviger til neste steg
  };

  const onTilbakeKlikk = () => {
    console.log('Tilbake-knapp klikket');
  };

  const onAvbrytKlikk = () => {
    console.log('Avbryt-knapp klikket');
  };

  const visTilbakeKnapp = true; // TODO: Skal kun vises når bruker kommer fra oppsummering
  const visUUTekst = !erStegKomplettOgGyldig;

  return (
    <VStack gap={'4'} className={styles.container}>
      {visUUTekst && <BodyShort>{hentTekst('knapp.uu-tekst', intl)}</BodyShort>}

      <HStack gap={'4'} justify={'center'}>
        {visTilbakeKnapp && (
          <Button
            variant="secondary"
            size="medium"
            onClick={onTilbakeKlikk}
            disabled // Disabled for nå
          >
            {hentTekst('knapp.tilbake', intl)}
          </Button>
        )}

        {erStegKomplettOgGyldig && (
          <Button variant="primary" size="medium" onClick={onNesteKlikk}>
            {hentTekst('knapp.neste', intl)}
          </Button>
        )}
      </HStack>

      <div className={styles.container}>
        <Button variant="tertiary" size="medium" onClick={onAvbrytKlikk}>
          {hentTekst('knapp.avbryt', intl)}
        </Button>
      </div>
    </VStack>
  );
};
