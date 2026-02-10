import React from 'react';
import { hentHTMLTekstMedEnVariabel, hentTekst } from '../../../../utils/teksthåndtering';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { skalBarnetBoHosSøker } from './ForeldreConfig';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IForelder } from '../../../../models/steg/forelder';
import { IBarn } from '../../../../models/steg/barn';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import {
  barnetsNavnEllerBarnet,
  hentBarnNavnEllerBarnet,
  hentSpørsmålTekstMedNavnEllerBarn,
} from '../../../../utils/barn';
import { ESkalBarnetBoHosSøker } from '../../../../models/steg/barnasbosted';
import { Alert, VStack } from '@navikt/ds-react';
import { useBarnasBosted } from './BarnasBostedContext';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

interface Props {
  barn: IBarn;
  forelder: IForelder;
  settForelder: (forelder: IForelder) => void;
}

export const SkalBarnetBoHosSøker: React.FC<Props> = ({ barn, forelder, settForelder }) => {
  const intl = useLokalIntlContext();
  const { settDokumentasjonsbehovForBarn } = useBarnasBosted();

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
    <VStack gap={'space-48'}>
      <Alert size="small" variant="warning" inline>
        {hentSpørsmålTekst('barnasbosted.alert.måBoHosDeg')}
      </Alert>
      <MultiSvarSpørsmålMedNavn
        key={skalBarnetBoHosSøkerConfig.søknadid}
        spørsmål={skalBarnetBoHosSøkerConfig}
        spørsmålTekst={hentBarnNavnEllerBarnet(barn, skalBarnetBoHosSøkerConfig.tekstid, intl)}
        valgtSvar={forelder.skalBarnetBoHosSøker?.verdi}
        settSpørsmålOgSvar={settSkalBarnetBoHosSøkerFelt}
      />
      {forelder.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke && (
        <AlertStripeDokumentasjon>
          {hentHTMLTekstMedEnVariabel(
            'barnasbosted.alert.hvisFaktiskBor',
            intl,
            barnetsNavnEllerBarnet(barn, intl)
          )}
        </AlertStripeDokumentasjon>
      )}
      {forelder.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.ja && (
        <Alert size="small" variant="info" inline>
          {hentTekst('barnasbosted.alert.skalBarnetBoHosSøker.ja', intl)}
        </Alert>
      )}
      {forelder.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.nei && (
        <Alert size="small" variant="warning" inline>
          {hentTekst('barnasbosted.alert.skalBarnetBoHosSøker.nei', intl)}
        </Alert>
      )}
    </VStack>
  );
};
