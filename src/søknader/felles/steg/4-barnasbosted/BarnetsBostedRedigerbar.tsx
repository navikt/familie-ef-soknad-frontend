import React, { useState } from 'react';
import { AnnenForelderKnapper } from './AnnenForelderKnapper';
import { BostedOgSamvær } from './bostedOgSamvær/BostedOgSamvær';
import { OmAndreForelder } from './OmAndreForelder';
import { SkalBarnetBoHosSøker } from './SkalBarnetBoHosSøker';
import { IBarn } from '../../../../models/steg/barn';
import { IForelder } from '../../../../models/steg/forelder';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import {
  erForelderUtfylt,
  utfyltBorINorge,
  visSpørsmålHvisIkkeSammeForelder,
} from '../../../../helpers/steg/forelder';
import { BorForelderINorge } from './bostedOgSamvær/BorForelderINorge';
import { BorAnnenForelderISammeHus } from './ikkesammeforelder/BorAnnenForelderISammeHus';
import { BoddSammenFør } from './ikkesammeforelder/BoddSammenFør';
import { HvorMyeSammen } from './ikkesammeforelder/HvorMyeSammen';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { erGyldigDato } from '../../../../utils/dato';
import { TypeBarn } from '../../../../models/steg/barnasbosted';
import { Alert, BodyShort, Button, Heading, Label, VStack } from '@navikt/ds-react';
import styled from 'styled-components';
import {
  finnFørsteBarnTilHverForelder,
  finnTypeBarnForMedForelder,
  harValgtBorISammeHus,
  skalAnnenForelderRedigeres,
  skalBorAnnenForelderINorgeVises,
} from '../../../../helpers/steg/barnetsBostedEndre';
import { stringHarVerdiOgErIkkeTom } from '../../../../utils/typer';
import { erBarnetilsynSøknad } from '../../../../models/søknad/søknad';
import { useBarnasBosted } from './BarnasBostedContext';
import { BarneHeader } from '../../../../components/barneheader/BarneHeader';
import { førsteBokstavStor } from '../../../../utils/språk';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';

const AlertMedTopMargin = styled(Alert)`
  margin-top: 1rem;
`;

const visBostedOgSamværSeksjon = (forelder: IForelder, visesBorINorgeSpørsmål: boolean) => {
  return visesBorINorgeSpørsmål
    ? utfyltBorINorge(forelder)
    : erGyldigDato(forelder.fødselsdato?.verdi);
};

interface Props {
  barn: IBarn;
  settAktivIndex: React.Dispatch<React.SetStateAction<number>>;
  aktivIndex: number;
  scrollTilLagtTilBarn: () => void;
}

export const BarnetsBostedRedigerbar: React.FC<Props> = ({
  barn,
  settAktivIndex,
  aktivIndex,
  scrollTilLagtTilBarn,
}) => {
  const intl = useLokalIntlContext();
  const { søknad, barnISøknad, forelderIdenterMedBarn, oppdaterBarnMedNyForelderInformasjon } =
    useBarnasBosted();
  const [forelder, settForelder] = useState<IForelder>(
    barn.forelder
      ? {
          ...barn.forelder,
          kanIkkeOppgiAnnenForelderFar: {
            label: hentTekst('barnasbosted.kanikkeoppgiforelder', intl),
            verdi: barn.forelder.kanIkkeOppgiAnnenForelderFar?.verdi || false,
          },
        }
      : {
          id: hentUid(),
        }
  );

  const [kjennerIkkeIdent, settKjennerIkkeIdent] = useState<boolean>(
    stringHarVerdiOgErIkkeTom(forelder.navn?.verdi) &&
      !stringHarVerdiOgErIkkeTom(forelder.ident?.verdi)
  );

  const { boddSammenFør, flyttetFra, fødselsdato, ident } = forelder;

  const harForelderFraPdl =
    stringHarVerdiOgErIkkeTom(barn?.medforelder?.verdi?.navn) ||
    barn?.medforelder?.verdi?.harAdressesperre === true;

  const førsteBarnTilHverForelder = finnFørsteBarnTilHverForelder(barnISøknad, barn);

  const typeBarn = finnTypeBarnForMedForelder(barn, forelderIdenterMedBarn);

  const [barnHarSammeForelder, settBarnHarSammeForelder] = useState<boolean | undefined>(
    typeBarn === TypeBarn.BARN_MED_KOPIERT_FORELDERINFORMASJON ? true : undefined
  );

  const leggTilForelder = () => {
    oppdaterBarnMedNyForelderInformasjon(
      { ...barn, forelder: forelder },
      typeBarn === TypeBarn.BARN_MED_OPPRINNELIG_FORELDERINFORMASJON
    );

    const nyIndex = aktivIndex + 1;
    settAktivIndex(nyIndex);
    scrollTilLagtTilBarn();
  };

  const erBarnMedISøknad = (barn: IBarn): boolean => {
    return !erBarnetilsynSøknad(søknad) || barn.skalHaBarnepass?.verdi === true;
  };

  const finnesBarnISøknadMedRegistrertAnnenForelder = barnISøknad.some(
    (b) => erBarnMedISøknad(b) && b.medforelder?.verdi?.ident && b.medforelder?.verdi?.navn
  );

  const visAnnenForelderRedigering = skalAnnenForelderRedigeres(
    barn,
    førsteBarnTilHverForelder,
    barnHarSammeForelder,
    forelder,
    finnesBarnISøknadMedRegistrertAnnenForelder
  );

  const visBorAnnenForelderINorge = skalBorAnnenForelderINorgeVises(
    barn,
    typeBarn,
    barnHarSammeForelder,
    forelder,
    ident,
    fødselsdato,
    kjennerIkkeIdent
  );

  const skalFylleUtHarBoddSammenFør = harValgtBorISammeHus(forelder) && utfyltBorINorge(forelder);

  const skalViseAnnenForelderKnapperForGjenbruk =
    barn.erFraForrigeSøknad &&
    finnesBarnISøknadMedRegistrertAnnenForelder &&
    !barn.medforelder?.verdi &&
    !erForelderUtfylt(barn.harSammeAdresse, forelder, harForelderFraPdl);

  const skalViseAnnenForelderKnapperForNyttBarnEllerFørstegangssøknad =
    barn.erFraForrigeSøknad !== true &&
    finnesBarnISøknadMedRegistrertAnnenForelder &&
    !barn.medforelder?.verdi;

  const skalViseAnnenForelderKnapper =
    skalViseAnnenForelderKnapperForGjenbruk ||
    skalViseAnnenForelderKnapperForNyttBarnEllerFørstegangssøknad;

  return (
    <div className="barnas-bosted">
      <VStack gap={'space-64'}>
        <BarneHeader barn={barn} />

        {!barn.harSammeAdresse.verdi && (
          <SkalBarnetBoHosSøker barn={barn} forelder={forelder} settForelder={settForelder} />
        )}

        {(barn.harSammeAdresse?.verdi || harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi)) && (
          <VStack gap={'space-48'}>
            <Heading size="small" level="4">
              {førsteBokstavStor(
                hentBarnNavnEllerBarnet(barn, 'barnasbosted.element.barnet', intl)
              )}
              {hentTekst('barnasbosted.element.andreforelder', intl)}
            </Heading>
            {skalViseAnnenForelderKnapper && (
              <AnnenForelderKnapper
                barn={barn}
                forelder={forelder}
                førsteBarnTilHverForelder={førsteBarnTilHverForelder}
                settBarnHarSammeForelder={settBarnHarSammeForelder}
                settForelder={settForelder}
                typeBarn={typeBarn}
              />
            )}

            {visAnnenForelderRedigering && (
              <OmAndreForelder
                settForelder={settForelder}
                forelder={forelder}
                kjennerIkkeIdent={kjennerIkkeIdent}
                settKjennerIkkeIdent={settKjennerIkkeIdent}
              />
            )}

            {barn.medforelder?.verdi && (
              <>
                <Label as="p">{hentTekst('person.navn', intl)}</Label>
                <BodyShort>
                  {barn.medforelder.verdi.navn
                    ? barn.medforelder.verdi.navn
                    : `${hentTekst('barnekort.medforelder.hemmelig', intl)}, ${
                        barn.medforelder.verdi.alder
                      }`}
                </BodyShort>
              </>
            )}

            {barnHarSammeForelder && (
              <AlertMedTopMargin variant={'info'} inline>
                {hentTekst('barnasbosted.medforelder.gjenbrukt', intl)}
              </AlertMedTopMargin>
            )}
          </VStack>
        )}

        {visBorAnnenForelderINorge && (
          <BorForelderINorge barn={barn} forelder={forelder} settForelder={settForelder} />
        )}

        {(visBostedOgSamværSeksjon(forelder, visBorAnnenForelderINorge) ||
          barnHarSammeForelder) && (
          <BostedOgSamvær settForelder={settForelder} forelder={forelder} barn={barn} />
        )}

        {!barnHarSammeForelder && visSpørsmålHvisIkkeSammeForelder(forelder) && (
          <>
            {utfyltBorINorge(forelder) && (
              <BorAnnenForelderISammeHus
                forelder={forelder}
                settForelder={settForelder}
                barn={barn}
              />
            )}

            {skalFylleUtHarBoddSammenFør && (
              <BoddSammenFør forelder={forelder} barn={barn} settForelder={settForelder} />
            )}

            {((skalFylleUtHarBoddSammenFør && boddSammenFør?.verdi === false) ||
              (skalFylleUtHarBoddSammenFør && erGyldigDato(flyttetFra?.verdi))) && (
              <HvorMyeSammen forelder={forelder} barn={barn} settForelder={settForelder} />
            )}
          </>
        )}

        {erForelderUtfylt(barn.harSammeAdresse, forelder, harForelderFraPdl) && (
          <div>
            <Button
              variant="secondary"
              onClick={leggTilForelder}
              data-testid={'leggTilForelderKnapp'}
            >
              {hentTekst('knapp.neste', intl)}
            </Button>
          </div>
        )}
      </VStack>
    </div>
  );
};
