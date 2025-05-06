import { FC, useEffect, useState } from 'react';
import LocaleTekst from '../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import Utenlandsopphold from './Utenlandsopphold';

import { hentTekst } from '../../../../utils/søknad';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import {
  ILandMedKode,
  IMedlemskap,
  IUtenlandsopphold,
} from '../../../../models/steg/omDeg/medlemskap';
import { tomPeriode } from '../../../../helpers/tommeSøknadsfelter';
import LeggTilKnapp from '../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Label } from '@navikt/ds-react';

const PeriodeBoddIUtlandet: FC<{
  medlemskap: IMedlemskap;
  settMedlemskap: (medlemskap: IMedlemskap) => void;
  land: ILandMedKode[];
}> = ({ medlemskap, settMedlemskap, land }) => {
  const intl = useLokalIntlContext();
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
    medlemskap?.perioderBoddIUtlandet &&
      medlemskap.perioderBoddIUtlandet.length > 0
      ? medlemskap.perioderBoddIUtlandet
      : [tomtUtenlandsopphold]
  );

  const erForrigePeriodeFyltUt: boolean = perioderBoddIUtlandet.every(
    (utenlandsopphold) => utenlandsopphold.begrunnelse.verdi !== ''
  );

  useEffect(() => {
    settMedlemskap({
      ...medlemskap,
      perioderBoddIUtlandet: perioderBoddIUtlandet,
    });
    // eslint-disable-next-line
  }, [perioderBoddIUtlandet]);

  const leggTilUtenlandsperiode = () => {
    const alleUtenlandsopphold = perioderBoddIUtlandet;
    alleUtenlandsopphold && alleUtenlandsopphold.push(tomtUtenlandsopphold);
    alleUtenlandsopphold &&
      settMedlemskap({
        ...medlemskap,
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
