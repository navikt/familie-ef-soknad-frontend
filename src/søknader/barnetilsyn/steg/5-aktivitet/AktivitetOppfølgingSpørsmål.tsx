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
export const AktivitetOppfølgingSpørsmål: FC<Props> = ({ svarid }) => {
  const { søknad, aktivitet, settAktivitet, settDokumentasjonsbehov } = useAktivitet();

  switch (svarid) {
    case EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser:
      return (
        <OmArbeidsforholdetDitt
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
          inkludertArbeidsmengde={false}
        />
      );
    case EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser:
      return (
        <OmFirmaeneDine
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
          inkludertArbeidsmengde={false}
          overskuddsår={
            nullableStrengTilDato(søknad.datoPåbegyntSøknad)?.getFullYear() || nåværendeÅr
          }
        />
      );
    case EAktivitet.erAnsattIEgetAS:
      return (
        <EgetAS
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
          inkludertArbeidsmengde={false}
        />
      );
    case EAktivitet.etablererEgenVirksomhet:
      return (
        <EtablererEgenVirksomhet
          arbeidssituasjon={aktivitet}
          settArbeidssituasjon={settAktivitet}
        />
      );
    default:
      return <></>;
  }
};
