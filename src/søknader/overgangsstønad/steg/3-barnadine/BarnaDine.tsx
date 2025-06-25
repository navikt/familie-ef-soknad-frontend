import React from 'react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningOvergangsstonad } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { BarnaDineInnhold } from '../../../felles/steg/3-barnadine/BarnaDineInnhold';

const BarnaDine: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    mellomlagreOvergangsstønad,
    settDokumentasjonsbehovForBarn,
    oppdaterBarnISøknaden,
    fjernBarnFraSøknad,
  } = useOvergangsstønadSøknad();

  const skalViseKnapper = ESide.visTilbakeNesteAvbrytKnapp;

  useMount(() => logSidevisningOvergangsstonad('BarnaDine'));

  const harMinstEttBarn = søknad.person.barn.length > 0;

  console.log(søknad.person.barn);

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={hentTekst('barnadine.sidetittel', intl)}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={harMinstEttBarn}
      routesStønad={RoutesOvergangsstonad}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
      informasjonstekstId="barnadine.info.brukpdf"
    >
      <BarnaDineInnhold
        barneliste={søknad.person.barn}
        oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        fjernBarnFraSøknad={fjernBarnFraSøknad}
        settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
      />
    </Side>
  );
};

export default BarnaDine;
