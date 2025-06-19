import React, { FC } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import {
  ESøkerDelerBolig,
  IBosituasjon,
} from '../../../../models/steg/bosituasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import SøkerSkalFlytteSammenEllerFåSamboer from './SøkerSkalFlytteSammenEllerFåSamboer';
import EkteskapsliknendeForhold from './EkteskapsliknendeForhold';
import OmTidligereSamboer from './OmTidligereSamboer';
import { hentTekst } from '../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { delerSøkerBoligMedAndreVoksne } from './BosituasjonConfig';
import {
  erValgtSvarLiktSomSvar,
  harValgtSvar,
} from '../../../../utils/spørsmålogsvar';
import { erDatoGyldigOgInnaforBegrensninger } from '../../../../components/dato/utils';
import { DatoBegrensning } from '../../../../components/dato/Datovelger';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import FormattedHtmlMessage from '../../../../language/FormattedHtmlMessage';
import { Alert } from '@navikt/ds-react';

interface Props {
  bosituasjon: IBosituasjon;
  settBosituasjon: React.Dispatch<React.SetStateAction<IBosituasjon>>;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
}

const BosituasjonSpørsmål: FC<Props> = ({
  bosituasjon,
  settBosituasjon,
  settDokumentasjonsbehov,
}) => {
  const intl = useLokalIntlContext();

  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetFraHverandre } =
    bosituasjon;

  const hovedSpørsmål: ISpørsmål = delerSøkerBoligMedAndreVoksne(intl);

  const settBosituasjonFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
    const svarTekst: string = svar.svar_tekst;
    const spørsmålTekst: string = hentTekst(spørsmål.tekstid, intl);

    const nyBosituasjon = {
      delerBoligMedAndreVoksne: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: spørsmålTekst,
        verdi: svarTekst,
      },
    };

    settBosituasjon(nyBosituasjon);
    settDokumentasjonsbehov(spørsmål, svar);
  };

  const valgtSvar: ISvar | undefined = hovedSpørsmål.svaralternativer.find(
    (svar) =>
      erValgtSvarLiktSomSvar(delerBoligMedAndreVoksne.verdi, svar.svar_tekst)
  );

  const harSøkerEkteskapsliknendeForhold =
    delerBoligMedAndreVoksne.svarid ===
    ESøkerDelerBolig.harEkteskapsliknendeForhold;

  const harSattDatoFlyttetFraHverandre: boolean = !!(
    datoFlyttetFraHverandre?.verdi &&
    erDatoGyldigOgInnaforBegrensninger(
      datoFlyttetFraHverandre?.verdi,
      DatoBegrensning.AlleDatoer
    )
  );
  const tidligereSamboerFortsattRegistrertPåAdresse =
    delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse &&
    harSattDatoFlyttetFraHverandre &&
    harValgtSvar(samboerDetaljer?.navn?.verdi) &&
    harValgtSvar(datoFlyttetFraHverandre?.verdi);

  const planerOmÅFlytteSammenEllerFåSamboer =
    delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.borAleneMedBarnEllerGravid ||
    delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.delerBoligMedAndreVoksne ||
    tidligereSamboerFortsattRegistrertPåAdresse;

  return (
    <>
      <SeksjonGruppe>
        <MultiSvarSpørsmål
          key={hovedSpørsmål.søknadid}
          spørsmål={hovedSpørsmål}
          valgtSvar={delerBoligMedAndreVoksne.verdi}
          settSpørsmålOgSvar={settBosituasjonFelt}
        />
        {valgtSvar && valgtSvar.alert_tekstid && (
          <FeltGruppe>
            {delerBoligMedAndreVoksne.svarid ===
            ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse ? (
              <AlertStripeDokumentasjon>
                <FormattedHtmlMessage id={valgtSvar.alert_tekstid} />
              </AlertStripeDokumentasjon>
            ) : (
              <Alert size="small" variant="warning" inline>
                <LocaleTekst tekst={valgtSvar.alert_tekstid} />
              </Alert>
            )}
          </FeltGruppe>
        )}
      </SeksjonGruppe>

      {delerBoligMedAndreVoksne.svarid ===
        ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse && (
        <SeksjonGruppe>
          <OmTidligereSamboer
            bosituasjon={bosituasjon}
            settBosituasjon={settBosituasjon}
          />
        </SeksjonGruppe>
      )}

      {planerOmÅFlytteSammenEllerFåSamboer && (
        <SeksjonGruppe>
          <SøkerSkalFlytteSammenEllerFåSamboer
            settBosituasjon={settBosituasjon}
            bosituasjon={bosituasjon}
            settDokumentasjonsbehov={settDokumentasjonsbehov}
          />
        </SeksjonGruppe>
      )}

      {harSøkerEkteskapsliknendeForhold && (
        <EkteskapsliknendeForhold
          settBosituasjon={settBosituasjon}
          bosituasjon={bosituasjon}
        />
      )}
    </>
  );
};

export default BosituasjonSpørsmål;
