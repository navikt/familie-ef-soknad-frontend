import React from 'react';
import { ESvar, ESvarTekstid } from '../../../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { erDatoGyldigOgInnenforBegrensning } from '../../../../utils/gyldigeDatoerUtils';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Alert, RadioGroup, VStack } from '@navikt/ds-react';
import styles from './LeggTilBarnUfødt.module.css';
import { Datovelger } from '../../../../components/dato/Datovelger';
import RadioPanelCustom from '../../../../components/panel/RadioPanel';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';

interface Props {
  settBo: (nyttBo: string) => void;
  boHosDeg: string;
  settDato: (date: string) => void;
  barnDato: string;
}

export const LeggTilBarnUfødt: React.FC<Props> = ({ settBo, boHosDeg, settDato, barnDato }) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="6">
      <VStack gap="4">
        <Datovelger
          settDato={(e) => settDato(e)}
          valgtDato={barnDato}
          tekstid={'barnadine.termindato'}
          gyldigeDatoer={GyldigeDatoer.Fremtidige}
        />

        <Alert variant={'info'} size={'small'} inline>
          {hentTekst('barnadine.info.terminbekreftelse', intl)}
        </Alert>
      </VStack>
      {barnDato && erDatoGyldigOgInnenforBegrensning(barnDato, GyldigeDatoer.Fremtidige) && (
        <VStack gap="4">
          <div className={styles.radiopanelWrapper}>
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
          </div>
          {boHosDeg === ESvar.NEI && (
            <Alert size="small" variant="warning" inline>
              {hentTekst('barnadine.advarsel.skalikkebo', intl)}
            </Alert>
          )}
        </VStack>
      )}
    </VStack>
  );
};
