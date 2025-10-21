import React, { FC } from 'react';
import { harDereSkriftligSamværsavtale } from '../ForeldreConfig';
import { EHarSkriftligSamværsavtale } from '../../../../../models/steg/barnasbosted';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import { IForelder } from '../../../../../models/steg/forelder';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { IBarn } from '../../../../../models/steg/barn';
import MultiSvarSpørsmålMedNavn from '../../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../../components/AlertstripeDokumentasjon';
import { VStack } from '@navikt/ds-react';

interface Props {
  forelder: IForelder;
  settBostedOgSamværFelt: (spørsmål: ISpørsmål, svar: ISvar) => void;
  barn: IBarn;
}
export const HarForelderSkriftligSamværsavtale: FC<Props> = ({
  forelder,
  settBostedOgSamværFelt,
  barn,
}) => {
  const intl = useLokalIntlContext();
  const harDereSkriftligSamværsavtaleSpm = harDereSkriftligSamværsavtale(intl);
  return (
    <VStack>
      <MultiSvarSpørsmålMedNavn
        key={harDereSkriftligSamværsavtaleSpm.søknadid}
        spørsmål={harDereSkriftligSamværsavtaleSpm}
        spørsmålTekst={hentBarnNavnEllerBarnet(
          barn,
          harDereSkriftligSamværsavtaleSpm.tekstid,
          intl
        )}
        valgtSvar={forelder.harDereSkriftligSamværsavtale?.verdi}
        settSpørsmålOgSvar={settBostedOgSamværFelt}
      />
      {(forelder.harDereSkriftligSamværsavtale?.svarid ===
        EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter ||
        forelder.harDereSkriftligSamværsavtale?.svarid ===
          EHarSkriftligSamværsavtale.jaKonkreteTidspunkter) && (
        <FeltGruppe>
          <AlertStripeDokumentasjon>
            {hentTekst('barnasbosted.alert.leggeVedSamværsavtalen', intl)}
          </AlertStripeDokumentasjon>
        </FeltGruppe>
      )}
    </VStack>
  );
};
