import React, { useEffect, useState } from 'react';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteFirmaUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { IFirma } from '../../../../../models/steg/aktivitet/firma';
import OmFirmaetDitt from './OmFirmaetDitt';
import { Heading, Label } from '@navikt/ds-react';

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

const OmFirmaeneDine: React.FC<Props> = ({
  arbeidssituasjon,
  settArbeidssituasjon,
  inkludertArbeidsmengde = true,
  overskuddsår,
}) => {
  const [firmaer, settFirmaer] = useState<IFirma[]>(
    arbeidssituasjon.firmaer ? arbeidssituasjon.firmaer : [tomtFirma(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settArbeidssituasjon({
      ...arbeidssituasjon,
      firmaer: firmaer,
    });
    // eslint-disable-next-line
  }, [firmaer]);

  const leggTilFirma = () => {
    const nyttFirma: IFirma = tomtFirma(inkludertArbeidsmengde);

    settFirmaer([...firmaer, nyttFirma]);
  };

  return (
    <>
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          <LocaleTekst tekst={'firmaer.tittel'} />
        </Heading>
      </KomponentGruppe>
      {firmaer?.map((firma, index) => {
        return (
          <SeksjonGruppe key={firma.id}>
            <OmFirmaetDitt
              firmaer={firmaer}
              settFirmaer={settFirmaer}
              firmanr={index}
              inkludertArbeidsmengde={inkludertArbeidsmengde}
              overskuddsår={overskuddsår}
            />
          </SeksjonGruppe>
        );
      })}

      {erSisteFirmaUtfylt(firmaer) && (
        <KomponentGruppe>
          <FeltGruppe>
            <Label as="p">
              <LocaleTekst tekst={'firmaer.label.flereFirmaer'} />
            </Label>
            <LeggTilKnapp onClick={() => leggTilFirma()}>
              <LocaleTekst tekst={'firmaer.knapp.leggTilFirma'} />
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};

export default OmFirmaeneDine;
