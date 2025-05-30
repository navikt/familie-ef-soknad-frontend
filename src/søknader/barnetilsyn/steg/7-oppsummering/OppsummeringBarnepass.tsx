import { FC } from 'react';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/søknad';
import { IBarn } from '../../../../models/steg/barn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  IDatoFelt,
  ISpørsmålBooleanFelt,
} from '../../../../models/søknad/søknadsfelter';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';

import { formatDate, strengTilDato } from '../../../../utils/dato';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import {
  VisLabelOgSvar,
  visLabelOgVerdiForSpørsmålFelt,
} from '../../../../utils/visning';
import BarneHeader from '../../../../components/BarneHeader';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { StyledOppsummeringForBarn } from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  søkerFraBestemtDato?: ISpørsmålBooleanFelt;
  søknadsdato?: IDatoFelt;
  barnSomSkalHaBarnepass: IBarn[];
  endreInformasjonPath?: string;
}

const OppsummeringBarnepass: FC<Props> = ({
  barnSomSkalHaBarnepass,
  søknadsdato,
  søkerFraBestemtDato,
  endreInformasjonPath,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  return (
    <>
      {barnSomSkalHaBarnepass.map((barn: IBarn) => {
        const { barnepass } = barn;

        return (
          <KomponentGruppe key={barn.id}>
            <StyledOppsummeringForBarn key={barn.id}>
              <FeltGruppe>
                <BarneHeader barn={barn} />
              </FeltGruppe>
              {barnepass?.årsakBarnepass &&
                visLabelOgVerdiForSpørsmålFelt(barnepass.årsakBarnepass, intl)}
              {barnepass?.barnepassordninger.map((barnepassordning) =>
                VisLabelOgSvar(barnepassordning)
              )}
            </StyledOppsummeringForBarn>
          </KomponentGruppe>
        );
      })}

      {søkerFraBestemtDato && (
        <KomponentGruppe>
          <hr />
          <br />
          <div className={'spørsmål-og-svar'}>
            <Label as="p">{søkerFraBestemtDato.label}</Label>
            <BodyShort>
              {søkerFraBestemtDato.svarid === ESøkerFraBestemtMåned.ja
                ? hentTekst('svar.ja', intl)
                : hentTekst('søkerFraBestemtMåned.svar.neiNavKanVurdere', intl)}
            </BodyShort>
          </div>

          {søkerFraBestemtDato.svarid === ESøkerFraBestemtMåned.ja &&
            søknadsdato?.verdi && (
              <div className={'spørsmål-og-svar'}>
                <Label as="p">{søknadsdato.label}</Label>
                <BodyShort>
                  {formatDate(strengTilDato(søknadsdato?.verdi))}
                </BodyShort>
              </div>
            )}
        </KomponentGruppe>
      )}
      <KomponentGruppe>
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
      </KomponentGruppe>
    </>
  );
};

export default OppsummeringBarnepass;
