import React from 'react';
import endre from '../../../../assets/endre.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IBarn } from '../../../../models/steg/barn';
import OppsummeringBarn from './OppsummeringBarn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { useNavigate } from 'react-router-dom';
import { BarneHeader } from '../../../../components/barneheader/BarneHeader';
import { VStack } from '@navikt/ds-react';

interface Props {
  barn: IBarn[];
  stønadstype: Stønadstype;
  endreInformasjonPath?: string;
}

const OppsummeringBarnaDine: React.FC<Props> = ({ barn, stønadstype, endreInformasjonPath }) => {
  const intl = useLokalIntlContext();
  const navigate = useNavigate();
  const barnaDine: IBarn[] = barn;

  const hentEndretBarn = (barn: IBarn): IBarn => {
    const nyttBarn = { ...barn };

    if (barn && !barn?.født?.verdi) {
      // @ts-expect-error sletting
      delete nyttBarn?.ident;
      // @ts-expect-error sletting
      delete nyttBarn.navn;
      // @ts-expect-error sletting
      delete nyttBarn.alder;

      nyttBarn.fødselsdato = {
        label: hentTekst('barnadine.termindato', intl),
        verdi: barn.fødselsdato.verdi,
      };
    }
    return nyttBarn;
  };
  const oppsummeringBarnaDine = barnaDine
    .filter((barn) => (stønadstype == Stønadstype.barnetilsyn ? barn.skalHaBarnepass?.verdi : true))
    .map((barn) => {
      const endretBarn = hentEndretBarn(barn);

      return (
        <>
          <BarneHeader barn={barn} />
          <OppsummeringBarn stønadstype={stønadstype} barn={endretBarn} />
        </>
      );
    });

  return (
    <VStack gap={'16'}>
      {oppsummeringBarnaDine}
      <LenkeMedIkon
        onClick={() =>
          navigate({ pathname: endreInformasjonPath }, { state: { kommerFraOppsummering: true } })
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </VStack>
  );
};

export default OppsummeringBarnaDine;
