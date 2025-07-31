import React, { FC } from 'react';
import { EAktivitet, IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import HjemmeMedBarnUnderEttÅr from './HjemmeMedBarnUnderEttÅr';
import OmArbeidsforholdetDitt from './arbeidsforhold/OmArbeidsforholdetDitt';
import EtablererEgenVirksomhet from './EtablererEgenVirksomhet';
import Arbeidssøker from './arbeidssøker/Arbeidssøker';
import TarUtdanning from './utdanning/TarUtdanning';
import EgetAS from './aksjeselskap/EgetAS';
import FåttJobbTilbud from './FåttJobbTilbud';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import OmFirmaeneDine from './Firma/OmFirmaeneDine';
import { UnderUtdanning } from '../../../../models/steg/aktivitet/utdanning';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
  svarid: string;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  overskuddsår: number;
}
const AktivitetOppfølgingSpørsmål: FC<Props> = ({
  arbeidssituasjon,
  settArbeidssituasjon,
  svarid,
  settDokumentasjonsbehov,
  overskuddsår,
}) => {
  switch (svarid) {
    case EAktivitet.erHjemmeMedBarnUnderEttÅr:
      return <HjemmeMedBarnUnderEttÅr />;

    case EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser:
      return (
        <OmArbeidsforholdetDitt
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
      );

    case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
      return (
        <OmFirmaeneDine
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          overskuddsår={overskuddsår}
        />
      );

    case EAktivitet.erAnsattIEgetAS:
      return (
        <EgetAS arbeidssituasjon={arbeidssituasjon} settArbeidssituasjon={settArbeidssituasjon} />
      );

    case EAktivitet.etablererEgenVirksomhet:
      return (
        <EtablererEgenVirksomhet
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
        />
      );

    case EAktivitet.erArbeidssøker:
      return (
        <Arbeidssøker
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
      );

    case EAktivitet.tarUtdanning:
      return (
        <TarUtdanning
          stønadstype={Stønadstype.overgangsstønad}
          underUtdanning={arbeidssituasjon.underUtdanning}
          oppdaterUnderUtdanning={(utdanning: UnderUtdanning) =>
            settArbeidssituasjon({
              ...arbeidssituasjon,
              underUtdanning: utdanning,
            })
          }
        />
      );

    case EAktivitet.harFåttJobbTilbud:
      return (
        <FåttJobbTilbud
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
        />
      );

    default:
      return <></>;
  }
};

export default AktivitetOppfølgingSpørsmål;
