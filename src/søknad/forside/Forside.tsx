import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Sidetittel } from 'nav-frontend-typografi';
import { usePersonContext } from '../../context/PersonContext';
import { useSpråkContext } from '../../context/SpråkContext';
import { injectIntl } from 'react-intl';
import { useSøknad } from '../../context/SøknadContext';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/toggles';
import Forsideinformasjon from './Forsideinformasjon';
import { hentBeskjedMedNavn } from '../../utils/språk';
import FortsettSøknad from './FortsettSøknad';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import Environment from '../../Environment';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { isIE } from 'react-device-detect';
import { useForsideInnhold } from '../../utils/hooks';

const Forside: React.FC<any> = ({ intl }) => {
  const { person } = usePersonContext();
  const {
    mellomlagretOvergangsstønad,
    brukMellomlagretOvergangsstønad,
    nullstillMellomlagretOvergangsstønad,
  } = useSøknad();
  const [locale] = useSpråkContext();
  const forside = useForsideInnhold('forside');
  const { toggles } = useToggles();

  const disclaimer = forside['disclaimer_' + locale];
  const seksjon = forside['seksjon_' + locale];

  const kanBrukeMellomlagretSøknad =
    mellomlagretOvergangsstønad !== undefined &&
    mellomlagretOvergangsstønad.søknad.person.hash === person.hash &&
    mellomlagretOvergangsstønad.modellVersjon ===
      Environment().modellVersjon.overgangsstønad;

  // TODO: Må si ifra at den mellomlagrede versjonen ikke kan brukes pga endring i personopplysninger?

  return (
    <div className={'forside'}>
      <main className={'forside__innhold'}>
        <Panel className={'forside__panel'}>
          <div className="veileder">
            <VeilederSnakkeboble
              tekst={hentBeskjedMedNavn(
                person.søker.forkortetNavn,
                intl.formatMessage({ id: 'skjema.hei' })
              )}
            />
          </div>

          {isIE && (
            <div className="ie-feil">
              <AlertStripeFeil>
                Søknaden er ikke tilpasset nettleseren Internet Explorer. Vi
                anbefaler deg å bruke en annen nettleser, for eksempel Google
                Chrome, Safari eller Firefox.
              </AlertStripeFeil>
            </div>
          )}

          <Sidetittel>Søknad om overgangsstønad</Sidetittel>
          {toggles[ToggleName.mellomlagre_søknad] &&
          kanBrukeMellomlagretSøknad &&
          mellomlagretOvergangsstønad ? (
            <FortsettSøknad
              intl={intl}
              gjeldendeSteg={mellomlagretOvergangsstønad.gjeldendeSteg}
              brukMellomlagretSøknad={brukMellomlagretOvergangsstønad}
              nullstillMellomlagretSøknad={nullstillMellomlagretOvergangsstønad}
            />
          ) : (
            <Forsideinformasjon
              seksjon={seksjon}
              disclaimer={disclaimer}
              person={person}
              intl={intl}
            />
          )}
        </Panel>
      </main>
    </div>
  );
};

export default injectIntl(Forside);
