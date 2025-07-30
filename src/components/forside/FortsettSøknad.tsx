import React from 'react';
import SeksjonGruppe from '../gruppe/SeksjonGruppe';
import { FortsettSøknadKnappWrapper } from './FortsettSøknadKnapper';
import { EEventsnavn, logEvent } from '../../utils/amplitude';
import { useNavigate } from 'react-router-dom';
import { LokalIntlShape } from '../../language/typer';
import { BodyShort, Button } from '@navikt/ds-react';
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
  skjemanavn,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="seksjon">
        <BodyShort>{hentTekst('side.fortsettSøknad.påbegyntSøknad', intl)}</BodyShort>
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
            {hentTekst('side.fortsettSøknad.knapp.fortsett', intl)}
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
            {hentTekst('side.fortsettSøknad.knapp.startPåNytt', intl)}
          </Button>
        </FortsettSøknadKnappWrapper>
      </SeksjonGruppe>
    </>
  );
};

export default FortsettSøknad;
