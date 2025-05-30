import React from 'react';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/søknad';
import {
  ESøkerDelerBolig,
  IBosituasjon,
} from '../../../../models/steg/bosituasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { VisLabelOgSvar } from '../../../../utils/visning';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { StyledOppsummering } from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { Ingress } from '@navikt/ds-react';

interface Props {
  bosituasjon: IBosituasjon;
  endreInformasjonPath?: string;
}

const OppsummeringBosituasionenDin: React.FC<Props> = ({
  bosituasjon,
  endreInformasjonPath,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  const samboerDetaljer =
    bosituasjon.samboerDetaljer && VisLabelOgSvar(bosituasjon.samboerDetaljer);
  const vordendeSamboerEktefelle =
    bosituasjon.vordendeSamboerEktefelle &&
    VisLabelOgSvar(bosituasjon.vordendeSamboerEktefelle);

  const lagSamboerOverskrift = () => {
    if (
      bosituasjon.delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
    ) {
      return hentTekst('bosituasjon.tittel.omTidligereSamboer', intl);
    } else if (
      bosituasjon.delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.harEkteskapsliknendeForhold
    ) {
      return hentTekst('bosituasjon.tittel.omSamboer', intl);
    }
  };

  return (
    <StyledOppsummering>
      <KomponentGruppe>{VisLabelOgSvar(bosituasjon)}</KomponentGruppe>
      {samboerDetaljer && (
        <KomponentGruppe>
          <Ingress>{lagSamboerOverskrift()}</Ingress>
          {samboerDetaljer}
        </KomponentGruppe>
      )}

      {vordendeSamboerEktefelle && (
        <KomponentGruppe>
          <Ingress>
            {hentTekst(
              'bosituasjon.tittel.hvemSkalSøkerGifteEllerBliSamboerMed',
              intl
            )}
          </Ingress>
          {vordendeSamboerEktefelle}
        </KomponentGruppe>
      )}

      <LenkeMedIkon
        onClick={() =>
          navigate(
            { pathname: endreInformasjonPath },
            { state: { kommerFraOppsummering: true } }
          )
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </StyledOppsummering>
  );
};

export default OppsummeringBosituasionenDin;
