import React, { FC } from 'react';
import { EAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import OmArbeidsforholdetDitt from '../../../felles/steg/5-aktivitet/arbeidsforhold/OmArbeidsforholdetDitt';
import EgetAS from '../../../felles/steg/5-aktivitet/aksjeselskap/EgetAS';
import EtablererEgenVirksomhet from '../../../felles/steg/5-aktivitet/EtablererEgenVirksomhet';
import OmFirmaeneDine from '../../../felles/steg/5-aktivitet/Firma/OmFirmaeneDine';
import { useAktivitet } from './AktivitetContext';
import { nullableStrengTilDato, nåværendeÅr } from '../../../../utils/dato';

interface Props {
  svarid: string;
}
const AktivitetOppfølgingSpørsmål: FC<Props> = ({ svarid }) => {
  const { søknad, arbeidssituasjon, settArbeidssituasjon, settDokumentasjonsbehov } =
    useAktivitet();

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
          overskuddsår={
            nullableStrengTilDato(søknad.datoPåbegyntSøknad)?.getFullYear() || nåværendeÅr
          }
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
