import React, { FC } from 'react';
import BarnepassSpørsmål from './BarnepassSpørsmål';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import LeggTilKnapp from '../../../../components/knapper/LeggTilKnapp';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { erBarnepassOrdningerUtfylt } from './hjelper';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { IBarn } from '../../../../models/steg/barn';
import { IBarnepass, IBarnepassOrdning } from '../../models/barnepass';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Label } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useBarnepass } from './BarnepassContext';

interface Props {
  barn: IBarn;
  settBarnepass: (barnepass: IBarnepass, barnid: string) => void;
}

const BarnepassOrdninger: FC<Props> = ({ barn, settBarnepass }) => {
  const intl = useLokalIntlContext();
  const { settDokumentasjonsbehovForBarn } = useBarnepass();
  const barnepass: IBarnepass = barn.barnepass
    ? barn.barnepass
    : { barnepassordninger: [{ id: hentUid() }] };
  const leggTilLabel = hentBarnNavnEllerBarnet(barn, 'barnepass.label.leggTilOrdning', intl);

  const settBarnepassOrdning = (endretBarnepassordning: IBarnepassOrdning) => {
    const endretBarnepassordninger = barnepass.barnepassordninger.map((ordning) => {
      if (ordning.id === endretBarnepassordning.id) {
        return endretBarnepassordning;
      } else return ordning;
    });
    settBarnepass(
      {
        ...barn.barnepass,
        barnepassordninger: endretBarnepassordninger,
      },
      barn.id
    );
  };

  const leggTilBarnepassordning = () => {
    const endretBarnepassordninger = barnepass.barnepassordninger;
    endretBarnepassordninger.push({ id: hentUid() });
    settBarnepass({ ...barn.barnepass, barnepassordninger: endretBarnepassordninger }, barn.id);
  };

  const fjernBarnepassOrdning = (barnepassordning: IBarnepassOrdning) => {
    const barnepassordninger = barn.barnepass?.barnepassordninger;
    if (barnepassordninger && barnepassordninger.length > 1) {
      const endretBarnepassOrdning = barnepassordninger?.filter(
        (ordning) => ordning.id !== barnepassordning.id
      );
      settBarnepass({ ...barnepass, barnepassordninger: endretBarnepassOrdning }, barn.id);
    }
  };

  return (
    <SeksjonGruppe key={barn.id}>
      {barnepass?.barnepassordninger.map((barnepassordning) => (
        <BarnepassSpørsmål
          key={barnepassordning.id}
          barn={barn}
          barnepassOrdning={barnepassordning}
          settBarnepassOrdning={settBarnepassOrdning}
          settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
          fjernBarnepassOrdning={fjernBarnepassOrdning}
        />
      ))}
      {erBarnepassOrdningerUtfylt(barnepass.barnepassordninger) && (
        <KomponentGruppe>
          <FeltGruppe>
            <Label as="p">{leggTilLabel}</Label>
            <LeggTilKnapp onClick={() => leggTilBarnepassordning()}>
              {hentTekst('barnepass.knapp.leggTilOrdning', intl)}
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </SeksjonGruppe>
  );
};

export default BarnepassOrdninger;
