import { FC, useEffect, useState } from 'react';
import { Utenlandsopphold } from './Utenlandsopphold';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { ILandMedKode, IUtenlandsopphold } from '../../../../../models/steg/omDeg/medlemskap';
import { tomPeriode } from '../../../../../helpers/tommeSøknadsfelter';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Heading, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../OmDegContext';

export const PeriodeBoddIUtlandet: FC<{
  land: ILandMedKode[];
}> = ({ land }) => {
  const intl = useLokalIntlContext();
  const { medlemskap, settMedlemskap } = useOmDeg();
  const tomtUtenlandsopphold: IUtenlandsopphold = {
    id: hentUid(),
    periode: tomPeriode,
    erEøsLand: true,
    begrunnelse: {
      label: hentTekst('medlemskap.periodeBoddIUtlandet.begrunnelse', intl),
      verdi: '',
    },
  };
  const [perioderBoddIUtlandet, settPerioderBoddIUtlandet] = useState<IUtenlandsopphold[]>(
    medlemskap?.perioderBoddIUtlandet && medlemskap.perioderBoddIUtlandet.length > 0
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
    <VStack gap="6">
      {perioderBoddIUtlandet.map((periode, index) => (
        <Utenlandsopphold
          key={periode.id}
          settPeriodeBoddIUtlandet={settPerioderBoddIUtlandet}
          perioderBoddIUtlandet={perioderBoddIUtlandet}
          utenlandsopphold={periode}
          oppholdsnr={index}
          land={land}
        />
      ))}

      {erForrigePeriodeFyltUt && (
        <VStack gap="6">
          <Heading size={'xsmall'}>
            {hentTekst('medlemskap.periodeBoddIUtlandet.flereutenlandsopphold', intl)}
          </Heading>
          <div>
            <LeggTilKnapp onClick={leggTilUtenlandsperiode}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </LeggTilKnapp>
          </div>
        </VStack>
      )}
    </VStack>
  );
};
