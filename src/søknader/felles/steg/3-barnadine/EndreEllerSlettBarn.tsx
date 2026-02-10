import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Button, VStack } from '@navikt/ds-react';
import { IBarn } from '../../../../models/steg/barn';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { LeggTilBarnModal } from './LeggTilBarnModal';
import { hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
  fjernBarnFraSøknad: (id: string) => void;
  id: string;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
  barneListe: IBarn[];
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
}

export const EndreEllerSlettBarn: React.FC<Props> = ({
  fjernBarnFraSøknad,
  id,
  settDokumentasjonsbehovForBarn,
  barneListe,
  oppdaterBarnISøknaden,
}) => {
  const intl = useLokalIntlContext();

  const [åpenEndreModal, settÅpenEndreModal] = useState(false);

  return (
    <>
      <VStack gap="space-8" align="center">
        <Button variant="secondary" onClick={() => settÅpenEndreModal(true)}>
          {hentTekst('barnekort.lenke.endre', intl)}
        </Button>
        <Button variant="tertiary" onClick={() => fjernBarnFraSøknad(id)}>
          {hentTekst('barnekort.fjern', intl)}
        </Button>
      </VStack>

      {åpenEndreModal && (
        <LeggTilBarnModal
          tittel={hentTekst('barnadine.endre', intl)}
          lukkModal={() => settÅpenEndreModal(false)}
          id={id}
          barneListe={barneListe}
          settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
          oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        />
      )}
    </>
  );
};
