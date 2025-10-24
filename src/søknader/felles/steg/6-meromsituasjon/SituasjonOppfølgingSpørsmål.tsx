import React, { FC } from 'react';
import { DinSituasjonType } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { BarnMedSærligeBehov } from './BarnMedSærligeBehov';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

interface Props {
  svarid: string;
}

export const SituasjonOppfølgingSpørsmål: FC<Props> = ({ svarid }) => {
  const intl = useLokalIntlContext();
  switch (svarid) {
    case DinSituasjonType.erSyk:
      return (
        <AlertStripeDokumentasjon>
          {hentHTMLTekst('dinSituasjon.alert.erSyk', intl)}
        </AlertStripeDokumentasjon>
      );

    case DinSituasjonType.harSyktBarn:
      return (
        <AlertStripeDokumentasjon>
          {hentHTMLTekst('dinSituasjon.alert.harSyktBarn', intl)}
        </AlertStripeDokumentasjon>
      );

    case DinSituasjonType.harSøktBarnepassOgVenterEnnå:
      return (
        <AlertStripeDokumentasjon>
          {hentHTMLTekst('dinSituasjon.alert.harSøktBarnepassOgVenterEnnå', intl)}
        </AlertStripeDokumentasjon>
      );

    case DinSituasjonType.harBarnMedSærligeBehov:
      return <BarnMedSærligeBehov />;

    default:
      return <></>;
  }
};
