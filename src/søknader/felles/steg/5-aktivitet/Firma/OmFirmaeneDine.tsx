import React, { useEffect, useState } from 'react';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteFirmaUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { IFirma } from '../../../../../models/steg/aktivitet/firma';
import { OmFirmaetDitt } from './OmFirmaetDitt';
import { Heading, Label, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
  inkludertArbeidsmengde?: boolean;
  overskuddsår: number;
}

const tomtFirma = (inkludertArbeidsmengde: boolean): IFirma => {
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

export const OmFirmaeneDine: React.FC<Props> = ({
  arbeidssituasjon,
  settArbeidssituasjon,
  inkludertArbeidsmengde = true,
  overskuddsår,
}) => {
  const intl = useLokalIntlContext();
  const [firmaer, settFirmaer] = useState<IFirma[]>(
    arbeidssituasjon.firmaer ? arbeidssituasjon.firmaer : [tomtFirma(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settArbeidssituasjon({
      ...arbeidssituasjon,
      firmaer: firmaer,
    });
  }, [firmaer]);

  const leggTilFirma = () => {
    const nyttFirma: IFirma = tomtFirma(inkludertArbeidsmengde);

    settFirmaer([...firmaer, nyttFirma]);
  };

  return (
    <VStack gap={'space-32'}>
      <Heading size="small" level="3" align={'center'}>
        {hentTekst('firmaer.tittel', intl)}
      </Heading>
      {firmaer?.map((firma, index) => {
        return (
          <OmFirmaetDitt
            key={firma.id}
            firmaer={firmaer}
            settFirmaer={settFirmaer}
            firmanr={index}
            inkludertArbeidsmengde={inkludertArbeidsmengde}
            overskuddsår={overskuddsår}
          />
        );
      })}

      {erSisteFirmaUtfylt(firmaer) && (
        <VStack align={'start'}>
          <Label as="p">{hentTekst('firmaer.label.flereFirmaer', intl)}</Label>
          <LeggTilKnapp onClick={() => leggTilFirma()}>
            {hentTekst('firmaer.knapp.leggTilFirma', intl)}
          </LeggTilKnapp>
        </VStack>
      )}
    </VStack>
  );
};
