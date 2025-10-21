import React, { FC } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { PeriodeDatovelgere } from '../../../../components/dato/PeriodeDatovelger';
import { SlettKnapp } from '../../../../components/knapper/SlettKnapp';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { hentTittelMedNr } from '../../../../language/utils';
import { HvaSlagsBarnepassOrdningSpm } from './BarnepassConfig';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { tomPeriode } from '../../../../helpers/tommeSøknadsfelter';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import BarnepassBeløp from './BarnepassBeløp';
import { erÅrsakBarnepassSpmBesvart } from './hjelper';
import { harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { BarnepassOrdning, EBarnepass, ETypeBarnepassOrdning } from '../../models/barnepass';
import { EPeriode } from '../../../../models/felles/periode';
import { erPeriodeGyldigOgInnenforBegrensning } from '../../../../utils/gyldigeDatoerUtils';
import { Heading, TextField, VStack } from '@navikt/ds-react';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { TittelOgSlettKnapp } from '../../../../components/knapper/TittelOgSlettKnapp';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';

interface Props {
  barn: IBarn;
  barnepassOrdning: BarnepassOrdning;
  settBarnepassOrdning: (barnepassOrdning: BarnepassOrdning) => void;
  fjernBarnepassOrdning: (barnepassordning: BarnepassOrdning) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
  barnIndeks: number;
}

const BarnepassSpørsmål: FC<Props> = ({
  barn,
  settBarnepassOrdning,
  fjernBarnepassOrdning,
  barnepassOrdning,
  settDokumentasjonsbehovForBarn,
  barnIndeks,
}) => {
  const intl = useLokalIntlContext();
  const { hvaSlagsBarnepassOrdning, periode } = barnepassOrdning;

  const navnLabel =
    barnepassOrdning.hvaSlagsBarnepassOrdning?.svarid === ETypeBarnepassOrdning.barnehageOgLiknende
      ? hentTekst('barnehageOgLiknende.label.navnPåBarnepass', intl)
      : hentBarnNavnEllerBarnet(barn, 'privat.label.navnPåBarnepass', intl);
  const spørsmålTekstBarnepassOrdning = hentBarnNavnEllerBarnet(
    barn,
    HvaSlagsBarnepassOrdningSpm(intl).tekstid,
    intl
  );
  const periodeTekst = hentBarnNavnEllerBarnet(
    barn,
    'barnepass.datovelger.periodePåBarnepass',
    intl
  );
  const barnepassordningNummer = barn.barnepass?.barnepassordninger.findIndex(
    (barnepassordning) => barnepassordning.id === barnepassOrdning.id
  );
  const skalViseSlettKnapp =
    barn?.barnepass?.barnepassordninger !== undefined &&
    barn?.barnepass?.barnepassordninger?.length > 1;

  const barnepassordningTittel =
    barnepassordningNummer !== undefined &&
    hentTittelMedNr(
      barn.barnepass?.barnepassordninger ?? [],
      barnepassordningNummer,
      hentTekst('barnepass.tittel.ordning', intl)
    );

  const settSpørsmålFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
    settBarnepassOrdning({
      ...barnepassOrdning,
      hvaSlagsBarnepassOrdning: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentBarnNavnEllerBarnet(barn, spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
      periode: undefined,
      navn: undefined,
      belop: undefined,
    });
    settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id, barnepassOrdning.id);
  };

  const settInputFelt = (e: React.FormEvent<HTMLInputElement>, nøkkel: string, label: string) => {
    settBarnepassOrdning({
      ...barnepassOrdning,
      [nøkkel]: { label: label, verdi: e.currentTarget.value },
    });
  };

  const settPeriode = (objektnøkkel: EPeriode, dato?: string) => {
    const periode = barnepassOrdning.periode ? barnepassOrdning.periode : tomPeriode;

    const datovelgerTekst =
      objektnøkkel === EPeriode.fra
        ? hentTekst('periode.startdato', intl)
        : hentTekst('periode.sluttdato', intl);

    dato !== null &&
      settBarnepassOrdning({
        ...barnepassOrdning,
        periode: {
          ...periode,
          label: periodeTekst,
          [objektnøkkel]: {
            label: datovelgerTekst,
            verdi: dato,
          },
        },
      });
  };

  return (
    <VStack gap={'12'}>
      <VStack>
        <TittelOgSlettKnapp justify="space-between" align="center">
          <Heading size="small" className="tittel">
            {barnepassordningTittel}
          </Heading>
          {skalViseSlettKnapp && (
            <SlettKnapp
              onClick={() => fjernBarnepassOrdning(barnepassOrdning)}
              tekstid={'barnepass.knapp.slett'}
            />
          )}
        </TittelOgSlettKnapp>
        {erÅrsakBarnepassSpmBesvart(barn) && (
          <MultiSvarSpørsmålMedNavn
            spørsmål={HvaSlagsBarnepassOrdningSpm(intl)}
            spørsmålTekst={spørsmålTekstBarnepassOrdning}
            settSpørsmålOgSvar={settSpørsmålFelt}
            valgtSvar={hvaSlagsBarnepassOrdning?.verdi}
          />
        )}{' '}
      </VStack>
      {hvaSlagsBarnepassOrdning?.verdi && (
        <TextField
          key={EBarnepass.navn}
          label={navnLabel}
          type={'text'}
          onChange={(e) => settInputFelt(e, EBarnepass.navn, navnLabel)}
          value={barnepassOrdning?.navn ? barnepassOrdning?.navn.verdi : ''}
          data-testid={`navnPåBarnepassordningen-${barnIndeks}`}
        />
      )}
      {harValgtSvar(barnepassOrdning?.navn?.verdi) && (
        <PeriodeDatovelgere
          tekst={periodeTekst}
          hjelpetekst={{
            headerTekstid: '',
            innholdTekstid: 'barnepass.hjelpetekst.periodePåBarnepass',
          }}
          fomTekstid={'periode.startdato'}
          tomTekstid={'periode.sluttdato'}
          periode={barnepassOrdning.periode ? barnepassOrdning.periode : tomPeriode}
          gyldigeDatoer={GyldigeDatoer.Alle}
          settDato={settPeriode}
          testIndeks={barnIndeks}
        />
      )}
      {periode && erPeriodeGyldigOgInnenforBegrensning(periode, GyldigeDatoer.Alle) && (
        <BarnepassBeløp
          barnepassOrdning={barnepassOrdning}
          settInputFelt={settInputFelt}
          barnIndeks={barnIndeks}
        />
      )}
    </VStack>
  );
};

export default BarnepassSpørsmål;
