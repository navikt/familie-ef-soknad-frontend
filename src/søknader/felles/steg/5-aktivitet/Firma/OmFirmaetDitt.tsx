import React, { useEffect, useState } from 'react';
import { Datovelger } from '../../../../../components/dato/Datovelger';
import InputLabelGruppe from '../../../../../components/gruppe/InputLabelGruppe';
import { EFirma, IFirma } from '../../../../../models/steg/aktivitet/firma';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../../utils/teksthåndtering';
import { hentTittelMedNr } from '../../../../../language/utils';
import { SlettKnapp } from '../../../../../components/knapper/SlettKnapp';
import { erStrengGyldigOrganisasjonsnummer } from '../../../../../utils/autentiseringogvalidering/feltvalidering';
import { erDatoGyldigOgInnenforBegrensning } from '../../../../../utils/gyldigeDatoerUtils';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { ErrorMessage, Heading, HStack, Label, Textarea, VStack } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../../components/TextFieldMedBredde';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import { LesMerTekst } from '../../../../../components/lesmertekst/LesMerTekst';

interface Props {
  firmaer: IFirma[];
  firmanr: number;
  settFirmaer: (firmaer: IFirma[]) => void;
  inkludertArbeidsmengde?: boolean;
  overskuddsår: number;
}

export const OmFirmaetDitt: React.FC<Props> = ({
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

  const settArbeidsukeTekst = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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
      const oppdaterteFirmaer = firmaer?.filter((arbeidsgiver, index) => index !== firmanr);
      settFirmaer(oppdaterteFirmaer);
    }
  };

  const labelArbeidsmengde = hentTekst('firma.label.arbeidsmengde', intl);
  const labelArbeidsuke = hentTekst('firma.label.arbeidsuke', intl);
  const labelOverskudd = hentTekstMedEnVariabel('firma.label.overskudd', intl, `${overskuddsår}`);
  const labelOrganisasjonsnr = hentTekst('firma.label.organisasjonnr', intl);
  const labelNavn = hentTekst('firma.label.navn', intl);
  const firmaTittel = hentTittelMedNr(firmaer!, firmanr, hentTekst('firma.tittel', intl));
  const harValgtUgyldigOrganisasjonsnummer =
    organisasjonsnummer !== '' &&
    firma?.organisasjonsnummer?.verdi &&
    !erStrengGyldigOrganisasjonsnummer(firma?.organisasjonsnummer?.verdi);

  const skalViseSlettKnapp = firmaer?.length > 1;

  return (
    <>
      <HStack justify="space-between" align="center">
        <Heading size="small" level="4" className={'tittel'}>
          {firmaTittel}
        </Heading>
        {skalViseSlettKnapp && (
          <SlettKnapp onClick={() => fjernFirma()} tekstid={'firma.knapp.slett'} />
        )}
      </HStack>
      <VStack gap={'16'}>
        <TextFieldMedBredde
          label={labelNavn}
          bredde={'L'}
          type={'text'}
          onChange={(e) => settInputTekstFelt(e, EFirma.navn, labelNavn)}
          value={firma?.navn ? firma?.navn.verdi : ''}
        />

        {firma.navn?.verdi && (
          <>
            <TextFieldMedBredde
              label={labelOrganisasjonsnr}
              bredde={'XS'}
              type={'text'}
              onChange={(e) => settOrganisasjonsnr(e.target.value)}
              onBlur={(e) =>
                settInputTekstFelt(e, EFirma.organisasjonsnummer, labelOrganisasjonsnr)
              }
              value={organisasjonsnummer ? organisasjonsnummer : ''}
              error={harValgtUgyldigOrganisasjonsnummer}
            />
            {harValgtUgyldigOrganisasjonsnummer && (
              <ErrorMessage>{hentTekst('firma.feilmelding.organisasjonnr', intl)}</ErrorMessage>
            )}
          </>
        )}

        {erStrengGyldigOrganisasjonsnummer(firma.organisasjonsnummer?.verdi) && (
          <Datovelger
            valgtDato={firma?.etableringsdato?.verdi}
            tekstid={'firma.datovelger.etablering'}
            gyldigeDatoer={GyldigeDatoer.Tidligere}
            settDato={(e) => settDatoFelt(e)}
          />
        )}

        {firma.etableringsdato?.verdi &&
          erDatoGyldigOgInnenforBegrensning(
            firma.etableringsdato?.verdi,
            GyldigeDatoer.Tidligere
          ) &&
          inkludertArbeidsmengde && (
            <InputLabelGruppe
              label={labelArbeidsmengde}
              nøkkel={labelArbeidsmengde}
              type={'number'}
              bredde={'XXS'}
              settInputFelt={(e) => settInputTekstFelt(e, EFirma.arbeidsmengde, labelArbeidsmengde)}
              beskrivendeTekst={'%'}
              value={firma?.arbeidsmengde?.verdi ? firma?.arbeidsmengde?.verdi : ''}
            />
          )}

        {(firma.arbeidsmengde?.verdi ||
          (!inkludertArbeidsmengde && firma.etableringsdato?.verdi)) && (
          <>
            <VStack>
              <Label as={'label'} htmlFor={labelArbeidsuke}>
                {labelArbeidsuke}
              </Label>
              <LesMerTekst åpneTekstid={''} innholdTekstid={'firma.lesmer-innhold.arbeidsuke'} />
              <Textarea
                autoComplete={'off'}
                key={labelArbeidsuke}
                label={labelArbeidsuke}
                hideLabel={true}
                value={firma.arbeidsuke?.verdi ? firma.arbeidsuke?.verdi : ''}
                maxLength={1000}
                onChange={(e) => settArbeidsukeTekst(e)}
              />
            </VStack>
            <InputLabelGruppe
              hjelpetekst={{
                headerTekstid: '',
                innholdTekstid: 'firma.lesmer-innhold.overskudd',
              }}
              label={labelOverskudd}
              nøkkel={labelOverskudd}
              type={'number'}
              bredde={'XS'}
              settInputFelt={(e) => settInputTekstFelt(e, EFirma.overskudd, labelOverskudd)}
              beskrivendeTekst={'kroner'}
              value={firma?.overskudd?.verdi ? firma?.overskudd?.verdi : ''}
            />
          </>
        )}
      </VStack>
    </>
  );
};
