import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IForelder } from '../../../../models/steg/forelder';
import { BodyShort, Label, Textarea } from '@navikt/ds-react';

interface Props {
  forelder: IForelder;
  settForelder: (verdi: IForelder) => void;
}

const HvordanPraktiseresSamværet: React.FC<Props> = ({
  forelder,
  settForelder,
}) => {
  const intl = useLokalIntlContext();

  return (
    <KomponentGruppe className="hvordan-praktiseres-samværet">
      <FeltGruppe>
        <Label as="p">
          {intl.formatMessage({ id: 'barnasbosted.element.samvær' })}
        </Label>
        <BodyShort>
          {intl.formatMessage({ id: 'barnasbosted.normaltekst.opplysninger' })}
        </BodyShort>
        <ul>
          <li>
            <BodyShort>
              {intl.formatMessage({
                id: 'barnasbosted.normaltekst.hvormangedager',
              })}
            </BodyShort>
          </li>
          <li>
            <BodyShort>
              {intl.formatMessage({
                id: 'barnasbosted.normaltekst.nårreiserbarnet',
              })}
            </BodyShort>
          </li>
        </ul>
      </FeltGruppe>
      <FeltGruppe>
        <Textarea
          autoComplete={'off'}
          value={
            forelder.hvordanPraktiseresSamværet &&
            forelder.hvordanPraktiseresSamværet.verdi
              ? forelder.hvordanPraktiseresSamværet.verdi
              : ''
          }
          onChange={(e) =>
            settForelder({
              ...forelder,
              hvordanPraktiseresSamværet: {
                label: intl.formatMessage({
                  id: 'barnasbosted.element.samvær',
                }),
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
