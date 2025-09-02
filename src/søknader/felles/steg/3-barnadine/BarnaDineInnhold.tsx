import React, { useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Barnekort } from './Barnekort';
import { IBarn } from '../../../../models/steg/barn';
import { Alert, VStack } from '@navikt/ds-react';
import { LeggTilBarnKort } from './LeggTilBarnKort';
import { LeggTilBarnModal } from './LeggTilBarnModal';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { EndreEllerSlettBarn } from './EndreEllerSlettBarn';
import styles from './BarnaDineInnhold.module.css';

interface Props {
  barneliste: IBarn[];
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
  fjernBarnFraSøknad: (id: string) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

export const BarnaDineInnhold: React.FC<Props> = ({
  barneliste,
  oppdaterBarnISøknaden,
  fjernBarnFraSøknad,
  settDokumentasjonsbehovForBarn,
}) => {
  const intl = useLokalIntlContext();

  const [åpenModal, settÅpenModal] = useState(false);

  return (
    <VStack gap="4">
      <Alert variant="info" size="small" inline>
        {hentTekst('barnadine.infohentet', intl)}
      </Alert>

      <div className={styles.barneKortWrapper}>
        {barneliste
          ?.sort((a: IBarn, b: IBarn) => {
            if (a.medforelder?.verdi && !b.medforelder?.verdi) {
              return -1;
            }
            if (!a.medforelder?.verdi && b.medforelder?.verdi) {
              return 1;
            }
            return 0;
          })
          .map((barn: IBarn) => (
            <Barnekort
              key={barn.id}
              gjeldendeBarn={barn}
              footer={
                barn.lagtTil && (
                  <EndreEllerSlettBarn
                    fjernBarnFraSøknad={fjernBarnFraSøknad}
                    id={barn.id}
                    settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
                    barneListe={barneliste}
                    oppdaterBarnISøknaden={oppdaterBarnISøknaden}
                  />
                )
              }
            />
          ))}
        <LeggTilBarnKort settÅpenModal={settÅpenModal} />
      </div>

      {åpenModal && (
        <LeggTilBarnModal
          tittel={hentTekst('barnadine.leggtil', intl)}
          lukkModal={() => settÅpenModal(false)}
          barneListe={barneliste}
          settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
          oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        />
      )}
    </VStack>
  );
};
