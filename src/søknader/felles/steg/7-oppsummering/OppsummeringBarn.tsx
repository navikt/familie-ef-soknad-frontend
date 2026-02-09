import { FC } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { verdiTilTekstsvar } from '../../../../utils/visning';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
  stønadstype: Stønadstype;
  barn: IBarn;
}

const OppsummeringBarn: FC<Props> = ({ stønadstype, barn }) => {
  const intl = useLokalIntlContext();
  const { alder, ident, navn, født, skalHaBarnepass, harSammeAdresse, lagtTil, harAdressesperre } =
    barn;

  return (
    <VStack gap={'space-32'}>
      {!harAdressesperre && navn && (
        <VStack>
          <Label as="p">{hentTekst('person.navn', intl)}</Label>
          <BodyShort>{navn.verdi}</BodyShort>
        </VStack>
      )}
      {!harAdressesperre && ident && ident.verdi !== '' && (
        <VStack>
          <Label as="p">{hentTekst('person.fnr', intl)}</Label>
          <BodyShort>{ident.verdi}</BodyShort>
        </VStack>
      )}
      {alder && (
        <VStack>
          <Label as="p">{hentTekst('person.alder', intl)}</Label>
          <BodyShort>{alder.verdi}</BodyShort>
        </VStack>
      )}
      {født?.verdi && lagtTil && (
        <VStack>
          <Label as="p">{hentTekst('barnekort.spm.født', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(født.verdi, intl)}</BodyShort>
        </VStack>
      )}
      {stønadstype === Stønadstype.barnetilsyn && skalHaBarnepass && (
        <VStack>
          <Label as="p">{hentTekst('barnekort.skalHaBarnepass', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(skalHaBarnepass?.verdi, intl)}</BodyShort>
        </VStack>
      )}
      {!harAdressesperre && harSammeAdresse && (
        <VStack>
          <Label as="p">{hentTekst('barnekort.spm.sammeAdresse', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(harSammeAdresse.verdi, intl)}</BodyShort>
        </VStack>
      )}
    </VStack>
  );
};

export default OppsummeringBarn;
