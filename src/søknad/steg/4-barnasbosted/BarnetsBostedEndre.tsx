import React, { useEffect, useState } from 'react';
import AnnenForelderKnapper from './AnnenForelderKnapper';
import BarneHeader from '../../../components/BarneHeader';
import BostedOgSamvær from './bostedOgSamvær/BostedOgSamvær';
import OmAndreForelder from './OmAndreForelder';
import SkalBarnetBoHosSøker from './SkalBarnetBoHosSøker';
import { IBarn } from '../../../models/steg/barn';
import { IForelder } from '../../../models/steg/forelder';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { harValgtSvar } from '../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../utils/søknad';
import {
  erForelderUtfylt,
  utfyltNødvendigSpørsmålUtenOppgiAnnenForelder,
  visSpørsmålHvisIkkeSammeForelder,
} from '../../../helpers/steg/forelder';
import BorForelderINorge from './bostedOgSamvær/BorForelderINorge';
import { ESvar, ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import BorAnnenForelderISammeHus from './ikkesammeforelder/BorAnnenForelderISammeHus';
import BoddSammenFør from './ikkesammeforelder/BoddSammenFør';
import HvorMyeSammen from './ikkesammeforelder/HvorMyeSammen';
import { hentUid } from '../../../utils/autentiseringogvalidering/uuid';
import { erGyldigDato } from '../../../utils/dato';
import { EBorAnnenForelderISammeHus } from '../../../models/steg/barnasbosted';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import BarnetsAndreForelderTittel from './BarnetsAndreForelderTittel';
import LocaleTekst from '../../../language/LocaleTekst';
import { erGyldigFødselsnummer } from 'nav-faker/dist/personidentifikator/helpers/fodselsnummer-utils';
import { BodyShort, Button, Label } from '@navikt/ds-react';

const lagOppdatertBarneliste = (
  barneliste: IBarn[],
  nåværendeBarn: IBarn,
  forelder: IForelder
) => {
  return barneliste.map((b) => {
    if (b === nåværendeBarn) {
      return { ...nåværendeBarn, forelder: forelder };
    } else {
      return b;
    }
  });
};

const oppdaterBarnetsAndreForelder = (
  barneliste: IBarn[],
  nåværendeBarn: IBarn,
  andreForelderId: string
): IBarn[] => {
  return barneliste.map((b) => {
    if (b === nåværendeBarn) {
      return { ...nåværendeBarn, annenForelderId: andreForelderId };
    } else {
      return b;
    }
  });
};

const visBostedOgSamværSeksjon = (
  forelder: IForelder,
  visesBorINorgeSpørsmål: boolean
) => {
  const borForelderINorgeSpm =
    forelder.borINorge?.svarid === ESvar.JA ||
    (forelder.land && forelder.land?.verdi !== '');

  return visesBorINorgeSpørsmål
    ? borForelderINorgeSpm
    : erGyldigDato(forelder.fødselsdato?.verdi);
};

interface Props {
  barn: IBarn;
  settAktivIndex: Function;
  aktivIndex: number;
  sisteBarnUtfylt: boolean;
  settSisteBarnUtfylt: (sisteBarnUtfylt: boolean) => void;
  scrollTilLagtTilBarn: () => void;
  settDokumentasjonsbehovForBarn: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    barneid: string,
    barnapassid?: string
  ) => void;
  barneListe: IBarn[];
  settBarneListe: (barneListe: IBarn[]) => void;
}

const BarnetsBostedEndre: React.FC<Props> = ({
  barn,
  settAktivIndex,
  aktivIndex,
  settSisteBarnUtfylt,
  sisteBarnUtfylt,
  scrollTilLagtTilBarn,
  barneListe,
  settBarneListe,
  settDokumentasjonsbehovForBarn,
}) => {
  const intl = useLokalIntlContext();

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

  const [barnHarSammeForelder, settBarnHarSammeForelder] = useState<
    boolean | undefined
  >(undefined);

  const [kjennerIkkeIdent, settKjennerIkkeIdent] = useState<boolean>(
    forelder.fødselsdato?.verdi ? true : false
  );

  const {
    borAnnenForelderISammeHus,
    boddSammenFør,
    flyttetFra,
    fødselsdato,
    ident,
  } = forelder;

  const erIdentUtfyltOgGylding = (ident?: string): boolean =>
    !!ident && erGyldigFødselsnummer(ident);
  const erFødselsdatoUtfyltOgGyldigEllerTomtFelt = (fødselsdato?: string) =>
    erGyldigDato(fødselsdato) || fødselsdato === '';
  const harForelderFraPdl = barn?.medforelder?.verdi?.navn || false;

  const andreBarnMedForelder: IBarn[] = barneListe.filter((b) => {
    return b !== barn && b.forelder;
  });

  const unikeForeldreIDer = Array.from(
    new Set(andreBarnMedForelder.map((b) => b.forelder?.id))
  );

  const førsteBarnTilHverForelder = unikeForeldreIDer
    .map((id) => {
      if (!id) return null;
      return andreBarnMedForelder.find((b) => b.forelder?.id === id);
    })
    .filter(Boolean) as IBarn[];

  const erPåSisteBarn: boolean =
    barneListe.length - 1 === andreBarnMedForelder.length;

  const leggTilForelder = () => {
    const nyIndex = aktivIndex + 1;
    const nyBarneListe = lagOppdatertBarneliste(barneListe, barn, forelder);

    settBarneListe(nyBarneListe);
    settAktivIndex(nyIndex);
    scrollTilLagtTilBarn();
  };

  const leggTilAnnenForelderId = (annenForelderId: string) => {
    const nyBarneListe = oppdaterBarnetsAndreForelder(
      barneListe,
      barn,
      annenForelderId
    );
    settBarneListe(nyBarneListe);
  };

  const visOmAndreForelder =
    (!barn.medforelder?.verdi && førsteBarnTilHverForelder.length === 0) ||
    (førsteBarnTilHverForelder.length > 0 && barnHarSammeForelder === false) ||
    (barnHarSammeForelder === false &&
      (barn.harSammeAdresse.verdi ||
        harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi)));

  const visBorAnnenForelderINorge =
    !!barn.medforelder?.verdi ||
    (!barnHarSammeForelder &&
      !forelder.kanIkkeOppgiAnnenForelderFar?.verdi &&
      harValgtSvar(forelder?.navn?.verdi) &&
      (harValgtSvar(ident?.verdi || fødselsdato?.verdi) || kjennerIkkeIdent));

  const skalFylleUtHarBoddSammenFør =
    (harValgtSvar(borAnnenForelderISammeHus?.verdi) &&
      borAnnenForelderISammeHus?.svarid !== EBorAnnenForelderISammeHus.ja) ||
    harValgtSvar(forelder.borAnnenForelderISammeHusBeskrivelse?.verdi) ||
    !forelder.borINorge?.verdi;

  return (
    <>
      <div className="barnas-bosted">
        <SeksjonGruppe>
          <BarneHeader barn={barn} />
        </SeksjonGruppe>
        <div className="barnas-bosted__innhold">
          {!barn.harSammeAdresse.verdi && (
            <SkalBarnetBoHosSøker
              barn={barn}
              forelder={forelder}
              settForelder={settForelder}
              settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
            />
          )}
          {(barn.harSammeAdresse?.verdi ||
            harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi)) && (
            <SeksjonGruppe>
              <BarnetsAndreForelderTittel barn={barn} />

              {førsteBarnTilHverForelder.length > 0 &&
                !barn.medforelder?.verdi && (
                  <AnnenForelderKnapper
                    barn={barn}
                    forelder={forelder}
                    oppdaterAnnenForelder={leggTilAnnenForelderId}
                    førsteBarnTilHverForelder={førsteBarnTilHverForelder}
                    settBarnHarSammeForelder={settBarnHarSammeForelder}
                    settForelder={settForelder}
                  />
                )}
              {visOmAndreForelder && (
                <OmAndreForelder
                  settForelder={settForelder}
                  forelder={forelder}
                  kjennerIkkeIdent={kjennerIkkeIdent}
                  settKjennerIkkeIdent={settKjennerIkkeIdent}
                  settSisteBarnUtfylt={settSisteBarnUtfylt}
                />
              )}
              {barn.medforelder?.verdi && (
                <>
                  <Label as="p">Navn</Label>
                  <BodyShort>
                    {barn.medforelder.verdi.navn
                      ? barn.medforelder.verdi.navn
                      : `${hentTekst(
                          'barnekort.medforelder.hemmelig',
                          intl
                        )}, ${barn.medforelder.verdi.alder}`}
                  </BodyShort>
                </>
              )}
            </SeksjonGruppe>
          )}

          {visBorAnnenForelderINorge && (
            <BorForelderINorge
              barn={barn}
              forelder={forelder}
              settForelder={settForelder}
              settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
            />
          )}

          {(visBostedOgSamværSeksjon(forelder, visBorAnnenForelderINorge) ||
            barnHarSammeForelder) && (
            <BostedOgSamvær
              settForelder={settForelder}
              forelder={forelder}
              barn={barn}
              settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
            />
          )}

          {!barnHarSammeForelder &&
            visSpørsmålHvisIkkeSammeForelder(forelder) && (
              <>
                {forelder.borINorge?.verdi && (
                  <BorAnnenForelderISammeHus
                    forelder={forelder}
                    settForelder={settForelder}
                    barn={barn}
                  />
                )}

                {skalFylleUtHarBoddSammenFør && (
                  <BoddSammenFør
                    forelder={forelder}
                    barn={barn}
                    settForelder={settForelder}
                  />
                )}
                {(boddSammenFør?.svarid === ESvar.NEI ||
                  erGyldigDato(flyttetFra?.verdi)) && (
                  <HvorMyeSammen
                    forelder={forelder}
                    barn={barn}
                    settForelder={settForelder}
                  />
                )}
              </>
            )}

          {erForelderUtfylt(forelder) &&
            (erIdentUtfyltOgGylding(forelder.ident?.verdi) ||
              erFødselsdatoUtfyltOgGyldigEllerTomtFelt(
                forelder?.fødselsdato?.verdi
              ) ||
              utfyltNødvendigSpørsmålUtenOppgiAnnenForelder(forelder) ||
              harForelderFraPdl) && (
              <Button variant="secondary" onClick={leggTilForelder}>
                <LocaleTekst
                  tekst={
                    !sisteBarnUtfylt && !erPåSisteBarn
                      ? 'knapp.neste.barn'
                      : 'knapp.neste'
                  }
                />
              </Button>
            )}
        </div>
      </div>
    </>
  );
};

export default BarnetsBostedEndre;
