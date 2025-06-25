import React from 'react';
import LocaleTekst from '../../language/LocaleTekst';
import SeksjonGruppe from '../gruppe/SeksjonGruppe';
import { FortsettSøknadKnappWrapper } from './FortsettSøknadKnapper';
import { EEventsnavn, logEvent } from '../../utils/amplitude';
import { useNavigate } from 'react-router-dom';
import { LokalIntlShape } from '../../language/typer';
import { BodyShort, Button } from '@navikt/ds-react';

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
  skjemanavn,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="seksjon">
        <BodyShort>{intl.formatMessage({ id: 'side.fortsettSøknad.påbegyntSøknad' })}</BodyShort>
      </div>
      <SeksjonGruppe className={'sentrert'}>
        <FortsettSøknadKnappWrapper>
          <Button
            onClick={() => {
              logEvent(EEventsnavn.Mellomlagret, {
                type: 'fortsett',
                skjemanavn,
                gjeldendeSteg,
              });
              brukMellomlagretSøknad();
              navigate(gjeldendeSteg);
            }}
            variant="primary"
            className={'fortsett'}
          >
            <LocaleTekst tekst={'side.fortsettSøknad.knapp.fortsett'} />
          </Button>
          <Button
            onClick={() => {
              logEvent(EEventsnavn.Mellomlagret, {
                type: 'nullstill',
                skjemanavn,
                gjeldendeSteg,
              });
              nullstillMellomlagretSøknad().then(() => {
                window.location.reload();
              });
            }}
            variant="secondary"
            className={'start-ny'}
          >
            <LocaleTekst tekst={'side.fortsettSøknad.knapp.startPåNytt'} />
          </Button>
        </FortsettSøknadKnappWrapper>
      </SeksjonGruppe>
    </>
  );
};

export default FortsettSøknad;
