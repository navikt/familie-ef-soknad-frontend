import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { ESvar, ESvarTekstid } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { erDatoGyldigOgInnaforBegrensninger } from '../../../../components/dato/gyldigeDatoerUtils';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Alert, RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import { GyldigeDatoer, Datovelger } from '../../../../components/dato/Datovelger';
import RadioPanelCustom from '../../../../components/panel/RadioPanel';

interface Props {
  settBo: (nyttBo: string) => void;
  boHosDeg: string;
  settDato: (date: string) => void;
  barnDato: string;
}

const RadiopanelWrapper = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    padding-top: 1rem;

    @media all and (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
`;

const LeggTilBarnUfødt: React.FC<Props> = ({ settBo, boHosDeg, settDato, barnDato }) => {
  const intl = useLokalIntlContext();

  return (
    <>
      <KomponentGruppe>
        <Datovelger
          settDato={(e) => settDato(e)}
          valgtDato={barnDato}
          tekstid={'barnadine.termindato'}
          datobegrensning={GyldigeDatoer.fremtidige}
        />
        <AlertStripeDokumentasjon>
          {hentTekst('barnadine.info.terminbekreftelse', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
      {barnDato && erDatoGyldigOgInnaforBegrensninger(barnDato, GyldigeDatoer.fremtidige) && (
        <KomponentGruppe>
          <RadiopanelWrapper>
            <RadioGroup
              legend={hentTekst('barnekort.spm.skalBarnetBoHosSøker', intl)}
              value={boHosDeg}
            >
              <RadioPanelCustom
                key={ESvar.JA}
                name={'radio-bosted'}
                value={ESvar.JA}
                checked={boHosDeg === ESvar.JA}
                onChange={(e) => settBo(e.target.value)}
              >
                {hentTekst(ESvarTekstid.JA, intl)}
              </RadioPanelCustom>
              <RadioPanelCustom
                key={ESvar.NEI}
                name={'radio-bosted'}
                value={ESvar.NEI}
                checked={boHosDeg === ESvar.NEI}
                onChange={(e) => settBo(e.target.value)}
              >
                {hentTekst(ESvarTekstid.NEI, intl)}
              </RadioPanelCustom>
            </RadioGroup>
          </RadiopanelWrapper>
          {boHosDeg === ESvar.NEI && (
            <Alert size="small" variant="warning" inline>
              {hentTekst('barnadine.advarsel.skalikkebo', intl)}
            </Alert>
          )}
        </KomponentGruppe>
      )}
    </>
  );
};

export default LeggTilBarnUfødt;
