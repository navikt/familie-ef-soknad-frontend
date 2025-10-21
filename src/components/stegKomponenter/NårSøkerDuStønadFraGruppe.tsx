import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import styled from 'styled-components';
import { IDatoFelt, ISpørsmålBooleanFelt } from '../../models/søknad/søknadsfelter';
import MånedÅrVelger from '../dato/MånedÅrVelger';
import { strengTilDato } from '../../utils/dato';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Label, RadioGroup, VStack } from '@navikt/ds-react';
import RadioPanelCustom from '../panel/RadioPanel';
import { hentTekst } from '../../utils/teksthåndtering';
import { GyldigeDatoer } from '../dato/GyldigeDatoer';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';
import { AlertStripeDokumentasjon } from '../AlertstripeDokumentasjon';

const StyledMultisvarSpørsmål = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    padding-top: 1rem;

    @media all and (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }
`;

interface Props {
  spørsmål: ISpørsmål;
  settSøkerFraBestemtMåned: (spørsmål: ISpørsmål, svar: ISvar) => void;
  søkerFraBestemtMåned: ISpørsmålBooleanFelt | undefined;
  settDato: (dato: Date | null) => void;
  valgtDato: IDatoFelt | undefined;
  datovelgerLabel: string;
  hjelpetekstInnholdTekst: string | React.ReactNode;
  alertTekst?: string;
}

const NårSøkerDuStønadFra: React.FC<Props> = ({
  spørsmål,
  settSøkerFraBestemtMåned,
  settDato,
  søkerFraBestemtMåned,
  valgtDato,
  datovelgerLabel,
  hjelpetekstInnholdTekst,
  alertTekst,
}) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap={'16'}>
      <VStack>
        <StyledMultisvarSpørsmål>
          <RadioGroup
            legend={hentTekst(spørsmål.tekstid, intl)}
            value={søkerFraBestemtMåned?.svarid}
            description={
              <LesMerTekst
                åpneTekstid={'søkerFraBestemtMåned.hjelpetekst-åpne'}
                innholdTekst={hjelpetekstInnholdTekst}
              />
            }
          >
            {spørsmål.svaralternativer.map((svar: ISvar) => {
              const svarISøknad = svar.id === søkerFraBestemtMåned?.svarid;
              return (
                <RadioPanelCustom
                  key={svar.svar_tekst}
                  name={spørsmål.søknadid}
                  value={svar.id}
                  checked={svarISøknad ? svarISøknad : false}
                  onChange={() => settSøkerFraBestemtMåned(spørsmål, svar)}
                >
                  {svar.svar_tekst}
                </RadioPanelCustom>
              );
            })}
          </RadioGroup>
        </StyledMultisvarSpørsmål>
      </VStack>

      {søkerFraBestemtMåned?.verdi === true && (
        <VStack gap={'2'}>
          <Label as="p">{hentTekst('søkerFraBestemtMåned.datovelger', intl)}</Label>
          <MånedÅrVelger
            valgtDato={valgtDato?.verdi ? strengTilDato(valgtDato?.verdi) : undefined}
            tekstid={datovelgerLabel}
            gyldigeDatoer={GyldigeDatoer.FemÅrTidligereOgSeksMånederFrem}
            settDato={settDato}
          />
          {alertTekst && (
            <AlertStripeDokumentasjon>{hentTekst(alertTekst, intl)}</AlertStripeDokumentasjon>
          )}
        </VStack>
      )}
    </VStack>
  );
};
export default NårSøkerDuStønadFra;
