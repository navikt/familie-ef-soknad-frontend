import React, { FC, useEffect, useState } from 'react';
import {
  IAksjeselskap,
  IAktivitet,
} from '../../../../models/steg/aktivitet/aktivitet';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { nyttTekstFelt } from '../../../../helpers/tommeSøknadsfelter';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import Aksjeselskap from './Aksjeselskap';
import { erAksjeselskapFerdigUtfylt } from '../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../components/knapper/LeggTilKnapp';
import { Heading, Label } from '@navikt/ds-react';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
  inkludertArbeidsmengde?: boolean;
}

const tomtAksjeselskap = (inkludertArbeidsmengde: boolean): IAksjeselskap => {
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
const EgetAS: FC<Props> = ({
  arbeidssituasjon,
  settArbeidssituasjon,
  inkludertArbeidsmengde = true,
}) => {
  const [egetAS, settEgetAS] = useState<IAksjeselskap[]>(
    arbeidssituasjon.egetAS
      ? arbeidssituasjon.egetAS
      : [tomtAksjeselskap(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settArbeidssituasjon({ ...arbeidssituasjon, egetAS: egetAS });
    // eslint-disable-next-line
  }, [egetAS]);

  const leggTilAksjeselskap = () => {
    const nyttAksjeselskap: IAksjeselskap = tomtAksjeselskap(
      inkludertArbeidsmengde
    );
    const arbeidsforhold: IAksjeselskap[] = egetAS;
    arbeidsforhold.push(nyttAksjeselskap);
    settArbeidssituasjon({ ...arbeidssituasjon, egetAS: arbeidsforhold });
  };

  return (
    <>
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          <LocaleTekst tekst={'egetAS.tittel'} />
        </Heading>
      </KomponentGruppe>

      {arbeidssituasjon.egetAS?.map((aksjeselskap, index) => {
        return (
          <SeksjonGruppe key={index}>
            <Aksjeselskap
              egetAS={egetAS}
              settEgetAS={settEgetAS}
              aksjeselskapnummer={index}
              inkludertArbeidsmengde={inkludertArbeidsmengde}
            />
          </SeksjonGruppe>
        );
      })}
      {erAksjeselskapFerdigUtfylt(egetAS, inkludertArbeidsmengde) && (
        <KomponentGruppe>
          <FeltGruppe>
            <Label as="p">
              <LocaleTekst tekst={'egetAS.label.flere'} />
            </Label>
            <LeggTilKnapp onClick={() => leggTilAksjeselskap()}>
              <LocaleTekst tekst={'egetAS.knapp.leggtil'} />
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};
export default EgetAS;
