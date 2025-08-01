import React from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { BarnaDineInnhold } from './BarnaDineInnhold';
import { useBarnaDine } from './BarnaDineContext';
import { IBarn } from '../../../../models/steg/barn';
import { oppdaterBarnIBarneliste } from '../../../../utils/barn';

const BarnaDine: React.FC = () => {
  const intl = useLokalIntlContext();

  const {
    stønadstype,
    barneliste,
    settBarneliste,
    mellomlagreSteg,
    routes,
    pathOppsummering,
    settDokumentasjonsbehovForBarn,
  } = useBarnaDine();

  const skalViseKnapper = NavigasjonState.visTilbakeNesteAvbrytKnapp;
  const harMinstEttBarn = barneliste.length > 0;

  const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
    settBarneliste(oppdaterBarnIBarneliste(barneliste, oppdatertBarn));
  };

  const fjernBarnFraSøknad = (id: string) => {
    const nyBarneListe = barneliste.filter((barn: IBarn) => barn.id !== id);
    settBarneliste(nyBarneListe);
  };

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('barnadine.sidetittel', intl)}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={harMinstEttBarn}
      routesStønad={routes}
      mellomlagreSteg={mellomlagreSteg}
      tilbakeTilOppsummeringPath={pathOppsummering}
      informasjonstekstId="barnadine.info.brukpdf"
    >
      <BarnaDineInnhold
        barneliste={barneliste}
        oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        fjernBarnFraSøknad={fjernBarnFraSøknad}
        settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
      />
    </Side>
  );
};

export default BarnaDine;
