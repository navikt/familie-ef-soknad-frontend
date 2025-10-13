import React from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import InputLabelGruppe from '../../../../../components/gruppe/InputLabelGruppe';
import { EUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentHTMLTekst, hentTekst } from '../../../../../utils/teksthåndtering';
import { DetaljertUtdanning } from '../../../../skolepenger/models/detaljertUtdanning';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, Heading } from '@navikt/ds-react';
import { AlertStripeDokumentasjon } from '../../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

interface Props {
  utdanning: DetaljertUtdanning;
  oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
}

const StyledUndertittel = styled(Heading)`
  padding-bottom: 2rem;
`;

const Studiekostnader: React.FC<Props> = ({ utdanning, oppdaterUtdanning }) => {
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
    <KomponentGruppe>
      <StyledUndertittel size="small">
        {hentTekst('utdanning.label.utgifter', intl)}
      </StyledUndertittel>
      <FeltGruppe>
        <InputLabelGruppe
          label={semesteravgiftLabel}
          nøkkel={EUtdanning.semesteravgift}
          type={'number'}
          bredde={'XXS'}
          settInputFelt={(e) => settInputFelt(EUtdanning.semesteravgift, semesteravgiftLabel, e)}
          beskrivendeTekst={'kroner'}
          value={utdanning?.semesteravgift?.verdi ? utdanning?.semesteravgift?.verdi : ''}
        />
      </FeltGruppe>
      <FeltGruppe>
        <InputLabelGruppe
          label={studieavgiftLabel}
          nøkkel={EUtdanning.studieavgift}
          type={'number'}
          bredde={'XXS'}
          settInputFelt={(e) => settInputFelt(EUtdanning.studieavgift, studieavgiftLabel, e)}
          beskrivendeTekst={'kroner'}
          value={utdanning?.studieavgift?.verdi ? utdanning?.studieavgift?.verdi : ''}
        />
      </FeltGruppe>
      <FeltGruppe>
        <InputLabelGruppe
          label={eksamensgebyrLabel}
          nøkkel={EUtdanning.eksamensgebyr}
          type={'number'}
          bredde={'XXS'}
          settInputFelt={(e) => settInputFelt(EUtdanning.eksamensgebyr, eksamensgebyrLabel, e)}
          beskrivendeTekst={'kroner'}
          value={utdanning?.eksamensgebyr?.verdi ? utdanning?.eksamensgebyr?.verdi : ''}
        />
      </FeltGruppe>
      <FeltGruppe>
        <AlertStripeDokumentasjon>
          {hentTekst('utdanning.andreUtgifter.fakturatekst', intl)}
        </AlertStripeDokumentasjon>
      </FeltGruppe>
      <FeltGruppe>
        <Alert size="small" variant="info" inline>
          {hentHTMLTekst('utdanning.andreUtgifter.tekst', intl)}
        </Alert>
      </FeltGruppe>
    </KomponentGruppe>
  );
};

export default Studiekostnader;
