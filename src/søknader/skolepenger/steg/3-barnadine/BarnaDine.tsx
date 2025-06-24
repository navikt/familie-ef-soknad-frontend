import React from 'react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import { RoutesSkolepenger } from '../../routing/routes';
import { pathOppsummeringSkolepenger } from '../../utils';
import Side, { ESide } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { BarnaDineInnhold } from '../../../felles/steg/3-barnadine/BarnaDineInnhold';

const BarnaDine: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    mellomlagreSkolepenger,
    settDokumentasjonsbehovForBarn,
    oppdaterBarnISøknaden,
    fjernBarnFraSøknad,
  } = useSkolepengerSøknad();
  const skalViseKnapper = ESide.visTilbakeNesteAvbrytKnapp;

  useMount(() => logSidevisningSkolepenger('BarnaDine'));

  const harMinstEttBarn = søknad.person.barn.length > 0;

  return (
    <>
      <Side
        stønadstype={Stønadstype.skolepenger}
        stegtittel={hentTekst('barnadine.sidetittel', intl)}
        skalViseKnapper={skalViseKnapper}
        erSpørsmålBesvart={harMinstEttBarn}
        routesStønad={RoutesSkolepenger}
        mellomlagreStønad={mellomlagreSkolepenger}
        tilbakeTilOppsummeringPath={pathOppsummeringSkolepenger}
        informasjonstekstId="barnadine.skolepenger.info.brukpdf"
      >
        <BarnaDineInnhold
          barneliste={søknad.person.barn}
          oppdaterBarnISøknaden={oppdaterBarnISøknaden}
          fjernBarnFraSøknad={fjernBarnFraSøknad}
          settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
        />
      </Side>
    </>
  );
};

export default BarnaDine;
