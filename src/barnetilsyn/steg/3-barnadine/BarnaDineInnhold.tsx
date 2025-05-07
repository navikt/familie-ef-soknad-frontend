import React, { useState } from 'react';
import { hentTekst } from '../../../utils/søknad';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { IBarn } from '../../../models/steg/barn';
import { Alert } from '@navikt/ds-react';
import { SettDokumentasjonsbehovBarn } from '../../../models/søknad/søknad';
import { EndreEllerSlettBarn } from './EndreEllerSlettBarn';
import styled from 'styled-components';
import Barnekort from './Barnekort';
import LeggTilBarnModal from './LeggTilBarnModal';
import { LeggTilBarnKort } from './LeggTilBarnKort';

interface Props {
  barneliste: IBarn[];
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
  fjernBarnFraSøknad: (id: string) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

export const BarneKortWrapper = styled.div`
  display: inline-flex;
  gap: 1rem;
  flex-wrap: wrap;
  max-width: 568px;
  margin: auto;

  @media (max-width: 767px) {
    justify-content: center;
  }
`;

export const BarnaDineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BarnaDineInnhold: React.FC<Props> = ({
  barneliste,
  oppdaterBarnISøknaden,
  fjernBarnFraSøknad,
  settDokumentasjonsbehovForBarn,
}) => {
  const intl = useLokalIntlContext();

  const [åpenModal, settÅpenModal] = useState(false);

  return (
    <BarnaDineContainer>
      <Alert size="small" variant="info" inline>
        {hentTekst('barnadine.infohentet', intl)}
      </Alert>
      <BarneKortWrapper>
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
                    settDokumentasjonsbehovForBarn={
                      settDokumentasjonsbehovForBarn
                    }
                    barneListe={barneliste}
                    oppdaterBarnISøknaden={oppdaterBarnISøknaden}
                  />
                )
              }
            />
          ))}
        <LeggTilBarnKort settÅpenModal={settÅpenModal} />
      </BarneKortWrapper>
      {åpenModal && (
        <LeggTilBarnModal
          tittel={intl.formatMessage({ id: 'barnadine.leggtil' })}
          lukkModal={() => settÅpenModal(false)}
          barneListe={barneliste}
          settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
          oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        />
      )}
    </BarnaDineContainer>
  );
};
