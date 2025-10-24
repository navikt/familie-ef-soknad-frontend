import { FC } from 'react';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IBarn } from '../../../../models/steg/barn';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IDatoFelt, ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';

import { formatDate, strengTilDato } from '../../../../utils/dato';
import { VisLabelOgSvar, visLabelOgVerdiForSpørsmålFelt } from '../../../../utils/visning';
import { useNavigate } from 'react-router-dom';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { BarneHeader } from '../../../../components/barneheader/BarneHeader';

interface Props {
  søkerFraBestemtDato?: ISpørsmålBooleanFelt;
  søknadsdato?: IDatoFelt;
  barnSomSkalHaBarnepass: IBarn[];
  endreInformasjonPath?: string;
}

export const OppsummeringBarnepass: FC<Props> = ({
  barnSomSkalHaBarnepass,
  søknadsdato,
  søkerFraBestemtDato,
  endreInformasjonPath,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  return (
    <VStack gap={'12'}>
      {barnSomSkalHaBarnepass.map((barn: IBarn) => {
        const { barnepass } = barn;
        return (
          <section key={barn.id}>
            <BarneHeader barn={barn} />
            {barnepass?.årsakBarnepass &&
              visLabelOgVerdiForSpørsmålFelt(barnepass.årsakBarnepass, intl)}
            {barnepass?.barnepassordninger.map((barnepassordning) =>
              VisLabelOgSvar(barnepassordning)
            )}
          </section>
        );
      })}

      {søkerFraBestemtDato && (
        <VStack gap={'8'}>
          <hr style={{ width: '100%' }} />
          <div>
            <Label as="p">{søkerFraBestemtDato.label}</Label>
            <BodyShort>
              {søkerFraBestemtDato.svarid === ESøkerFraBestemtMåned.ja
                ? hentTekst('svar.ja', intl)
                : hentTekst('søkerFraBestemtMåned.svar.neiNavKanVurdere', intl)}
            </BodyShort>
          </div>

          {søkerFraBestemtDato.svarid === ESøkerFraBestemtMåned.ja && søknadsdato?.verdi && (
            <div>
              <Label as="p">{søknadsdato.label}</Label>
              <BodyShort>{formatDate(strengTilDato(søknadsdato?.verdi))}</BodyShort>
            </div>
          )}
        </VStack>
      )}
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
