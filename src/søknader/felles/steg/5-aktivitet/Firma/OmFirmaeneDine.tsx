import React, { useEffect, useState } from 'react';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteFirmaUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { IFirma } from '../../../../../models/steg/aktivitet/firma';
import OmFirmaetDitt from './OmFirmaetDitt';
import { Heading, Label } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
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

const OmFirmaeneDine: React.FC<Props> = ({
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
          {hentTekst('firmaer.tittel', intl)}
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
            <Label as="p">{hentTekst('firmaer.label.flereFirmaer', intl)}</Label>
            <LeggTilKnapp onClick={() => leggTilFirma()}>
              {hentTekst('firmaer.knapp.leggTilFirma', intl)}
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};

export default OmFirmaeneDine;
