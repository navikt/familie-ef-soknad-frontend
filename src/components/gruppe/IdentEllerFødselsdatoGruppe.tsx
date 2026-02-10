import React, { FC } from 'react';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Checkbox, TextField, VStack } from '@navikt/ds-react';
import { Datovelger } from '../dato/Datovelger';
import { GyldigeDatoer } from '../dato/GyldigeDatoer';

interface Props {
  identLabel: string;
  datoLabelId: string;
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

export const IdentEllerFødselsdatoGruppe: FC<Props> = ({
  identLabel,
  datoLabelId,
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
    <VStack gap={'space-24'}>
      <TextField
        key={'ident'}
        label={identLabel}
        disabled={checked}
        pattern="[0-9]*"
        value={ident}
        error={erGyldigIdent || !ident ? undefined : feilmelding}
        onChange={(e) => {
          settIdent(e.target.value);
        }}
        data-testid={testIder && testIder[0]}
      />

      <Checkbox
        className={'checkbox'}
        checked={checked}
        onChange={() => settChecked(!checked)}
        data-testid={testIder && testIder[1]}
      >
        {checkboxLabel}
      </Checkbox>

      {checked && (
        <Datovelger
          valgtDato={fødselsdato}
          tekstid={datoLabelId}
          gyldigeDatoer={GyldigeDatoer.Tidligere}
          settDato={(e) => settFødselsdato(e)}
          testId={testIder && testIder[2]}
        />
      )}
    </VStack>
  );
};
