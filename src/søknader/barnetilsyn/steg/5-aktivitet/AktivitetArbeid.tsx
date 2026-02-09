import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { CheckboxSpørsmål } from '../../../../components/spørsmål/CheckboxSpørsmål';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import {
  filtrerAktivitetSvaralternativer,
  fjernAktivitet,
} from '../../../../helpers/steg/aktivitet';
import { hvaErDinArbeidssituasjonSpm } from './AktivitetConfig';
import { AktivitetOppfølgingSpørsmål } from './AktivitetOppfølgingSpørsmål';
import { useAktivitet } from './AktivitetContext';
import { VStack } from '@navikt/ds-react';

export const AktivitetArbeid: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, aktivitet, settAktivitet, settDokumentasjonsbehov } = useAktivitet();
  const { hvaErDinArbeidssituasjon } = aktivitet;

  const settArbeidssituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      hvaErDinArbeidssituasjon,
      svarHuketAv,
      svar
    );

    const endretArbeidssituasjon = fjernAktivitet(svarider, aktivitet);

    settAktivitet({
      ...endretArbeidssituasjon,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svarider,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: avhukedeSvar,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  return (
    <VStack gap={'space-48'}>
      <CheckboxSpørsmål
        spørsmål={filtrerAktivitetSvaralternativer(
          søknad.person,
          hvaErDinArbeidssituasjonSpm(intl)
        )}
        settValgteSvar={settArbeidssituasjonFelt}
        valgteSvar={hvaErDinArbeidssituasjon?.verdi ? hvaErDinArbeidssituasjon?.verdi : []}
      />
      {aktivitet.hvaErDinArbeidssituasjon?.svarid?.map((svarid, index) => (
        <AktivitetOppfølgingSpørsmål aria-live="polite" key={index} svarid={svarid} />
      ))}
    </VStack>
  );
};
