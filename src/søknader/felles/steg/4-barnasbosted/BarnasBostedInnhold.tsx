import React, { RefObject, useEffect, useRef, useState } from 'react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import BarnetsBostedLagtTil from './BarnetsBostedLagtTil';
import BarnetsBostedEndre from './BarnetsBostedEndre';
import { IBarn } from '../../../../models/steg/barn';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import BarneHeader from '../../../../components/BarneHeader';
import {
  antallBarnMedForeldreUtfylt,
  forelderidentMedBarn,
  hentIndexFørsteBarnSomIkkeErUtfylt,
  kopierFellesForeldreInformasjon,
} from '../../../../utils/barn';
import { BodyShort } from '@navikt/ds-react';
import {
  SøknadOvergangsstønad,
  SettDokumentasjonsbehovBarn,
} from '../../../../models/søknad/søknad';
import { SøknadBarnetilsyn } from '../../../barnetilsyn/models/søknad';
import { SøknadSkolepenger } from '../../../skolepenger/models/søknad';

const scrollTilRef = (ref: RefObject<HTMLDivElement | null>) => {
  if (!ref || !ref.current) return;
  window.scrollTo({ top: ref.current!.offsetTop, left: 0, behavior: 'smooth' });
};

interface Props {
  aktuelleBarn: IBarn[];
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
  oppdaterFlereBarnISøknaden: (oppdaterteBarn: IBarn[]) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
  sisteBarnUtfylt: boolean;
  settSisteBarnUtfylt: React.Dispatch<React.SetStateAction<boolean>>;
  søknad: SøknadOvergangsstønad | SøknadBarnetilsyn | SøknadSkolepenger;
}

const BarnasBostedInnhold: React.FC<Props> = ({
  aktuelleBarn,
  oppdaterBarnISøknaden,
  oppdaterFlereBarnISøknaden,
  settDokumentasjonsbehovForBarn,
  sisteBarnUtfylt,
  settSisteBarnUtfylt,
  søknad,
}) => {
  const intl = useLokalIntlContext();

  const barnMedLevendeMedforelder = aktuelleBarn.filter(
    (barn: IBarn) =>
      !barn.medforelder?.verdi ||
      (barn.medforelder?.verdi && barn.medforelder?.verdi?.død !== true)
  );

  const barnMedDødMedforelder = aktuelleBarn.filter((barn: IBarn) => {
    return barn.medforelder?.verdi?.død === true;
  });

  const antallBarnMedForeldre = antallBarnMedForeldreUtfylt(
    barnMedLevendeMedforelder
  );

  const [aktivIndex, settAktivIndex] = useState<number>(
    hentIndexFørsteBarnSomIkkeErUtfylt(barnMedLevendeMedforelder)
  );

  const lagtTilBarn = useRef(null);

  const scrollTilLagtTilBarn = () => {
    setTimeout(() => scrollTilRef(lagtTilBarn), 120);
  };

  useEffect(() => {
    settSisteBarnUtfylt(
      antallBarnMedForeldreUtfylt(barnMedLevendeMedforelder) ===
        barnMedLevendeMedforelder.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [søknad]);
  const forelderIdenterMedBarn = forelderidentMedBarn(
    barnMedLevendeMedforelder
  );

  const oppdaterBarnMedNyForelderInformasjon = (
    oppdatertBarn: IBarn,
    skalKopiereForeldreinformasjonTilAndreBarn: boolean
  ) => {
    const barnMedSammeForelder =
      oppdatertBarn.forelder?.ident?.verdi &&
      forelderIdenterMedBarn.get(oppdatertBarn.forelder?.ident?.verdi);

    if (skalKopiereForeldreinformasjonTilAndreBarn && barnMedSammeForelder) {
      oppdaterFlereBarnISøknaden(
        barnMedSammeForelder.map((b) => {
          if (b.id === oppdatertBarn.id) {
            return oppdatertBarn;
          }

          return oppdatertBarn.forelder
            ? kopierFellesForeldreInformasjon(b, oppdatertBarn.forelder)
            : b;
        })
      );
    } else {
      oppdaterBarnISøknaden(oppdatertBarn);
    }
  };

  return (
    <>
      {barnMedLevendeMedforelder.map((barn: IBarn, index: number) => {
        const key = barn.fødselsdato.verdi + index;
        if (index === aktivIndex) {
          return (
            <BarnetsBostedEndre
              barn={barn}
              settSisteBarnUtfylt={settSisteBarnUtfylt}
              settAktivIndex={settAktivIndex}
              aktivIndex={aktivIndex}
              key={key}
              scrollTilLagtTilBarn={scrollTilLagtTilBarn}
              settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
              oppdaterBarnISøknaden={oppdaterBarnMedNyForelderInformasjon}
              barneListe={søknad.person.barn}
              forelderidenterMedBarn={forelderIdenterMedBarn}
              søknad={søknad}
            />
          );
        } else {
          return (
            <React.Fragment key={barn.id}>
              {index + 1 === antallBarnMedForeldre && (
                <div ref={lagtTilBarn} key={barn.id + '-ref'} />
              )}
              <BarnetsBostedLagtTil
                barn={barn}
                settAktivIndex={settAktivIndex}
                index={index}
                key={barn.id}
                settSisteBarnUtfylt={settSisteBarnUtfylt}
              />
            </React.Fragment>
          );
        }
      })}
      {sisteBarnUtfylt &&
        barnMedDødMedforelder.map((barn: IBarn) => (
          <SeksjonGruppe key={barn.id}>
            <BarneHeader barn={barn} />
            <BodyShort style={{ textAlign: 'center', marginTop: '2rem' }}>
              {hentTekst('barnasbosted.kanGåVidere', intl)}
            </BodyShort>
          </SeksjonGruppe>
        ))}
    </>
  );
};

export default BarnasBostedInnhold;
