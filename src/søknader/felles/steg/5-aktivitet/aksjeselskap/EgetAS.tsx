import React, { FC, useEffect, useState } from 'react';
import { IAksjeselskap, IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import Aksjeselskap from './Aksjeselskap';
import { erAksjeselskapFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { Heading, Label } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

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
  const intl = useLokalIntlContext();
  const [egetAS, settEgetAS] = useState<IAksjeselskap[]>(
    arbeidssituasjon.egetAS ? arbeidssituasjon.egetAS : [tomtAksjeselskap(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settArbeidssituasjon({ ...arbeidssituasjon, egetAS: egetAS });
    // eslint-disable-next-line
  }, [egetAS]);

  const leggTilAksjeselskap = () => {
    const nyttAksjeselskap: IAksjeselskap = tomtAksjeselskap(inkludertArbeidsmengde);
    const arbeidsforhold: IAksjeselskap[] = egetAS;
    arbeidsforhold.push(nyttAksjeselskap);
    settArbeidssituasjon({ ...arbeidssituasjon, egetAS: arbeidsforhold });
  };

  return (
    <>
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          {hentTekst('egetAS.tittel', intl)}
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
            <Label as="p">{hentTekst('egetAS.label.flere', intl)}</Label>
            <LeggTilKnapp onClick={() => leggTilAksjeselskap()}>
              {hentTekst('egetAS.knapp.leggtil', intl)}
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};
export default EgetAS;
