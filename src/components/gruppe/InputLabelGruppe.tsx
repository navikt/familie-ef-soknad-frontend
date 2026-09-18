import React from 'react';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../TextFieldMedBredde';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../utils/teksthåndtering';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

interface Props {
  label: string;
  utvidetTekstNøkkel?: string;
  hjelpetekst?: IHjelpetekst;
  nøkkel: string;
  type?: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
  bredde?: 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
  settInputFelt: (e: React.FormEvent<HTMLInputElement>, nøkkel: string, label: string) => void;
  beskrivendeTekst: string;
  value: string;
  feil?: React.ReactNode | boolean;
  placeholder?: string;
  testId?: string;
}

const InputLabelGruppe: React.FC<Props> = ({
  label,
  hjelpetekst,
  nøkkel,
  value,
  type,
  bredde,
  settInputFelt,
  beskrivendeTekst,
  feil,
  placeholder,
  utvidetTekstNøkkel,
  testId,
}) => {
  const intl = useLokalIntlContext();
  const ignorerScrollForTallInput = (e: any) => e.target.blur();

  return (
    <VStack gap={'space-4'}>
      <Label as={'label'} htmlFor={label}>
        {label}
      </Label>
      {hjelpetekst && (
        <LesMerTekst
          åpneTekstid={hjelpetekst.headerTekstid}
          innholdTekstid={hjelpetekst.innholdTekstid}
        />
      )}
      {utvidetTekstNøkkel && (
        <BodyShort as={'span'} size={'small'}>
          {hentHTMLTekst(utvidetTekstNøkkel, intl)}
        </BodyShort>
      )}
      <HStack align={'center'} gap={'space-4'}>
        <TextFieldMedBredde
          label={label}
          hideLabel
          aria-label={label}
          id={label}
          key={label}
          type={type}
          bredde={bredde}
          onChange={(e) => settInputFelt(e, nøkkel, label)}
          value={value}
          error={feil}
          placeholder={placeholder}
          onWheel={ignorerScrollForTallInput}
          data-testid={testId}
        />
        <BodyShort className={'beskrivendeTekst'}>{beskrivendeTekst}</BodyShort>
      </HStack>
    </VStack>
  );
};

export default InputLabelGruppe;
