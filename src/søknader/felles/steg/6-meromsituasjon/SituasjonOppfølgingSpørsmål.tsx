import React, { FC } from 'react';
import { DinSituasjonType } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import SøkerErSyk from './SøkerErSyk';
import SyktBarn from './SyktBarn';
import SøktBarnepassOgVenterPåSvar from './SøktBarnepassOgVenterPåSvar';
import BarnMedSærligeBehov from './BarnMedSærligeBehov';

interface Props {
  svarid: string;
}

const SituasjonOppfølgingSpørsmål: FC<Props> = ({ svarid }) => {
  switch (svarid) {
    case DinSituasjonType.erSyk:
      return <SøkerErSyk />;

    case DinSituasjonType.harSyktBarn:
      return <SyktBarn />;

    case DinSituasjonType.harSøktBarnepassOgVenterEnnå:
      return <SøktBarnepassOgVenterPåSvar />;

    case DinSituasjonType.harBarnMedSærligeBehov:
      return <BarnMedSærligeBehov />;

    default:
      return <></>;
  }
};

export default SituasjonOppfølgingSpørsmål;
