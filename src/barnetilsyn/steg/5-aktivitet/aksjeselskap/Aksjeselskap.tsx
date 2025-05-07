import React, { FC, useEffect, useState } from 'react';
import { TittelOgSlettKnapp } from '../../../../components/knapper/TittelOgSlettKnapp';
import { SlettKnapp } from '../../../../components/knapper/SlettKnapp';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import InputLabelGruppe from '../../../../components/gruppe/InputLabelGruppe';
import { hentTittelMedNr } from '../../../../language/utils';
import { hentTekst } from '../../../../utils/søknad';
import {
  EAksjeselskap,
  IAksjeselskap,
} from '../../../../models/steg/aktivitet/aktivitet';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Heading } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';

interface Props {
  egetAS: IAksjeselskap[];
  settEgetAS: (egetAS: IAksjeselskap[]) => void;
  aksjeselskapnummer: number;
  inkludertArbeidsmengde: boolean;
}

const Aksjeselskap: FC<Props> = ({
  egetAS,
  settEgetAS,
  aksjeselskapnummer,
  inkludertArbeidsmengde,
}) => {
  const intl = useLokalIntlContext();
  const aksjeselskapFraSøknad = egetAS?.find(
    (aksjeselskap, index) => index === aksjeselskapnummer && aksjeselskap
  );
  const [aksjeselskap, settAksjeselskap] = useState<IAksjeselskap>(
    aksjeselskapFraSøknad!
  );

  useEffect(() => {
    const endretAksjeselskap = egetAS?.map((aksjeselskapFraSøknad, index) => {
      if (index === aksjeselskapnummer) return aksjeselskap;
      else return aksjeselskapFraSøknad;
    });
    endretAksjeselskap && settEgetAS(endretAksjeselskap);
    // eslint-disable-next-line
  }, [aksjeselskap]);

  const aksjeselskapTittel = hentTittelMedNr(
    egetAS!,
    aksjeselskapnummer,
    intl.formatMessage({ id: 'egetAS.label.aksjeselskap' })
  );
  const navnLabel: string = hentTekst('egetAS.label.navn', intl);
  const arbeidsmengdeLabel: string = hentTekst(
    'arbeidsforhold.label.arbeidsmengde',
    intl
  );

  const fjernAksjeselskap = () => {
    if (egetAS && egetAS.length > 1) {
      const endretAksjeselskap = egetAS?.filter(
        (aksjeselskap, index) => aksjeselskap && index !== aksjeselskapnummer
      );
      endretAksjeselskap && settEgetAS(endretAksjeselskap);
    }
  };

  const settTekstInputFelt = (
    e: React.FormEvent<HTMLInputElement>,
    label: string,
    nøkkel: EAksjeselskap
  ) => {
    aksjeselskap &&
      settAksjeselskap({
        ...aksjeselskap,
        [nøkkel]: { label: label, verdi: e.currentTarget.value },
      });
  };

  const skalViseSlettKnapp = egetAS?.length;

  return (
    <div aria-live="polite" role="region">
      <TittelOgSlettKnapp justify="space-between" align="center">
        <Heading size="small" level="4" className={'tittel'}>
          {aksjeselskapTittel}
        </Heading>
        {skalViseSlettKnapp && (
          <SlettKnapp
            onClick={() => fjernAksjeselskap()}
            tekstid={'arbeidsforhold.knapp.slettArbeidsgiver'}
          />
        )}
      </TittelOgSlettKnapp>
      <FeltGruppe>
        <TextFieldMedBredde
          key={navnLabel}
          label={navnLabel}
          type="text"
          bredde={'L'}
          onChange={(e) => settTekstInputFelt(e, navnLabel, EAksjeselskap.navn)}
          value={aksjeselskap?.navn?.verdi ? aksjeselskap.navn.verdi : ''}
        />
      </FeltGruppe>
      {aksjeselskap.navn?.verdi && inkludertArbeidsmengde && (
        <FeltGruppe>
          <InputLabelGruppe
            label={arbeidsmengdeLabel}
            nøkkel={EAksjeselskap.arbeidsmengde}
            type={'number'}
            bredde={'XXS'}
            value={
              aksjeselskap?.arbeidsmengde?.verdi
                ? aksjeselskap?.arbeidsmengde?.verdi
                : ''
            }
            settInputFelt={(e) =>
              settTekstInputFelt(
                e,
                arbeidsmengdeLabel,
                EAksjeselskap.arbeidsmengde
              )
            }
            beskrivendeTekst={'%'}
          />
        </FeltGruppe>
      )}
    </div>
  );
};

export default Aksjeselskap;
