import React from 'react';
import LocaleTekst from '../language/LocaleTekst';
import {
  ERouteArbeidssøkerskjema,
  RoutesArbeidssokerskjema,
} from './routes/routesArbeidssokerskjema';
import { useSkjema } from './SkjemaContext';
import { useMount, useSpråkValg } from '../utils/hooks';
import { hentPath } from '../utils/routing';
import { logSidevisningArbeidssokerskjema } from '../utils/amplitude';
import { Heading, Box } from '@navikt/ds-react';
import { VeilederBoks } from '../components/forside/VeilederBoks';
import { DisclaimerBoks } from '../components/forside/DisclaimerBoks';
import { Seksjon } from '../components/forside/Seksjon';
import { Overskrift } from '../components/forside/Overskrift';
import { Tekst } from '../components/forside/Tekst';
import { KnappLocaleTekstOgNavigate } from '../components/knapper/KnappLocaleTekstOgNavigate';

const Forside: React.FC<{ visningsnavn: string }> = ({ visningsnavn }) => {
  const { skjema, settSkjema } = useSkjema();

  useMount(() => logSidevisningArbeidssokerskjema('Forside'));

  const settBekreftelse = (bekreftelse: boolean) => {
    settSkjema({
      ...skjema,
      harBekreftet: bekreftelse,
    });
  };

  const nesteSide =
    hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Spørsmål) || '';

  const skalViseSpråkValg = true;

  useSpråkValg(skalViseSpråkValg);

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="4" className={'forside__panel'}>
          <VeilederBoks navn={visningsnavn} />

          <Heading level="1" size="xlarge">
            <LocaleTekst tekst={'skjema.sidetittel'} />
          </Heading>

          <Seksjon>
            <Tekst tekst="forside.arbeidssøker.info" />
            <Tekst tekst="forside.arbeidssøker.krav" />
            <LocaleTekst tekst="forside.arbeidssøker.lerMer" />
          </Seksjon>

          <Seksjon>
            <Overskrift tekst="forside.arbeidssøker.overskrift.riktigeOpplysninger" />
            <Tekst tekst="forside.arbeidssøker.riktigeOpplysninger" />
            <Tekst tekst="forside.arbeidssøker.meldeEndringer" />
            <LocaleTekst
              tekst={'forside.arbeidssøker.personopplysningeneDineLenke'}
            />
          </Seksjon>

          <DisclaimerBoks
            navn={visningsnavn}
            tekst={'forside.overgangsstønad.disclaimerTekst'}
            harBekreftet={skjema.harBekreftet}
            settBekreftelse={settBekreftelse}
          />

          {skjema.harBekreftet && (
            <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Forside;
