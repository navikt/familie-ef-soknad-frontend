import React, { FC } from 'react';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import JaNeiSpørsmål from '../../../components/spørsmål/JaNeiSpørsmål';
import { skalSøkerGifteSegMedSamboer } from './BosituasjonConfig';
import OmSamboerenDin from './OmSamboerenDin';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import {
  EBosituasjon,
  ESøkerDelerBolig,
  IBosituasjon,
} from '../../../models/steg/bosituasjon';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import {
  harValgtSvar,
  hentBooleanFraValgtSvar,
} from '../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../utils/søknad';
import {
  DatoBegrensning,
  Datovelger,
} from '../../../components/dato/Datovelger';
import { erDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid } from '../../../helpers/steg/bosituasjon';

interface Props {
  settBosituasjon: (bosituasjon: IBosituasjon) => void;
  bosituasjon: IBosituasjon;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
}

const SøkerSkalFlytteSammenEllerFåSamboer: FC<Props> = ({
  settBosituasjon,
  bosituasjon,
  settDokumentasjonsbehov,
}) => {
  const intl = useLokalIntlContext();

  const {
    delerBoligMedAndreVoksne,
    skalGifteSegEllerBliSamboer,
    datoSkalGifteSegEllerBliSamboer,
  } = bosituasjon;

  const spørsmål: ISpørsmål = skalSøkerGifteSegMedSamboer(intl);

  const settSøkerSkalGifteSegEllerBliSamboer = (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar
  ) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
    const nullstilltBosituasjon: IBosituasjon = {
      delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
      skalGifteSegEllerBliSamboer: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
    };

    if (svar === false) {
      delete bosituasjon.datoSkalGifteSegEllerBliSamboer;
      delete bosituasjon.vordendeSamboerEktefelle;
    }

    harValgtSvar(svar) &&
    bosituasjon.delerBoligMedAndreVoksne.svarid ===
      ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse
      ? settBosituasjon({
          ...bosituasjon,
          delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
          skalGifteSegEllerBliSamboer: {
            spørsmålid: spørsmål.søknadid,
            svarid: valgtSvar.id,
            label: hentTekst(spørsmål.tekstid, intl),
            verdi: svar,
          },
        })
      : settBosituasjon(nullstilltBosituasjon);

    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const settDatoSøkerSkalGifteSegEllerBliSamboer = (
    dato: string,
    label: string
  ) => {
    settBosituasjon({
      ...bosituasjon,
      datoSkalGifteSegEllerBliSamboer: {
        label: label,
        verdi: dato,
      },
    });
  };

  const datovelgerTekst = intl.formatMessage({
    id: 'datovelger.nårSkalDetteSkje',
  });

  const erSattDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid =
    erDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid(
      datoSkalGifteSegEllerBliSamboer
    );

  return (
    <>
      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={spørsmål}
          onChange={settSøkerSkalGifteSegEllerBliSamboer}
          valgtSvar={skalGifteSegEllerBliSamboer?.verdi}
        />
      </KomponentGruppe>
      {skalGifteSegEllerBliSamboer && skalGifteSegEllerBliSamboer.verdi ? (
        <>
          <KomponentGruppe>
            <Datovelger
              valgtDato={datoSkalGifteSegEllerBliSamboer?.verdi}
              tekstid={'datovelger.nårSkalDetteSkje'}
              datobegrensning={DatoBegrensning.FremtidigeDatoer}
              settDato={(e) => {
                settDatoSøkerSkalGifteSegEllerBliSamboer(e, datovelgerTekst);
              }}
            />
          </KomponentGruppe>
          {erSattDatoSkalGifteSegEllerBliSamboerFremEllerTilbakeITid && (
            <KomponentGruppe>
              <OmSamboerenDin
                tittel={
                  'bosituasjon.tittel.hvemSkalSøkerGifteEllerBliSamboerMed'
                }
                erIdentEllerFødselsdatoObligatorisk={true}
                settBosituasjon={settBosituasjon}
                bosituasjon={bosituasjon}
                samboerDetaljerType={EBosituasjon.vordendeSamboerEktefelle}
              />
            </KomponentGruppe>
          )}
        </>
      ) : null}
    </>
  );
};

export default SøkerSkalFlytteSammenEllerFåSamboer;
