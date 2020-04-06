import React from 'react';
import Side from '../../../components/side/Side';
import { Normaltekst } from 'nav-frontend-typografi';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import { useIntl } from 'react-intl';
import OppsummeringOmDeg from './OppsummeringOmDeg';
import OppsummeringBosituasjon from './OppsummeringBosituasjon';
import OppsummeringBarnaDine from './OppsummeringBarnaDine';
import OppsummeringAktiviteter from './OppsummeringAktiviteter';
import OppsummeringDinSituasjon from './OppsummeringDinSituasjon';

const Oppsummering: React.FC = () => {
  const intl = useIntl();
  return (
    <>
      <Side tittel={intl.formatMessage({ id: 'oppsummering.sidetittel' })}>
        <div className="oppsummering">
          <Normaltekst className="disclaimer">
            {intl.formatMessage({ id: 'oppsummering.normaltekst.lesgjennom' })}
          </Normaltekst>

          <KomponentGruppe>
            <OppsummeringOmDeg />
            <OppsummeringBosituasjon />
            <OppsummeringBarnaDine />
            <OppsummeringBosituasjon />
            <OppsummeringAktiviteter />
            <OppsummeringDinSituasjon />
          </KomponentGruppe>
        </div>
      </Side>
    </>
  );
};

export default Oppsummering;
