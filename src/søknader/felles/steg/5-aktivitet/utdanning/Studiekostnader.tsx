import React from 'react';
import InputLabelGruppe from '../../../../../components/gruppe/InputLabelGruppe';
import { EUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentHTMLTekst, hentTekst } from '../../../../../utils/teksthåndtering';
import { DetaljertUtdanning } from '../../../../skolepenger/models/detaljertUtdanning';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { AlertStripeDokumentasjon } from '../../../../../components/AlertstripeDokumentasjon';

interface Props {
  utdanning: DetaljertUtdanning;
  oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
}

export const Studiekostnader: React.FC<Props> = ({ utdanning, oppdaterUtdanning }) => {
  const intl = useLokalIntlContext();

  const settInputFelt = (
    nøkkel: EUtdanning,
    label: string,
    e: React.FormEvent<HTMLInputElement>
  ) => {
    oppdaterUtdanning(nøkkel, label, e.currentTarget.value);
  };

  const semesteravgiftLabel = hentTekst('utdanning.label.utgifter.semesteravgift', intl);
  const studieavgiftLabel = hentTekst('utdanning.label.utgifter.studieavgift', intl);
  const eksamensgebyrLabel = hentTekst('utdanning.label.utgifter.eksamensgebyr', intl);

  return (
    <VStack gap={'8'}>
      <Heading size="small">{hentTekst('utdanning.label.utgifter', intl)}</Heading>
      <InputLabelGruppe
        label={semesteravgiftLabel}
        nøkkel={EUtdanning.semesteravgift}
        type={'number'}
        bredde={'XXS'}
        settInputFelt={(e) => settInputFelt(EUtdanning.semesteravgift, semesteravgiftLabel, e)}
        beskrivendeTekst={'kroner'}
        value={utdanning?.semesteravgift?.verdi ? utdanning?.semesteravgift?.verdi : ''}
      />
      <InputLabelGruppe
        label={studieavgiftLabel}
        nøkkel={EUtdanning.studieavgift}
        type={'number'}
        bredde={'XXS'}
        settInputFelt={(e) => settInputFelt(EUtdanning.studieavgift, studieavgiftLabel, e)}
        beskrivendeTekst={'kroner'}
        value={utdanning?.studieavgift?.verdi ? utdanning?.studieavgift?.verdi : ''}
      />
      <InputLabelGruppe
        label={eksamensgebyrLabel}
        nøkkel={EUtdanning.eksamensgebyr}
        type={'number'}
        bredde={'XXS'}
        settInputFelt={(e) => settInputFelt(EUtdanning.eksamensgebyr, eksamensgebyrLabel, e)}
        beskrivendeTekst={'kroner'}
        value={utdanning?.eksamensgebyr?.verdi ? utdanning?.eksamensgebyr?.verdi : ''}
      />
      <AlertStripeDokumentasjon>
        {hentTekst('utdanning.andreUtgifter.fakturatekst', intl)}
      </AlertStripeDokumentasjon>
      <Alert size="small" variant="info" inline>
        {hentHTMLTekst('utdanning.andreUtgifter.tekst', intl)}
      </Alert>
    </VStack>
  );
};
