import React, { useEffect, useState } from 'react';
import Arbeidsgiver from './Arbeidsgiver';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { IArbeidsgiver } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteArbeidsgiverFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { Heading, Label } from '@navikt/ds-react';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
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
  arbeidssituasjon,
  settArbeidssituasjon,
  settDokumentasjonsbehov,
  inkludertArbeidsmengde = true,
}) => {
  const [arbeidsforhold, settArbeidsforhold] = useState<IArbeidsgiver[]>(
    arbeidssituasjon.arbeidsforhold
      ? arbeidssituasjon.arbeidsforhold
      : [tomArbeidsgiver(inkludertArbeidsmengde)]
  );

  useEffect(() => {
    settArbeidssituasjon({
      ...arbeidssituasjon,
      arbeidsforhold: arbeidsforhold,
    });
    // eslint-disable-next-line
  }, [arbeidsforhold]);

  const leggTilArbeidsgiver = () => {
    const nyArbeidsgiver: IArbeidsgiver = tomArbeidsgiver(inkludertArbeidsmengde);
    const alleArbeidsgivere = arbeidsforhold;
    alleArbeidsgivere.push(nyArbeidsgiver);
    settArbeidssituasjon({
      ...arbeidssituasjon,
      arbeidsforhold: alleArbeidsgivere,
    });
  };

  return (
    <>
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          <LocaleTekst tekst={'arbeidsforhold.tittel'} />
        </Heading>
      </KomponentGruppe>
      {arbeidssituasjon.arbeidsforhold?.map((arbeidsgiver, index) => {
        return (
          <SeksjonGruppe key={arbeidsgiver.id}>
            <Arbeidsgiver
              arbeidsforhold={arbeidsforhold}
              settArbeidsforhold={settArbeidsforhold}
              arbeidsgivernummer={index}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
              inkludertArbeidsmengde={inkludertArbeidsmengde}
            />
          </SeksjonGruppe>
        );
      })}

      {erSisteArbeidsgiverFerdigUtfylt(arbeidsforhold) && (
        <KomponentGruppe>
          <FeltGruppe>
            <Label as="p">
              <LocaleTekst tekst={'arbeidsforhold.label.flereArbeidsgivere'} />
            </Label>
            <LeggTilKnapp onClick={() => leggTilArbeidsgiver()}>
              <LocaleTekst tekst={'arbeidsforhold.knapp.leggTilArbeidsgiver'} />
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};

export default OmArbeidsforholdetDitt;
