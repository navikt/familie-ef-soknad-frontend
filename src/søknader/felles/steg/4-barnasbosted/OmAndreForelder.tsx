import React, { useEffect, useState } from 'react';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import { EHvorforIkkeOppgi } from '../../../../models/steg/barnasbosted';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { hvorforIkkeOppgi } from './ForeldreConfig';
import { IForelder } from '../../../../models/steg/forelder';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IdentEllerFødselsdatoGruppe } from '../../../../components/gruppe/IdentEllerFødselsdatoGruppe';
import { Checkbox, ErrorMessage, Textarea, VStack } from '@navikt/ds-react';
import {
  erIkkeOppgittPgaAnnet,
  slettIrrelevantPropertiesHvisHuketAvKanIkkeOppgiAnnenForelder,
} from '../../../../helpers/steg/forelder';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';
import { identErGyldig } from '../../../../utils/validering/validering';
import { useBarnasBosted } from './BarnasBostedContext';

interface Props {
  settForelder: (verdi: IForelder) => void;
  forelder: IForelder;
  kjennerIkkeIdent: boolean;
  settKjennerIkkeIdent: (kjennerIkkeIdent: boolean) => void;
}

export const OmAndreForelder: React.FC<Props> = ({
  settForelder,
  forelder,
  kjennerIkkeIdent,
  settKjennerIkkeIdent,
}) => {
  const intl = useLokalIntlContext();
  const { settSisteBarnUtfylt } = useBarnasBosted();
  const { fødselsdato, ident } = forelder;
  const [feilmeldingNavn, settFeilmeldingNavn] = useState<boolean>(false);
  const hvorforIkkeOppgiLabel = hentTekst(hvorforIkkeOppgi(intl).tekstid, intl);
  const jegKanIkkeOppgiLabel = hentTekst('barnasbosted.kanikkeoppgiforelder', intl);
  const [erGyldigIdent, settGyldigIdent] = useState<boolean>(!!forelder?.ident?.verdi);
  const [identFelt, settIdentFelt] = useState<string>(ident?.verdi ? ident.verdi : '');

  useEffect(() => {
    erGyldigIdent &&
      settForelder({
        ...forelder,
        ident: { label: hentTekst('person.ident', intl), verdi: identFelt },
      });

    if (!erGyldigIdent) {
      const nyForelder = { ...forelder };

      delete nyForelder.ident;

      settForelder(nyForelder);
    }

  }, [erGyldigIdent, identFelt]);

  const hvisGyldigIdentSettIdent = (ident: string) => {
    settGyldigIdent(identErGyldig(ident));
    settIdentFelt(ident);
  };

  const settChecked = (checked: boolean) => {
    const endretForelder = forelder;
    if (checked) {
      delete endretForelder.ident;
      settIdentFelt('');
    }
    if (!checked && fødselsdato) {
      delete endretForelder.fødselsdato;
    }

    settForelder(endretForelder);
    settKjennerIkkeIdent(checked);
  };

  const settFødselsdato = (dato: string) => {
    dato !== null &&
      settForelder({
        ...forelder,
        fødselsdato: {
          label: hentTekst('datovelger.fødselsdato', intl),
          verdi: dato,
        },
      });
  };

  const hukAvKanIkkeOppgiAnnenForelder = (avhuket: boolean) => {
    const nyForelder = { ...forelder };

    if (avhuket) {
      slettIrrelevantPropertiesHvisHuketAvKanIkkeOppgiAnnenForelder(nyForelder);
      settFeilmeldingNavn(false);
    } else {
      delete nyForelder.ikkeOppgittAnnenForelderBegrunnelse;
      delete nyForelder.hvorforIkkeOppgi;
      delete nyForelder.kanIkkeOppgiAnnenForelderFar;
      nyForelder.id = hentUid();
      settFeilmeldingNavn(true);
    }

    settForelder({
      ...nyForelder,
      kanIkkeOppgiAnnenForelderFar: {
        label: jegKanIkkeOppgiLabel,
        verdi: !forelder.kanIkkeOppgiAnnenForelderFar?.verdi,
      },
    });
  };

  const settHvorforIkkeOppgi = (spørsmål: ISpørsmål, svar: ISvar) => {
    const verdi = svar.id === EHvorforIkkeOppgi.donorbarn ? 'Donor' : '';

    const nyForelder = {
      ...forelder,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
      ikkeOppgittAnnenForelderBegrunnelse: {
        label: hentTekst('barnasbosted.spm.hvorforikkeoppgi', intl),
        verdi: verdi,
      },
    };

    settForelder(nyForelder);
  };

  const settIkkeOppgittAnnenForelderBegrunnelse = (begrunnelse: string) => {
    settForelder({
      ...forelder,
      ikkeOppgittAnnenForelderBegrunnelse: {
        label: hentTekst('barnasbosted.spm.hvorforikkeoppgi', intl),
        verdi: begrunnelse,
      },
    });
  };

  return (
    <VStack gap={'space-48'}>
      <VStack gap={'space-16'}>
        <TextFieldMedBredde
          bredde={'L'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            settForelder({
              ...forelder,
              navn: {
                label: hentTekst('person.navn', intl),
                verdi: e.target.value,
              },
            });
            e.target.value === '' && settSisteBarnUtfylt(false);
          }}
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target.value === '' ? settFeilmeldingNavn(true) : settFeilmeldingNavn(false)
          }
          value={forelder.navn ? forelder.navn?.verdi : ''}
          label={hentTekst('person.navn', intl)}
          disabled={forelder.kanIkkeOppgiAnnenForelderFar?.verdi}
        />
        {feilmeldingNavn && (
          <ErrorMessage className={'skjemaelement__feilmelding'}>
            {hentTekst('person.feilmelding.navn', intl)}
          </ErrorMessage>
        )}
        <Checkbox
          checked={
            forelder.kanIkkeOppgiAnnenForelderFar?.verdi
              ? forelder.kanIkkeOppgiAnnenForelderFar?.verdi
              : false
          }
          onChange={(e) => hukAvKanIkkeOppgiAnnenForelder(e.target.checked)}
        >
          {hentTekst('barnasbosted.kanikkeoppgiforelder', intl)}
        </Checkbox>
      </VStack>
      {forelder.navn && !forelder.kanIkkeOppgiAnnenForelderFar?.verdi && (
        <IdentEllerFødselsdatoGruppe
          identLabel={hentTekst('person.ident', intl)}
          datoLabelId={'person.fødselsdato'}
          checkboxLabel={hentTekst('person.checkbox.ident', intl)}
          ident={identFelt && !kjennerIkkeIdent ? identFelt : ''}
          fødselsdato={forelder?.fødselsdato?.verdi || ''}
          checked={kjennerIkkeIdent}
          erGyldigIdent={erGyldigIdent}
          settIdent={hvisGyldigIdentSettIdent}
          settFødselsdato={settFødselsdato}
          settChecked={settChecked}
        />
      )}
      {forelder.kanIkkeOppgiAnnenForelderFar?.verdi && (
        <MultiSvarSpørsmål
          spørsmål={hvorforIkkeOppgi(intl)}
          settSpørsmålOgSvar={settHvorforIkkeOppgi}
          valgtSvar={
            forelder.hvorforIkkeOppgi?.svarid === EHvorforIkkeOppgi.annet
              ? hentTekst('barnasbosted.spm.annet', intl)
              : forelder.hvorforIkkeOppgi?.verdi
          }
        />
      )}
      {erIkkeOppgittPgaAnnet(forelder) && (
        <Textarea
          autoComplete={'off'}
          value={forelder.ikkeOppgittAnnenForelderBegrunnelse?.verdi}
          onChange={(e) => settIkkeOppgittAnnenForelderBegrunnelse(e.target.value)}
          label={hvorforIkkeOppgiLabel}
        />
      )}
    </VStack>
  );
};
