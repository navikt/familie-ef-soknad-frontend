import React, { RefObject, useEffect, useRef, useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import BarnetsBostedLagtTil from './BarnetsBostedLagtTil';
import { BarnetsBostedRedigerbar } from './BarnetsBostedRedigerbar';
import { IBarn } from '../../../../models/steg/barn';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import {
  antallBarnMedForeldreUtfylt,
  hentIndexFørsteBarnSomIkkeErUtfylt,
} from '../../../../utils/barn';
import { BodyShort } from '@navikt/ds-react';
import { useBarnasBosted } from './BarnasBostedContext';
import { BarneHeader } from '../../../../components/barneheader/BarneHeader';

const scrollTilRef = (ref: RefObject<HTMLDivElement | null>) => {
  if (!ref || !ref.current) return;
  window.scrollTo({ top: ref.current!.offsetTop, left: 0, behavior: 'smooth' });
};

const BarnasBostedInnhold: React.FC = () => {
  const intl = useLokalIntlContext();
  const {
    barnISøknad,
    sisteBarnUtfylt,
    settSisteBarnUtfylt,
    barnMedLevendeMedforelderEllerUndefined,
  } = useBarnasBosted();

  const barnMedDødMedforelder = barnISøknad.filter((barn: IBarn) => {
    return barn.medforelder?.verdi?.død === true;
  });

  const antallBarnMedForeldre = antallBarnMedForeldreUtfylt(
    barnMedLevendeMedforelderEllerUndefined
  );

  const [aktivIndex, settAktivIndex] = useState<number>(
    hentIndexFørsteBarnSomIkkeErUtfylt(barnMedLevendeMedforelderEllerUndefined)
  );

  const lagtTilBarn = useRef(null);
  const scrollTilLagtTilBarn = () => {
    setTimeout(() => scrollTilRef(lagtTilBarn), 120);
  };

  useEffect(() => {
    settSisteBarnUtfylt(
      antallBarnMedForeldreUtfylt(barnMedLevendeMedforelderEllerUndefined) ===
        barnMedLevendeMedforelderEllerUndefined.length
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barnISøknad]);

  return (
    <>
      {barnMedLevendeMedforelderEllerUndefined.map((barn: IBarn, index: number) => {
        if (index === aktivIndex) {
          return (
            <BarnetsBostedRedigerbar
              barn={barn}
              settAktivIndex={settAktivIndex}
              aktivIndex={aktivIndex}
              key={index}
              scrollTilLagtTilBarn={scrollTilLagtTilBarn}
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
