import React from 'react';
import {
  ERouteArbeidssøkerskjema,
  RoutesArbeidssokerskjema,
} from './routes/routesArbeidssokerskjema';
import { useSkjema } from './SkjemaContext';
import { useSpråkValg } from '../../utils/hooks';
import { hentPath } from '../../utils/routing';
import { Box, Heading } from '@navikt/ds-react';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { Seksjon } from '../../components/forside/Seksjon';
import { Overskrift } from '../../components/forside/Overskrift';
import { Tekst } from '../../components/forside/Tekst';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

const Forside: React.FC<{ visningsnavn: string }> = ({ visningsnavn }) => {
  const intl = useLokalIntlContext();
  const { skjema, settSkjema } = useSkjema();

  const settBekreftelse = (bekreftelse: boolean) => {
    settSkjema({
      ...skjema,
      harBekreftet: bekreftelse,
    });
  };

  const nesteSide = hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Spørsmål) || '';

  const skalViseSpråkValg = true;

  useSpråkValg(skalViseSpråkValg);

  return (
    <div className={'forside'}>
      <div className={'forside__innhold'}>
        <Box padding="4" className={'forside__panel'}>
          <VeilederBoks navn={visningsnavn} />

          <Heading level="1" size="xlarge">
            {hentTekst('skjema.sidetittel', intl)}
          </Heading>

          <Seksjon>
            <Tekst tekst="forside.arbeidssøker.info" />
            <Tekst tekst="forside.arbeidssøker.krav" />
            {hentHTMLTekst('forside.arbeidssøker.lerMer', intl)}
          </Seksjon>

          <Seksjon>
            <Overskrift tekst="forside.arbeidssøker.overskrift.riktigeOpplysninger" />
            <Tekst tekst="forside.arbeidssøker.riktigeOpplysninger" />
            <Tekst tekst="forside.arbeidssøker.meldeEndringer" />
            {hentHTMLTekst('forside.arbeidssøker.personopplysningeneDineLenke', intl)}
          </Seksjon>

          <DisclaimerBoks
            navn={visningsnavn}
            tekst={'forside.overgangsstønad.disclaimerTekst'}
            harBekreftet={skjema.harBekreftet}
            settBekreftelse={settBekreftelse}
          />

          {skjema.harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
        </Box>
      </div>
    </div>
  );
};

export default Forside;
