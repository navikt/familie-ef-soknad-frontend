import React, { FC } from 'react';
import FeltGruppe from './FeltGruppe';
import { hentTekst } from '../../utils/søknad';
import KomponentGruppe from './KomponentGruppe';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Checkbox } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../TextFieldMedBredde';
import { DatoBegrensning, Datovelger } from '../dato/Datovelger';

interface Props {
  identLabel: string;
  datoLabel: string;
  checkboxLabel: string;
  ident: string | undefined;
  fødselsdato: string;
  checked: boolean;
  erGyldigIdent: boolean;
  settIdent: (ident: string) => void;
  settChecked: (checked: boolean) => void;
  settFødselsdato: (date: string) => void;
  testIder?: string[];
}

const IdentEllerFødselsdatoGruppe: FC<Props> = ({
  identLabel,
  datoLabel,
  checkboxLabel,
  checked,
  ident,
  fødselsdato,
  erGyldigIdent,
  settIdent,
  settChecked,
  settFødselsdato,
  testIder,
}) => {
  const intl = useLokalIntlContext();

  const feilmelding: string = hentTekst('person.feilmelding.ident', intl);

  return (
    <>
      <KomponentGruppe>
        <FeltGruppe>
          <TextFieldMedBredde
            key={'ident'}
            label={identLabel}
            disabled={checked}
            bredde={'L'}
            pattern="[0-9]*"
            value={ident}
            error={erGyldigIdent || !ident ? undefined : feilmelding}
            onChange={(e) => {
              settIdent(e.target.value);
            }}
            data-testid={testIder && testIder[0]}
          />
        </FeltGruppe>
        <FeltGruppe>
          <Checkbox
            className={'checkbox'}
            checked={checked}
            onChange={() => settChecked(!checked)}
            data-testid={testIder && testIder[1]}
          >
            {checkboxLabel}
          </Checkbox>
        </FeltGruppe>
      </KomponentGruppe>
      {checked && (
        <KomponentGruppe>
          <Datovelger
            valgtDato={fødselsdato}
            tekstid={datoLabel}
            datobegrensning={DatoBegrensning.TidligereDatoer}
            settDato={(e) => settFødselsdato(e)}
            testId={testIder && testIder[2]}
          />
        </KomponentGruppe>
      )}
    </>
  );
};

export default IdentEllerFødselsdatoGruppe;
