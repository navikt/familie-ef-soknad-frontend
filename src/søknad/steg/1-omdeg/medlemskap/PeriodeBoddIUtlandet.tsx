import { FC, useEffect, useState } from 'react';
import LocaleTekst from '../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import Utenlandsopphold from './Utenlandsopphold';

import { hentTekst } from '../../../../utils/søknad';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import {
  ILandMedKode,
  IUtenlandsopphold,
} from '../../../../models/steg/omDeg/medlemskap';
import { tomPeriode } from '../../../../helpers/tommeSøknadsfelter';
import LeggTilKnapp from '../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Label } from '@navikt/ds-react';
import { useOmDeg } from '../../../../barnetilsyn/steg/1-omdeg/OmDegContext';

const PeriodeBoddIUtlandet: FC<{
  land: ILandMedKode[];
}> = ({ land }) => {
  const intl = useLokalIntlContext();
  const { medlemskap2, settMedlemskap2 } = useOmDeg();
  const tomtUtenlandsopphold: IUtenlandsopphold = {
    id: hentUid(),
    periode: tomPeriode,
    erEøsLand: true,
    begrunnelse: {
      label: hentTekst('medlemskap.periodeBoddIUtlandet.begrunnelse', intl),
      verdi: '',
    },
  };
  const [perioderBoddIUtlandet, settPerioderBoddIUtlandet] = useState<
    IUtenlandsopphold[]
  >(
    medlemskap2?.perioderBoddIUtlandet &&
      medlemskap2.perioderBoddIUtlandet.length > 0
      ? medlemskap2.perioderBoddIUtlandet
      : [tomtUtenlandsopphold]
  );

  const erForrigePeriodeFyltUt: boolean = perioderBoddIUtlandet.every(
    (utenlandsopphold) => utenlandsopphold.begrunnelse.verdi !== ''
  );

  useEffect(() => {
    settMedlemskap2({
      ...medlemskap2,
      perioderBoddIUtlandet: perioderBoddIUtlandet,
    });
    // eslint-disable-next-line
  }, [perioderBoddIUtlandet]);

  const leggTilUtenlandsperiode = () => {
    const alleUtenlandsopphold = perioderBoddIUtlandet;
    alleUtenlandsopphold && alleUtenlandsopphold.push(tomtUtenlandsopphold);
    alleUtenlandsopphold &&
      settMedlemskap2({
        ...medlemskap2,
        perioderBoddIUtlandet: alleUtenlandsopphold,
      });
  };

  return (
    <>
      {perioderBoddIUtlandet?.map((periode, index) => {
        return (
          <KomponentGruppe key={periode.id}>
            <Utenlandsopphold
              settPeriodeBoddIUtlandet={settPerioderBoddIUtlandet}
              perioderBoddIUtlandet={perioderBoddIUtlandet}
              utenlandsopphold={periode}
              oppholdsnr={index}
              land={land}
            />
          </KomponentGruppe>
        );
      })}

      {erForrigePeriodeFyltUt && (
        <KomponentGruppe>
          <FeltGruppe>
            <Label as="p">
              <LocaleTekst
                tekst={'medlemskap.periodeBoddIUtlandet.flereutenlandsopphold'}
              />
            </Label>
            <LeggTilKnapp onClick={() => leggTilUtenlandsperiode()}>
              <LocaleTekst tekst={'medlemskap.periodeBoddIUtlandet.knapp'} />
            </LeggTilKnapp>
          </FeltGruppe>
        </KomponentGruppe>
      )}
    </>
  );
};
export default PeriodeBoddIUtlandet;
