import React, { FC } from 'react';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import MultiSvarSpørsmål from '../../../components/spørsmål/MultiSvarSpørsmål';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import AlertStripeDokumentasjon from '../../../components/AlertstripeDokumentasjon';
import {
  Bo3,
  DelerBoligMedAndreVoksne,
  ESøkerDelerBolig,
  IBosituasjon,
} from '../../../models/steg/bosituasjon';
import LocaleTekst from '../../../language/LocaleTekst';
import SøkerSkalFlytteSammenEllerFåSamboer from './SøkerSkalFlytteSammenEllerFåSamboer';
import EkteskapsliknendeForhold from './EkteskapsliknendeForhold';
import OmTidligereSamboer from './OmTidligereSamboer';
import { hentTekst } from '../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import { delerSøkerBoligMedAndreVoksne } from './BosituasjonConfig';
import {
  erValgtSvarLiktSomSvar,
  harValgtSvar,
} from '../../../utils/spørsmålogsvar';
import { erDatoGyldigOgInnaforBegrensninger } from '../../../components/dato/utils';
import { DatoBegrensning } from '../../../components/dato/Datovelger';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import FormattedHtmlMessage from '../../../language/FormattedHtmlMessage';
import { Alert } from '@navikt/ds-react';
import MultiSvarSpørsmål2 from '../../../components/spørsmål/MultiSvarSpørsmål2';

interface Props {
  bosituasjon: IBosituasjon;
  settBosituasjon: (bosituasjon: IBosituasjon) => void;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
  bosituasjon2: Bo3;
  settBosituasjon2: (bosituasjon: Bo3) => void;
}

const BosituasjonSpørsmål2: FC<Props> = ({
  bosituasjon,
  settBosituasjon,
  settDokumentasjonsbehov,
  bosituasjon2,
  settBosituasjon2,
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
      <SeksjonGruppe>
        <MultiSvarSpørsmål2
          spørsmål={'bosituasjon.spm.delerSøkerBoligMedAndreVoksne'}
          alternativer={Object.values(DelerBoligMedAndreVoksne)}
          bosituasjon2={bosituasjon2}
          settBosituasjon={settBosituasjon2}
          valgtSvar={bosituasjon2.hovedSpørsmål}
        />
      </SeksjonGruppe>
      {bosituasjon2?.hovedSpørsmål == DelerBoligMedAndreVoksne.IKKEBESVART && (
        <p>Ikke besvart</p>
      )}
      {/*<SeksjonGruppe>*/}
      {/*  <MultiSvarSpørsmål*/}
      {/*    key={'hovedSpørsmål.søknadid'}*/}
      {/*    spørsmål={hovedSpørsmål}*/}
      {/*    valgtSvar={delerBoligMedAndreVoksne.verdi}*/}
      {/*    settSpørsmålOgSvar={settBosituasjonFelt}*/}
      {/*  />*/}
      {/*  {valgtSvar && valgtSvar.alert_tekstid && (*/}
      {/*    <FeltGruppe>*/}
      {/*      {delerBoligMedAndreVoksne.svarid ===*/}
      {/*      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse ? (*/}
      {/*        <AlertStripeDokumentasjon>*/}
      {/*          <FormattedHtmlMessage id={valgtSvar.alert_tekstid} />*/}
      {/*        </AlertStripeDokumentasjon>*/}
      {/*      ) : (*/}
      {/*        <Alert size="small" variant="warning" inline>*/}
      {/*          <LocaleTekst tekst={valgtSvar.alert_tekstid} />*/}
      {/*        </Alert>*/}
      {/*      )}*/}
      {/*    </FeltGruppe>*/}
      {/*  )}*/}
      {/*</SeksjonGruppe>*/}

      {/*{delerBoligMedAndreVoksne.svarid ===*/}
      {/*  ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse && (*/}
      {/*  <SeksjonGruppe>*/}
      {/*    <OmTidligereSamboer*/}
      {/*      bosituasjon={bosituasjon}*/}
      {/*      settBosituasjon={settBosituasjon}*/}
      {/*    />*/}
      {/*  </SeksjonGruppe>*/}
      {/*)}*/}

      {/*{planerOmÅFlytteSammenEllerFåSamboer && (*/}
      {/*  <SeksjonGruppe>*/}
      {/*    <SøkerSkalFlytteSammenEllerFåSamboer*/}
      {/*      settBosituasjon={settBosituasjon}*/}
      {/*      bosituasjon={bosituasjon}*/}
      {/*      settDokumentasjonsbehov={settDokumentasjonsbehov}*/}
      {/*    />*/}
      {/*  </SeksjonGruppe>*/}
      {/*)}*/}

      {/*{harSøkerEkteskapsliknendeForhold && (*/}
      {/*  <EkteskapsliknendeForhold*/}
      {/*    settBosituasjon={settBosituasjon}*/}
      {/*    bosituasjon={bosituasjon}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default BosituasjonSpørsmål2;
