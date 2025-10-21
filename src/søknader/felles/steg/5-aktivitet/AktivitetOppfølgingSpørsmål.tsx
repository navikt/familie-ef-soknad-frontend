import React, { FC } from 'react';
import { EAktivitet, IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import HjemmeMedBarnUnderEttÅr from './HjemmeMedBarnUnderEttÅr';
import { OmArbeidsforholdetDitt } from './arbeidsforhold/OmArbeidsforholdetDitt';
import EtablererEgenVirksomhet from './EtablererEgenVirksomhet';
import { Arbeidssøker } from './arbeidssøker/Arbeidssøker';
import { TarUtdanning } from './utdanning/TarUtdanning';
import { EgetAS } from './aksjeselskap/EgetAS';
import FåttJobbTilbud from './FåttJobbTilbud';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import OmFirmaeneDine from './Firma/OmFirmaeneDine';
import { UnderUtdanning } from '../../../../models/steg/aktivitet/utdanning';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

interface Props {
  aktivitet: IAktivitet;
  settAktivitet: (arbeidssituasjon: IAktivitet) => void;
  svarid: string;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  overskuddsår: number;
}
const AktivitetOppfølgingSpørsmål: FC<Props> = ({
  aktivitet,
  settAktivitet,
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
          aktivitet={aktivitet}
          settAktivitet={settAktivitet}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
      );

    case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
      return (
        <OmFirmaeneDine
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
          overskuddsår={overskuddsår}
        />
      );

    case EAktivitet.erAnsattIEgetAS:
      return <EgetAS arbeidssituasjon={aktivitet} settArbeidssituasjon={settAktivitet} />;

    case EAktivitet.etablererEgenVirksomhet:
      return (
        <EtablererEgenVirksomhet
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
        />
      );

    case EAktivitet.erArbeidssøker:
      return (
        <Arbeidssøker
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
      );

    case EAktivitet.tarUtdanning:
      return (
        <TarUtdanning
          stønadstype={Stønadstype.overgangsstønad}
          underUtdanning={aktivitet.underUtdanning}
          oppdaterUnderUtdanning={(utdanning: UnderUtdanning) =>
            settAktivitet({
              ...aktivitet,
              underUtdanning: utdanning,
            })
          }
        />
      );

    case EAktivitet.harFåttJobbTilbud:
      return <FåttJobbTilbud arbeidssituasjon={aktivitet} settArbeidssituasjon={settAktivitet} />;

    default:
      return <></>;
  }
};

export default AktivitetOppfølgingSpørsmål;
