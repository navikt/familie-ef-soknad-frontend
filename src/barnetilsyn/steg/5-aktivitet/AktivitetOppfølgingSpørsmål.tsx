import React, { FC } from 'react';
import {
  EAktivitet,
  IAktivitet,
} from '../../../models/steg/aktivitet/aktivitet';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import EtablererEgenVirksomhet from './EtablererEgenVirksomhet';
import EgetAS from './aksjeselskap/EgetAS';
import OmArbeidsforholdetDitt from './arbeidsforhold/OmArbeidsforholdetDitt';
import OmFirmaeneDine from './firma/OmFirmaeneDine';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
  svarid: string;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
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
    case EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser:
      return (
        <OmArbeidsforholdetDitt
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
          inkludertArbeidsmengde={false}
        />
      );

    case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
      return (
        <OmFirmaeneDine
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          inkludertArbeidsmengde={false}
          overskuddsår={overskuddsår}
        />
      );

    case EAktivitet.erAnsattIEgetAS:
      return (
        <EgetAS
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
          inkludertArbeidsmengde={false}
        />
      );

    case EAktivitet.etablererEgenVirksomhet:
      return (
        <EtablererEgenVirksomhet
          arbeidssituasjon={arbeidssituasjon}
          settArbeidssituasjon={settArbeidssituasjon}
        />
      );

    default:
      return <></>;
  }
};

export default AktivitetOppfølgingSpørsmål;
