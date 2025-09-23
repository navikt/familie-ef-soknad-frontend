import React, { useEffect, useState } from 'react';
import Arbeidsgiver from './Arbeidsgiver';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { IArbeidsgiver } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { erSisteArbeidsgiverFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { Heading, Label } from '@navikt/ds-react';
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
    // eslint-disable-next-line
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
    <>
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          {hentTekst('arbeidsforhold.tittel', intl)}
        </Heading>
      </KomponentGruppe>
      {aktivitet.arbeidsforhold?.map((arbeidsgiver, index) => {
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
            <Label as="p">{hentTekst('arbeidsforhold.label.flereArbeidsgivere', intl)}</Label>
            <LeggTilKnapp onClick={() => leggTilArbeidsgiver()}>
              {hentTekst('arbeidsforhold.knapp.leggTilArbeidsgiver', intl)}
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};

export default OmArbeidsforholdetDitt;
