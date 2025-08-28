import React from 'react';
import { hentFeltObjekt } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import LesMerTekst from '../../../../components/LesMerTekst';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import BarnMedISøknad from './BarnMedISøknad';
import Barnekort from '../../../felles/steg/3-barnadine/Barnekort';
import { IBarn } from '../../../../models/steg/barn';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { Alert, Label } from '@navikt/ds-react';
import {
  BarnaDineContainer,
  BarneKortWrapper,
} from '../../../felles/steg/3-barnadine/BarnaDineInnhold';
import styled from 'styled-components';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

const AlertContainer = styled.div`
  & > *:not(:first-child) {
    margin-top: 3rem;
  }
`;

export const BarnaDine: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, mellomlagreBarnetilsyn, oppdaterBarnISøknaden } = useBarnetilsynSøknad();
  const navigasjonState = NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const toggleSkalHaBarnepass = (id: string) => {
    const detteBarnet = søknad.person.barn.find((b: IBarn) => b.id === id);

    if (!detteBarnet) return;

    const skalHaBarnepassVerdi = !detteBarnet.skalHaBarnepass?.verdi;
    const nyttBarn: IBarn = {
      ...detteBarnet,
      skalHaBarnepass: hentFeltObjekt('barnekort.skalHaBarnepass', skalHaBarnepassVerdi, intl),
    };

    if (!skalHaBarnepassVerdi) {
      delete nyttBarn.barnepass;
    }

    oppdaterBarnISøknaden(nyttBarn);
  };

  const harValgtMinstEttBarn = søknad.person.barn.some((b: IBarn) => b.skalHaBarnepass?.verdi);

  const harBarnRegistrertIFolkeregisteret = søknad.person.barn.length > 0;

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={hentTekst('barnadine.sidetittel', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={harValgtMinstEttBarn}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <BarnaDineContainer>
        <FeltGruppe>
          <Label as="p">{hentTekst('barnetilsyn.tekst.hvilke', intl)}</Label>
          <LesMerTekst
            åpneTekstid={'barnetilsyn.hjelpetekst-åpne.hvilke'}
            innholdTekstid={'barnetilsyn.hjelpetekst-innhold.hvilke'}
          />
        </FeltGruppe>

        <AlertContainer>
          <Alert size="small" variant="info" inline>
            {hentTekst('barnadine.infohentet', intl)}
          </Alert>

          {!harBarnRegistrertIFolkeregisteret && (
            <Alert variant="info" size="small">
              {hentTekst('barnadine.ingenBarn', intl)}
            </Alert>
          )}

          <Alert size="small" variant="info" inline>
            {hentHTMLTekst('barnadine.barnetilsyn.info.brukpdf', intl)}
          </Alert>
        </AlertContainer>

        <BarneKortWrapper>
          {søknad.person.barn
            ?.sort((a: IBarn, b: IBarn) => {
              if (a.medforelder?.verdi && !b.medforelder?.verdi) {
                return -1;
              }
              if (!a.medforelder?.verdi && b.medforelder?.verdi) {
                return 1;
              }
              return 0;
            })
            .map((barn: IBarn, indeks: number) => (
              <Barnekort
                key={barn.id}
                gjeldendeBarn={barn}
                footer={
                  <BarnMedISøknad
                    id={barn.id ? barn.id : ''}
                    toggleSkalHaBarnepass={toggleSkalHaBarnepass}
                    skalHaBarnepass={!!barn.skalHaBarnepass?.verdi}
                    testId={`avhuk-${indeks}`}
                  />
                }
              />
            ))}
        </BarneKortWrapper>
      </BarnaDineContainer>
    </Side>
  );
};
