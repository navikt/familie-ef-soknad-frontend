import React, { useEffect, useState } from 'react';
import {
  Datovelger,
  DatoBegrensning,
} from '../../../../components/dato/Datovelger';
import InputLabelGruppe from '../../../../components/gruppe/InputLabelGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { EFirma, IFirma } from '../../../../models/steg/aktivitet/firma';
import { hentTekst } from '../../../../utils/søknad';
import { hentTittelMedNr } from '../../../../language/utils';
import { SlettKnapp } from '../../../../components/knapper/SlettKnapp';
import styled from 'styled-components';
import LocaleTekst from '../../../../language/LocaleTekst';
import { erStrengGyldigOrganisasjonsnummer } from '../../../../utils/autentiseringogvalidering/feltvalidering';
import { erDatoGyldigOgInnaforBegrensninger } from '../../../../components/dato/utils';
import { TittelOgSlettKnapp } from '../../../../components/knapper/TittelOgSlettKnapp';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { ErrorMessage, Heading, Label, Textarea } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';
import { hentBeskjedMedNavn } from '../../../../utils/språk';
import LesMerTekst from '../../../../components/LesMerTekst';

const StyledFirma = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  firmaer: IFirma[];
  firmanr: number;
  settFirmaer: (firmaer: IFirma[]) => void;
  inkludertArbeidsmengde?: boolean;
  overskuddsår: number;
}

const OmFirmaetDitt: React.FC<Props> = ({
  firmaer,
  firmanr,
  settFirmaer,
  inkludertArbeidsmengde = true,
  overskuddsår,
}) => {
  const intl = useLokalIntlContext();
  const firmaFraSøknad = firmaer?.find((firma, index) => index === firmanr);

  const [firma, settFirma] = useState<IFirma>(firmaFraSøknad!);
  const [organisasjonsnummer, settOrganisasjonsnr] = useState<string>(
    firma.organisasjonsnummer?.verdi ? firma.organisasjonsnummer.verdi : ''
  );

  useEffect(() => {
    const endredeFirmaer = firmaer?.map((firmaFraSøknad, index) => {
      return index === firmanr ? firma : firmaFraSøknad;
    });

    settFirmaer(endredeFirmaer);
    // eslint-disable-next-line
  }, [firma]);

  const settDatoFelt = (dato: string): void => {
    dato !== null &&
      settFirma({
        ...firma,
        etableringsdato: {
          label: hentTekst('firma.datovelger.etablering', intl),
          verdi: dato,
        },
      });
  };

  const settArbeidsukeTekst = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    settFirma({
      ...firma,
      arbeidsuke: {
        label: hentTekst('firma.label.arbeidsuke', intl),
        verdi: e.target.value,
      },
    });
  };

  const settInputTekstFelt = (
    e: React.FormEvent<HTMLInputElement>,
    nøkkel: EFirma,
    label: string
  ) => {
    settFirma({
      ...firma,
      [nøkkel]: { label: label, verdi: e.currentTarget.value },
    });
  };

  const fjernFirma = () => {
    if (firmaer && firmaer.length > 1) {
      const oppdaterteFirmaer = firmaer?.filter(
        (arbeidsgiver, index) => index !== firmanr
      );
      settFirmaer(oppdaterteFirmaer);
    }
  };

  const labelArbeidsmengde = hentTekst('firma.label.arbeidsmengde', intl);
  const labelArbeidsuke = hentTekst('firma.label.arbeidsuke', intl);
  const labelOverskudd = hentBeskjedMedNavn(
    `${overskuddsår}`,
    hentTekst('firma.label.overskudd', intl)
  );
  const labelOrganisasjonsnr = hentTekst('firma.label.organisasjonnr', intl);
  const labelNavn = hentTekst('firma.label.navn', intl);
  const firmaTittel = hentTittelMedNr(
    firmaer!,
    firmanr,
    intl.formatMessage({ id: 'firma.tittel' })
  );
  const harValgtUgyldigOrganisasjonsnummer =
    organisasjonsnummer !== '' &&
    firma?.organisasjonsnummer?.verdi &&
    !erStrengGyldigOrganisasjonsnummer(firma?.organisasjonsnummer?.verdi);

  const skalViseSlettKnapp = firmaer?.length > 1;

  return (
    <StyledFirma aria-live="polite">
      <TittelOgSlettKnapp justify="space-between" align="center">
        <Heading size="small" level="4" className={'tittel'}>
          {firmaTittel}
        </Heading>
        {skalViseSlettKnapp && (
          <SlettKnapp
            onClick={() => fjernFirma()}
            tekstid={'firma.knapp.slett'}
          />
        )}
      </TittelOgSlettKnapp>
      <FeltGruppe>
        <TextFieldMedBredde
          label={labelNavn}
          bredde={'L'}
          type={'text'}
          onChange={(e) => settInputTekstFelt(e, EFirma.navn, labelNavn)}
          value={firma?.navn ? firma?.navn.verdi : ''}
        />
      </FeltGruppe>

      {firma.navn?.verdi && (
        <>
          <FeltGruppe>
            <TextFieldMedBredde
              label={labelOrganisasjonsnr}
              bredde={'XS'}
              type={'text'}
              onChange={(e) => settOrganisasjonsnr(e.target.value)}
              onBlur={(e) =>
                settInputTekstFelt(
                  e,
                  EFirma.organisasjonsnummer,
                  labelOrganisasjonsnr
                )
              }
              value={organisasjonsnummer ? organisasjonsnummer : ''}
              error={harValgtUgyldigOrganisasjonsnummer}
            />
          </FeltGruppe>
          {harValgtUgyldigOrganisasjonsnummer && (
            <FeltGruppe>
              <ErrorMessage>
                <LocaleTekst tekst={'firma.feilmelding.organisasjonnr'} />
              </ErrorMessage>
            </FeltGruppe>
          )}
        </>
      )}

      {erStrengGyldigOrganisasjonsnummer(firma.organisasjonsnummer?.verdi) && (
        <FeltGruppe>
          <Datovelger
            valgtDato={firma?.etableringsdato?.verdi}
            tekstid={'firma.datovelger.etablering'}
            datobegrensning={DatoBegrensning.TidligereDatoer}
            settDato={(e) => settDatoFelt(e)}
          />
        </FeltGruppe>
      )}

      {firma.etableringsdato?.verdi &&
        erDatoGyldigOgInnaforBegrensninger(
          firma.etableringsdato?.verdi,
          DatoBegrensning.TidligereDatoer
        ) &&
        inkludertArbeidsmengde && (
          <FeltGruppe>
            <InputLabelGruppe
              label={labelArbeidsmengde}
              nøkkel={labelArbeidsmengde}
              type={'number'}
              bredde={'XXS'}
              settInputFelt={(e) =>
                settInputTekstFelt(e, EFirma.arbeidsmengde, labelArbeidsmengde)
              }
              beskrivendeTekst={'%'}
              value={
                firma?.arbeidsmengde?.verdi ? firma?.arbeidsmengde?.verdi : ''
              }
            />
          </FeltGruppe>
        )}

      {(firma.arbeidsmengde?.verdi ||
        (!inkludertArbeidsmengde && firma.etableringsdato?.verdi)) && (
        <>
          <FeltGruppe>
            <Label as={'label'} htmlFor={labelArbeidsuke}>
              {labelArbeidsuke}
            </Label>
            <LesMerTekst
              åpneTekstid={''}
              innholdTekstid={'firma.lesmer-innhold.arbeidsuke'}
            />
            <Textarea
              autoComplete={'off'}
              key={labelArbeidsuke}
              label={labelArbeidsuke}
              hideLabel={true}
              value={firma.arbeidsuke?.verdi ? firma.arbeidsuke?.verdi : ''}
              maxLength={1000}
              onChange={(e) => settArbeidsukeTekst(e)}
            />
          </FeltGruppe>
          <FeltGruppe>
            <InputLabelGruppe
              hjelpetekst={{
                headerTekstid: '',
                innholdTekstid: 'firma.lesmer-innhold.overskudd',
              }}
              label={labelOverskudd}
              nøkkel={labelOverskudd}
              type={'number'}
              bredde={'XS'}
              settInputFelt={(e) =>
                settInputTekstFelt(e, EFirma.overskudd, labelOverskudd)
              }
              beskrivendeTekst={'kroner'}
              value={firma?.overskudd?.verdi ? firma?.overskudd?.verdi : ''}
            />
          </FeltGruppe>
        </>
      )}
    </StyledFirma>
  );
};

export default OmFirmaetDitt;
