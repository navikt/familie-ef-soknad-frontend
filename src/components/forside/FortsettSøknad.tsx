import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LokalIntlShape } from '../../language/typer';
import { BodyShort, Button, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';

interface FortsettSøknadProps {
  intl: LokalIntlShape;
  gjeldendeSteg: string;
  brukMellomlagretSøknad: () => void;
  nullstillMellomlagretSøknad: () => Promise<string>;
  skjemanavn?: string;
}

const FortsettSøknad: React.FC<FortsettSøknadProps> = ({
  intl,
  gjeldendeSteg,
  brukMellomlagretSøknad,
  nullstillMellomlagretSøknad,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="seksjon">
        <BodyShort>{hentTekst('side.fortsettSøknad.påbegyntSøknad', intl)}</BodyShort>
      </div>
      <VStack gap={'4'} align={'center'}>
        <Button
          onClick={() => {
            brukMellomlagretSøknad();
            navigate(gjeldendeSteg);
          }}
          variant="primary"
          className={'fortsett'}
        >
          {hentTekst('side.fortsettSøknad.knapp.fortsett', intl)}
        </Button>
        <Button
          onClick={() => {
            nullstillMellomlagretSøknad().then(() => {
              window.location.reload();
            });
          }}
          variant="secondary"
          className={'start-ny'}
        >
          {hentTekst('side.fortsettSøknad.knapp.startPåNytt', intl)}
        </Button>
      </VStack>
    </>
  );
};

export default FortsettSøknad;
