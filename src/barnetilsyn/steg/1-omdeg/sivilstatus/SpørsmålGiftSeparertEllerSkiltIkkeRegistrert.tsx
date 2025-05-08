import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../../components/spørsmål/JaNeiSpørsmål';
import {
  erUformeltGiftSpørsmål,
  erUformeltSeparertEllerSkiltSpørsmål,
} from './SivilstatusConfig';
import {
  ESvar,
  ISpørsmål,
  ISvar,
} from '../../../../models/felles/spørsmålogsvar';
import AlertstripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import { hentSvarAlertFraSpørsmål } from '../../../../utils/søknad';
import React from 'react';
import { ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import Show from '../../../../utils/showIf';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { hentValgtSvar } from '../../../../utils/sivilstatus';

interface Props {
  sivilstatus: ISivilstatus;
  settSivilstatusFelt: (spørsmål: ISpørsmål, valgtSvar: ISvar) => void;
  erUformeltGift: ISpørsmålBooleanFelt | undefined;
}

const SpørsmålGiftSeparertEllerSkiltIkkeRegistrert: React.FC<Props> = ({
  sivilstatus,
  settSivilstatusFelt,
  erUformeltGift,
}: Props) => {
  const intl = useLokalIntlContext();

  const harSvartJaPåUformeltGift =
    sivilstatus.erUformeltGift?.svarid === ESvar.JA;

  const harSvartJaUformeltSeparertEllerSkilt =
    sivilstatus.erUformeltSeparertEllerSkilt?.svarid === ESvar.JA;

  const harSvartPåUformeltGiftSpørsmålet = erUformeltGift?.verdi !== undefined;

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={erUformeltGiftSpørsmål(intl)}
          onChange={settSivilstatusFelt}
          valgtSvar={hentValgtSvar(erUformeltGiftSpørsmål(intl), sivilstatus)}
        />
        <Show if={harSvartJaPåUformeltGift}>
          <AlertstripeDokumentasjon>
            <LocaleTekst
              tekst={hentSvarAlertFraSpørsmål(
                ESvar.JA,
                erUformeltGiftSpørsmål(intl)
              )}
            />
          </AlertstripeDokumentasjon>
        </Show>
      </KomponentGruppe>
      <Show if={harSvartPåUformeltGiftSpørsmålet}>
        <KomponentGruppe>
          <JaNeiSpørsmål
            spørsmål={erUformeltSeparertEllerSkiltSpørsmål(intl)}
            onChange={settSivilstatusFelt}
            valgtSvar={hentValgtSvar(
              erUformeltSeparertEllerSkiltSpørsmål(intl),
              sivilstatus
            )}
          />
          <Show if={harSvartJaUformeltSeparertEllerSkilt}>
            <AlertstripeDokumentasjon>
              <LocaleTekst
                tekst={hentSvarAlertFraSpørsmål(
                  ESvar.JA,
                  erUformeltSeparertEllerSkiltSpørsmål(intl)
                )}
              />
            </AlertstripeDokumentasjon>
          </Show>
        </KomponentGruppe>
      </Show>
    </>
  );
};

export default SpørsmålGiftSeparertEllerSkiltIkkeRegistrert;
