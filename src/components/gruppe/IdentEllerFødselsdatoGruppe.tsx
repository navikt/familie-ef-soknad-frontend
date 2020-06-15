import React, { FC } from 'react';
import FeltGruppe from './FeltGruppe';
import { Checkbox, FnrInput } from 'nav-frontend-skjema';
import Datovelger, { DatoBegrensning } from '../dato/Datovelger';
import { hentTekst } from '../../utils/søknad';
import { useIntl } from 'react-intl';

interface Props {
  identLabel: string;
  datoLabel: string;
  checkboxLabel: string;
  ident: string | undefined;
  fødselsdato: string | undefined;
  checked: boolean;
  erGyldigIdent: boolean;
  settGyldigIdent: (erGyldig: boolean) => void;
  settChecked: (checked: boolean) => void;
  settFødselsdato: (date: Date | null) => void;
  settIdent: (ident: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdentEllerFødselsdatoGruppe: FC<Props> = ({
  identLabel,
  datoLabel,
  checkboxLabel,
  checked,
  ident,
  fødselsdato,
  erGyldigIdent,
  settGyldigIdent,
  settChecked,
  settIdent,
  settFødselsdato,
}) => {
  const intl = useIntl();

  const feilmelding: string = hentTekst('person.feilmelding.ident', intl);

  return (
    <>
      <FeltGruppe>
        <FnrInput
          className={'tjukk-tekst'}
          key={'ident'}
          label={identLabel}
          disabled={checked}
          type="text"
          bredde={'L'}
          value={ident ? ident : ''}
          feil={
            erGyldigIdent || (ident && ident !== '') || checked
              ? undefined
              : feilmelding
          }
          inputMode={'numeric'}
          onChange={(e) => settIdent(e)}
          onValidate={(valid) => {
            settGyldigIdent(valid);
          }}
        />
      </FeltGruppe>
      <FeltGruppe>
        <Checkbox
          className={'checkbox'}
          label={checkboxLabel}
          checked={checked}
          onChange={() => settChecked(!checked)}
        />
      </FeltGruppe>

      {checked && (
        <FeltGruppe>
          <Datovelger
            valgtDato={fødselsdato}
            tekstid={datoLabel}
            datobegrensning={DatoBegrensning.TidligereDatoer}
            settDato={(e) => settFødselsdato(e)}
          />
        </FeltGruppe>
      )}
    </>
  );
};

export default IdentEllerFødselsdatoGruppe;
