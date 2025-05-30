import React from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hentTekst } from '../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { skalBarnetBoHosSøker } from './ForeldreConfig';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IForelder } from '../../../../models/steg/forelder';
import { IBarn } from '../../../../models/steg/barn';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import {
  hentBarnNavnEllerBarnet,
  hentSpørsmålTekstMedNavnEllerBarn,
} from '../../../../utils/barn';
import { ESkalBarnetBoHosSøker } from '../../../../models/steg/barnasbosted';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import FormattedHtmlMessage from '../../../../language/FormattedHtmlMessage';
import { Alert } from '@navikt/ds-react';
import { SettDokumentasjonsbehovBarn } from '../../../../models/søknad/søknad';

interface Props {
  barn: IBarn;
  forelder: IForelder;
  settForelder: (forelder: IForelder) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

const SkalBarnetBoHosSøker: React.FC<Props> = ({
  barn,
  forelder,
  settForelder,
  settDokumentasjonsbehovForBarn,
}) => {
  const intl = useLokalIntlContext();

  const skalBarnetBoHosSøkerConfig = skalBarnetBoHosSøker(intl);
  const settSkalBarnetBoHosSøkerFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
    settForelder({
      ...forelder,
      [skalBarnetBoHosSøkerConfig.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst('barnasbosted.spm.skalBarnetBoHosSøker', intl),
        verdi: svar.svar_tekst,
      },
    });
    settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id);
  };

  const hentSpørsmålTekst = (tekstid: string) => {
    const navnEllerBarn = barn.født?.verdi
      ? barn.navn.verdi
      : hentTekst('barnet.storForBokstav', intl);
    return hentSpørsmålTekstMedNavnEllerBarn(tekstid, navnEllerBarn, intl);
  };

  return (
    <>
      <FeltGruppe>
        <Alert size="small" variant="warning" inline>
          {hentSpørsmålTekst('barnasbosted.alert.måBoHosDeg')}
        </Alert>
      </FeltGruppe>
      <KomponentGruppe>
        <MultiSvarSpørsmålMedNavn
          key={skalBarnetBoHosSøkerConfig.søknadid}
          spørsmål={skalBarnetBoHosSøkerConfig}
          spørsmålTekst={hentBarnNavnEllerBarnet(
            barn,
            skalBarnetBoHosSøkerConfig.tekstid,
            intl
          )}
          valgtSvar={forelder.skalBarnetBoHosSøker?.verdi}
          settSpørsmålOgSvar={settSkalBarnetBoHosSøkerFelt}
        />
      </KomponentGruppe>
      {forelder.skalBarnetBoHosSøker?.svarid ===
        ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke && (
        <FeltGruppe>
          <AlertStripeDokumentasjon>
            <FormattedHtmlMessage
              id={hentBarnNavnEllerBarnet(
                barn,
                'barnasbosted.alert.hvisFaktiskBor',
                intl
              )}
            />
          </AlertStripeDokumentasjon>
        </FeltGruppe>
      )}
      {forelder.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.ja && (
        <FeltGruppe>
          <Alert size="small" variant="info" inline>
            {hentTekst('barnasbosted.alert.skalBarnetBoHosSøker.ja', intl)}
          </Alert>
        </FeltGruppe>
      )}
      {forelder.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.nei && (
        <FeltGruppe>
          <Alert size="small" variant="warning" inline>
            {hentTekst('barnasbosted.alert.skalBarnetBoHosSøker.nei', intl)}
          </Alert>
        </FeltGruppe>
      )}
    </>
  );
};

export default SkalBarnetBoHosSøker;
