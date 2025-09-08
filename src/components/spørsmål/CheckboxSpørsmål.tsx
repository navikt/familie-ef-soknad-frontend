import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { CheckboxPanel } from '../panel/CheckboxPanel';
import { CheckboxGroup, Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';

interface Props {
  spørsmål: ISpørsmål;
  settValgteSvar: (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => void;
  valgteSvar: string[];
  skalLogges: boolean;
  brukSvarIdSomVerdi?: boolean;
}

export const CheckboxSpørsmål: React.FC<Props> = ({
  spørsmål,
  settValgteSvar,
  valgteSvar,
  brukSvarIdSomVerdi,
}) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="6">
      <VStack gap="2">
        <Heading size="small">{hentTekst(spørsmål.tekstid, intl)}</Heading>

        {spørsmål.lesmer && (
          <ReadMore header={hentTekst(spørsmål.lesmer.headerTekstid, intl)} size="small">
            {hentTekst(spørsmål.lesmer.innholdTekstid, intl)}
          </ReadMore>
        )}
      </VStack>

      <CheckboxGroup legend={hentTekst(spørsmål.tekstid, intl)} hideLegend value={valgteSvar}>
        <VStack gap="4">
          {spørsmål.svaralternativer.map((svar: ISvar) => {
            const alleredeHuketAvISøknad = valgteSvar.some((valgtSvar) => {
              return valgtSvar === svar.svar_tekst || valgtSvar === svar.id;
            });

            return (
              <CheckboxPanel
                key={svar.svar_tekst}
                value={brukSvarIdSomVerdi ? svar.id : svar.svar_tekst}
                checked={alleredeHuketAvISøknad}
                onChange={() => {
                  settValgteSvar(spørsmål, alleredeHuketAvISøknad, svar);
                }}
              >
                {svar.svar_tekst}
              </CheckboxPanel>
            );
          })}
        </VStack>
      </CheckboxGroup>
    </VStack>
  );
};
