import React from 'react';
import { hentFeltObjekt } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import BarnMedISøknad from './BarnMedISøknad';
import { Barnekort } from '../../../felles/steg/3-barnadine/Barnekort';
import { IBarn } from '../../../../models/steg/barn';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { Alert, HStack, Label, ReadMore, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

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
      <VStack gap={'6'}>
        <VStack>
          <Label size={'medium'}>{hentTekst('barnetilsyn.tekst.hvilke', intl)}</Label>
          <ReadMore header={hentTekst('barnetilsyn.hjelpetekst-åpne.hvilke', intl)} size={'small'}>
            {hentHTMLTekst('barnetilsyn.hjelpetekst-innhold.hvilke', intl)}
          </ReadMore>
        </VStack>

        <Alert variant="info" size="small" inline>
          {hentTekst('barnadine.infohentet', intl)}
        </Alert>

        {!harBarnRegistrertIFolkeregisteret && (
          <Alert variant="info" size="small" inline>
            {hentTekst('barnadine.ingenBarn', intl)}
          </Alert>
        )}

        <Alert variant="info" size="small" inline>
          {hentHTMLTekst('barnadine.barnetilsyn.info.brukpdf', intl)}
        </Alert>

        <HStack>
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
        </HStack>
      </VStack>
    </Side>
  );
};
