import React, { useEffect, useState } from 'react';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import { SlettKnapp } from '../../../../../components/knapper/SlettKnapp';
import { TittelOgSlettKnapp } from '../../../../../components/knapper/TittelOgSlettKnapp';
import { hentTekst } from '../../../../../utils/søknad';
import { hentTittelMedNr } from '../../../../../language/utils';
import { IUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { linjeKursGrad } from './UtdanningConfig';
import { tomPeriode } from '../../../../../helpers/tommeSøknadsfelter';
import { harValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { EPeriode } from '../../../../../models/felles/periode';
import PeriodeÅrMånedvelgere from '../../../../../components/dato/PeriodeÅrMånedvelgere';
import { DatoBegrensning } from '../../../../../components/dato/Datovelger';
import { formatIsoDate } from '../../../../../utils/dato';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Heading } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../../components/TextFieldMedBredde';

interface Props {
  tidligereUtdanninger: IUtdanning[];
  settTidligereUtdanninger: (tidligereUtdanninger: IUtdanning[]) => void;
  utdanningsnummer: number;
  testIder?: string[];
}

const Utdanning: React.FC<Props> = ({
  tidligereUtdanninger,
  settTidligereUtdanninger,
  utdanningsnummer,
  testIder,
}) => {
  const intl = useLokalIntlContext();
  const utdanningFraSøknad = tidligereUtdanninger?.find(
    (utdanning, index) => index === utdanningsnummer && utdanning
  );

  const [utdanning, settUtdanning] = useState<IUtdanning>(utdanningFraSøknad!);

  useEffect(() => {
    const endretTidligereUtdanninger = tidligereUtdanninger?.map(
      (tidligereUtdanningFraSøknad, index) => {
        if (index === utdanningsnummer) return utdanning;
        else return tidligereUtdanningFraSøknad;
      }
    );
    endretTidligereUtdanninger && settTidligereUtdanninger(endretTidligereUtdanninger);
    // eslint-disable-next-line
  }, [utdanning]);

  const linjeKursGradLabel = hentTekst(linjeKursGrad.label_tekstid, intl);

  const fjernUtdanning = () => {
    if (tidligereUtdanninger && tidligereUtdanninger.length > 1) {
      const endretUtdanning = tidligereUtdanninger?.filter(
        (arbeidsgiver, index) => index !== utdanningsnummer
      );
      settTidligereUtdanninger(endretUtdanning);
    }
  };

  const settInputFelt = (label: string, e: React.FormEvent<HTMLInputElement>) => {
    settUtdanning({
      ...utdanning,
      linjeKursGrad: { label: label, verdi: e.currentTarget.value },
    });
  };

  const settPeriode = (dato: Date | null, nøkkel: EPeriode): void => {
    utdanning.periode &&
      settUtdanning({
        ...utdanning,
        periode: {
          ...utdanning.periode,
          label: hentTekst('utdanning.datovelger.studieperiode', intl),
          [nøkkel]: {
            label: hentTekst('periode.' + nøkkel, intl),
            verdi: dato && formatIsoDate(dato),
          },
        },
      });
  };

  const utdanningTittel = hentTittelMedNr(
    tidligereUtdanninger!,
    utdanningsnummer,
    intl.formatMessage({ id: 'utdanning.undertittel' })
  );

  const skalViseSlettKnapp = tidligereUtdanninger?.length > 1;

  return (
    <KomponentGruppe>
      <TittelOgSlettKnapp justify="space-between" align="center">
        <Heading size="small" level="4" className={'tittel'}>
          {utdanningTittel}
        </Heading>
        {skalViseSlettKnapp && (
          <SlettKnapp onClick={() => fjernUtdanning()} tekstid={'utdanning.knapp.slett'} />
        )}
      </TittelOgSlettKnapp>
      <FeltGruppe aria-live="polite">
        <TextFieldMedBredde
          key={linjeKursGrad.id}
          label={linjeKursGradLabel}
          type="text"
          value={utdanning.linjeKursGrad?.verdi}
          bredde={'XL'}
          onChange={(e) => settInputFelt(linjeKursGradLabel, e)}
          data-testid={testIder ? testIder[0] : undefined}
        />
      </FeltGruppe>
      {harValgtSvar(utdanning.linjeKursGrad?.verdi) && (
        <KomponentGruppe>
          <PeriodeÅrMånedvelgere
            tekst={hentTekst('utdanning.datovelger.studieperiode', intl)}
            periode={utdanning.periode ? utdanning.periode : tomPeriode}
            settDato={settPeriode}
            aria-live="polite"
            datobegrensing={DatoBegrensning.FemtiÅrTidligereOgSeksMånederFrem}
            testIder={testIder ? [testIder[1], testIder[2]] : undefined}
          />
        </KomponentGruppe>
      )}
    </KomponentGruppe>
  );
};

export default Utdanning;
