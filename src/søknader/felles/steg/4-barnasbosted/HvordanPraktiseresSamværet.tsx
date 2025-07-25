import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IForelder } from '../../../../models/steg/forelder';
import { BodyShort, Label, Textarea } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
  forelder: IForelder;
  settForelder: (verdi: IForelder) => void;
}

const HvordanPraktiseresSamværet: React.FC<Props> = ({ forelder, settForelder }) => {
  const intl = useLokalIntlContext();

  return (
    <KomponentGruppe className="hvordan-praktiseres-samværet">
      <FeltGruppe>
        <Label as="p">{hentTekst('barnasbosted.element.samvær', intl)}</Label>
        <BodyShort>{hentTekst('barnasbosted.normaltekst.opplysninger', intl)}</BodyShort>
        <ul>
          <li>
            <BodyShort>{hentTekst('barnasbosted.normaltekst.hvormangedager', intl)}</BodyShort>
          </li>
          <li>
            <BodyShort>{hentTekst('barnasbosted.normaltekst.nårreiserbarnet', intl)}</BodyShort>
          </li>
        </ul>
      </FeltGruppe>
      <FeltGruppe>
        <Textarea
          data-testid="hvordanPraktiseresSamværet"
          autoComplete={'off'}
          value={
            forelder.hvordanPraktiseresSamværet && forelder.hvordanPraktiseresSamværet.verdi
              ? forelder.hvordanPraktiseresSamværet.verdi
              : ''
          }
          onChange={(e) =>
            settForelder({
              ...forelder,
              hvordanPraktiseresSamværet: {
                label: hentTekst('barnasbosted.element.samvær', intl),
                verdi: e.target.value,
              },
            })
          }
          label=""
        />
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default HvordanPraktiseresSamværet;
