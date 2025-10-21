import React, { useEffect, useState } from 'react';
import { Arbeidsgiver } from './Arbeidsgiver';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { IArbeidsgiver } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteArbeidsgiverFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { Heading, Label, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

interface Props {
  aktivitet: IAktivitet;
  settAktivitet: (nyArbeidssituasjon: IAktivitet) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  inkludertArbeidsmengde?: boolean;
}

const tomArbeidsgiver = (inkludertArbeidsmengde: boolean): IArbeidsgiver => {
  return inkludertArbeidsmengde
    ? {
        id: hentUid(),
        navn: nyttTekstFelt,
        arbeidsmengde: nyttTekstFelt,
      }
    : {
        id: hentUid(),
        navn: nyttTekstFelt,
      };
};

const OmArbeidsforholdetDitt: React.FC<Props> = ({
  aktivitet,
  settAktivitet,
  settDokumentasjonsbehov,
  inkludertArbeidsmengde = true,
}) => {
  const intl = useLokalIntlContext();
  const [arbeidsforhold, settArbeidsforhold] = useState<IArbeidsgiver[]>(
    aktivitet.arbeidsforhold ? aktivitet.arbeidsforhold : [tomArbeidsgiver(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settAktivitet({
      ...aktivitet,
      arbeidsforhold: arbeidsforhold,
    });
  }, [arbeidsforhold]);

  const leggTilArbeidsgiver = () => {
    const nyArbeidsgiver: IArbeidsgiver = tomArbeidsgiver(inkludertArbeidsmengde);
    const alleArbeidsgivere = arbeidsforhold;
    alleArbeidsgivere.push(nyArbeidsgiver);
    settAktivitet({
      ...aktivitet,
      arbeidsforhold: alleArbeidsgivere,
    });
  };

  return (
    <VStack gap={'12'}>
      <Heading size="small" level="3" align={'center'}>
        {hentTekst('arbeidsforhold.tittel', intl)}
      </Heading>
      {aktivitet.arbeidsforhold?.map((arbeidsgiver, index) => {
        return (
          <Arbeidsgiver
            key={arbeidsgiver.id}
            arbeidsforhold={arbeidsforhold}
            settArbeidsforhold={settArbeidsforhold}
            arbeidsgivernummer={index}
            settDokumentasjonsbehov={settDokumentasjonsbehov}
            inkludertArbeidsmengde={inkludertArbeidsmengde}
          />
        );
      })}

      {erSisteArbeidsgiverFerdigUtfylt(arbeidsforhold) && (
        <VStack align={'start'}>
          <Label as="p">{hentTekst('arbeidsforhold.label.flereArbeidsgivere', intl)}</Label>
          <LeggTilKnapp onClick={() => leggTilArbeidsgiver()}>
            {hentTekst('arbeidsforhold.knapp.leggTilArbeidsgiver', intl)}
          </LeggTilKnapp>
        </VStack>
      )}
    </VStack>
  );
};

export default OmArbeidsforholdetDitt;
