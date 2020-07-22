import React, { useEffect, useState } from 'react';
import JaNeiSpørsmål from '../../../../components/spørsmål/JaNeiSpørsmål';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import SøkerErGift from './SøkerErGift';
import Søknadsbegrunnelse from './begrunnelse/SøknadsBegrunnelse';
import { hentBooleanFraValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentSvarAlertFraSpørsmål, hentTekst } from '../../../../utils/søknad';
import { ESvar, ISpørsmål, ISvar } from '../../../../models/spørsmålogsvar';
import { useIntl } from 'react-intl';
import { usePersonContext } from '../../../../context/PersonContext';
import {
  erUformeltSeparertEllerSkiltSpørsmål,
  erUformeltGiftSpørsmål,
} from './SivilstatusConfig';
import {
  ESivilstand,
  ESivilstatusSøknadid,
  ISivilstatus,
} from '../../../../models/steg/omDeg/sivilstatus';
import AlertstripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { datoTilStreng } from '../../../../utils/dato';
import { useBarnetilsynSøknad } from '../../../BarnetilsynContext';

const Sivilstatus: React.FC = () => {
  const intl = useIntl();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
  } = useBarnetilsynSøknad();
  const [sivilstatus, settSivilstatus] = useState<ISivilstatus>(
    søknad.sivilstatus
  );
  const {
    harSøktSeparasjon,
    datoSøktSeparasjon,
    datoFlyttetFraHverandre,
    erUformeltSeparertEllerSkilt,
    erUformeltGift,
  } = sivilstatus;

  useEffect(() => {
    settSøknad({ ...søknad, sivilstatus: sivilstatus });
    // eslint-disable-next-line
  }, [sivilstatus]);

  const erSøkerGift =
    sivilstand === ESivilstand.GIFT || sivilstand === ESivilstand.REPA;
  const erSøkerUgift =
    sivilstand === ESivilstand.UGIF ||
    sivilstand === null ||
    sivilstand === 'NULL';
  const erSøkerEnke =
    sivilstand === ESivilstand.ENKE || sivilstand === ESivilstand.GJPA;
  const erSøkerSeparert =
    sivilstand === ESivilstand.SEPA || sivilstand === ESivilstand.SEPR;
  const erSøkerSkilt =
    sivilstand === ESivilstand.SKIL || sivilstand === ESivilstand.SKPA;

  const settSivilstatusFelt = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const spørsmålLabel = hentTekst(spørsmål.tekstid, intl);
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    const nySivilstatus = {
      ...sivilstatus,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: spørsmålLabel,
        verdi: svar,
      },
    };
    if (
      spørsmål.søknadid === ESivilstatusSøknadid.harSøktSeparasjon &&
      harSøktSeparasjon?.verdi === false &&
      datoFlyttetFraHverandre &&
      datoSøktSeparasjon
    ) {
      delete nySivilstatus.datoSøktSeparasjon;
      delete nySivilstatus.datoFlyttetFraHverandre;
    }

    settSivilstatus(nySivilstatus);
    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const settDato = (
    date: Date | null,
    objektnøkkel: string,
    tekstid: string
  ): void => {
    date !== null &&
      settSivilstatus({
        ...sivilstatus,
        [objektnøkkel]: {
          label: intl.formatMessage({ id: tekstid }),
          verdi: datoTilStreng(date),
        },
      });
  };

  const hentValgtSvar = (spørsmål: ISpørsmål, sivilstatus: ISivilstatus) => {
    for (const [key, value] of Object.entries(sivilstatus)) {
      if (key === spørsmål.søknadid && value !== undefined) {
        return value.verdi;
      }
    }
  };

  return (
    <SeksjonGruppe>
      {erSøkerGift ? (
        <SøkerErGift
          settJaNeiFelt={settSivilstatusFelt}
          settDato={settDato}
          sivilstatus={sivilstatus}
        />
      ) : erSøkerUgift ? (
        <>
          <KomponentGruppe>
            <JaNeiSpørsmål
              spørsmål={erUformeltGiftSpørsmål}
              onChange={settSivilstatusFelt}
              valgtSvar={hentValgtSvar(
                erUformeltGiftSpørsmål,
                søknad.sivilstatus
              )}
            />
            {sivilstatus.erUformeltGift?.svarid === ESvar.JA && (
              <AlertstripeDokumentasjon>
                <LocaleTekst
                  tekst={hentSvarAlertFraSpørsmål(
                    ESvar.JA,
                    erUformeltGiftSpørsmål
                  )}
                />
              </AlertstripeDokumentasjon>
            )}
          </KomponentGruppe>

          {erUformeltGift?.hasOwnProperty('verdi') && (
            <KomponentGruppe>
              <JaNeiSpørsmål
                spørsmål={erUformeltSeparertEllerSkiltSpørsmål}
                onChange={settSivilstatusFelt}
                valgtSvar={hentValgtSvar(
                  erUformeltSeparertEllerSkiltSpørsmål,
                  søknad.sivilstatus
                )}
              />
              {sivilstatus.erUformeltSeparertEllerSkilt?.svarid ===
                ESvar.JA && (
                <AlertstripeDokumentasjon>
                  <LocaleTekst
                    tekst={hentSvarAlertFraSpørsmål(
                      ESvar.JA,
                      erUformeltSeparertEllerSkiltSpørsmål
                    )}
                  />
                </AlertstripeDokumentasjon>
              )}
            </KomponentGruppe>
          )}
        </>
      ) : null}

      {(erSøkerUgift &&
        erUformeltSeparertEllerSkilt?.hasOwnProperty('verdi')) ||
      erSøkerSeparert ||
      erSøkerSkilt ||
      erSøkerEnke ? (
        <Søknadsbegrunnelse
          sivilstatus={sivilstatus}
          settSivilstatus={settSivilstatus}
          settDato={settDato}
        />
      ) : null}
    </SeksjonGruppe>
  );
};

export default Sivilstatus;
