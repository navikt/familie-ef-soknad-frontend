import React, { useEffect, useState } from 'react';
import { SlettKnapp } from '../../../../components/knapper/SlettKnapp';
import { hentTittelMedNr } from '../../../../language/utils';
import styled from 'styled-components';
import { hvaSlagsStilling } from './ArbeidsgiverConfig';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import HarSøkerSluttdato from './HarSøkerSluttdato';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import InputLabelGruppe from '../../../../components/gruppe/InputLabelGruppe';
import { hentTekst } from '../../../../utils/søknad';
import {
  EArbeidsgiver,
  EStilling,
  IArbeidsgiver,
} from '../../../../models/steg/aktivitet/arbeidsgiver';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Heading } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';
import { TittelOgSlettKnapp } from '../../../../components/knapper/TittelOgSlettKnapp';

const StyledArbeidsgiver = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  arbeidsforhold: IArbeidsgiver[];
  settArbeidsforhold: (arbeidsforhold: IArbeidsgiver[]) => void;
  arbeidsgivernummer: number;
  inkludertArbeidsmengde: boolean;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
}

const Arbeidsgiver: React.FC<Props> = ({
  arbeidsforhold,
  settArbeidsforhold,
  arbeidsgivernummer,
  settDokumentasjonsbehov,
  inkludertArbeidsmengde,
}) => {
  const intl = useLokalIntlContext();
  const arbeidsgiverFraSøknad = arbeidsforhold?.find(
    (arbeidsgiver, index) => index === arbeidsgivernummer && arbeidsgiver
  );
  const [arbeidsgiver, settArbeidsgiver] = useState<IArbeidsgiver>(
    arbeidsgiverFraSøknad!
  );

  useEffect(() => {
    const endretArbeidsforhold = arbeidsforhold?.map(
      (arbeidsgiverFraSøknad, index) => {
        if (index === arbeidsgivernummer) return arbeidsgiver;
        else return arbeidsgiverFraSøknad;
      }
    );
    endretArbeidsforhold && settArbeidsforhold(endretArbeidsforhold);
    // eslint-disable-next-line
  }, [arbeidsgiver]);

  const settSpørsmålOgSvar = (spørsmål: ISpørsmål, svar: ISvar) => {
    if (
      spørsmål.søknadid === EArbeidsgiver.ansettelsesforhold &&
      svar.id === EStilling.fast &&
      arbeidsgiver.harSluttDato
    ) {
      delete arbeidsgiver.harSluttDato;
      delete arbeidsgiver.sluttdato;
    }

    arbeidsgiver &&
      settArbeidsgiver({
        ...arbeidsgiver,
        [spørsmål.søknadid]: {
          spørsmålid: spørsmål.søknadid,
          svarid: svar.id,
          label: hentTekst(spørsmål.tekstid, intl),
          verdi: svar.svar_tekst,
        },
      });
    settDokumentasjonsbehov(spørsmål, svar);
  };

  const fjernArbeidsgiver = () => {
    if (arbeidsforhold && arbeidsforhold.length > 1) {
      const endretArbeidsforhold = arbeidsforhold?.filter(
        (arbeidsgiver, index) => index !== arbeidsgivernummer
      );
      settArbeidsforhold(endretArbeidsforhold);
    }
  };

  const settTekstInputFelt = (
    e: React.FormEvent<HTMLInputElement>,
    nøkkel: EArbeidsgiver,
    label: string
  ) => {
    if (!e.currentTarget.value) {
      delete arbeidsgiver.ansettelsesforhold;
    }

    arbeidsgiver &&
      settArbeidsgiver({
        ...arbeidsgiver,
        [nøkkel]: { label: label, verdi: e.currentTarget.value },
      });
  };

  const arbeidsgiverTittel = hentTittelMedNr(
    arbeidsforhold!,
    arbeidsgivernummer,
    intl.formatMessage({ id: 'arbeidsforhold.tittel.arbeidsgiver' })
  );
  const navnLabel: string = hentTekst('arbeidsforhold.label.navn', intl);
  const arbeidsmengdeLabel: string = hentTekst(
    'arbeidsforhold.label.arbeidsmengde',
    intl
  );

  const skalViseSlettKnapp = arbeidsforhold?.length > 1;

  return (
    <StyledArbeidsgiver aria-live="polite">
      <TittelOgSlettKnapp justify="space-between" align="center">
        <Heading size="small" level="4" className={'tittel'}>
          {arbeidsgiverTittel}
        </Heading>
        {skalViseSlettKnapp && (
          <SlettKnapp
            onClick={() => fjernArbeidsgiver()}
            tekstid={'arbeidsforhold.knapp.slettArbeidsgiver'}
          />
        )}
      </TittelOgSlettKnapp>
      <FeltGruppe>
        <TextFieldMedBredde
          key={navnLabel}
          label={navnLabel}
          type="text"
          bredde={'L'}
          value={arbeidsgiver?.navn ? arbeidsgiver.navn.verdi : ''}
          onChange={(e) => settTekstInputFelt(e, EArbeidsgiver.navn, navnLabel)}
        />
      </FeltGruppe>
      {arbeidsgiver.navn?.verdi && inkludertArbeidsmengde && (
        <FeltGruppe>
          <InputLabelGruppe
            label={arbeidsmengdeLabel}
            nøkkel={EArbeidsgiver.arbeidsmengde}
            utvidetTekstNøkkel={
              'arbeidsforhold.label.arbeidsmengde.beskrivelse'
            }
            type={'number'}
            bredde={'XXS'}
            settInputFelt={(e) =>
              settTekstInputFelt(
                e,
                EArbeidsgiver.arbeidsmengde,
                arbeidsmengdeLabel
              )
            }
            value={
              arbeidsgiver?.arbeidsmengde?.verdi
                ? arbeidsgiver?.arbeidsmengde?.verdi
                : ''
            }
            beskrivendeTekst={'%'}
          />
        </FeltGruppe>
      )}
      {(arbeidsgiver.arbeidsmengde?.verdi ||
        (arbeidsgiver.navn?.verdi && !inkludertArbeidsmengde)) && (
        <FeltGruppe>
          <MultiSvarSpørsmål
            spørsmål={hvaSlagsStilling(intl)}
            settSpørsmålOgSvar={settSpørsmålOgSvar}
            valgtSvar={arbeidsgiver.ansettelsesforhold?.verdi}
          />
        </FeltGruppe>
      )}

      {arbeidsgiver.ansettelsesforhold?.svarid === EStilling.lærling && (
        <FeltGruppe>
          <AlertStripeDokumentasjon>
            {hentTekst('arbeidsforhold.alert.lærling', intl)}
          </AlertStripeDokumentasjon>
        </FeltGruppe>
      )}
      {arbeidsgiver.ansettelsesforhold?.svarid === EStilling.midlertidig && (
        <HarSøkerSluttdato
          arbeidsgiver={arbeidsgiver}
          settArbeidsgiver={settArbeidsgiver}
        />
      )}
    </StyledArbeidsgiver>
  );
};

export default Arbeidsgiver;
