import React from 'react';
import { IUnderUtdanning, IUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../../../language/LocaleTekst';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import LesMerTekst from '../../../../../components/LesMerTekst';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import Utdanning from './Utdanning';
import { hentTekst } from '../../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { tidligereUtdanningHjelpetekst, utdanningEtterGrunnskolenSpm } from './UtdanningConfig';
import { lagTomUtdanning } from '../../../../../helpers/steg/utdanning';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { erTidligereUtdanningFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Heading, Label } from '@navikt/ds-react';
import { JaNeiSpørsmål } from '../../../../../components/spørsmål/JaNeiSpørsmål';

interface Props {
  underUtdanning: IUnderUtdanning;
  settUnderUtdanning: (utdanning: IUnderUtdanning) => void;
}

const TidligereUtdanning: React.FC<Props> = ({ underUtdanning, settUnderUtdanning }) => {
  const intl = useLokalIntlContext();
  const tidligereUtdanning: IUtdanning[] = underUtdanning.tidligereUtdanning
    ? underUtdanning.tidligereUtdanning
    : [];

  const settTidligereUtdanning = (tidligereUtdanninger: IUtdanning[]) => {
    settUnderUtdanning({
      ...underUtdanning,
      tidligereUtdanning: tidligereUtdanninger,
    });
  };

  const leggTilUtdanning = () => {
    const allUtdanning: IUtdanning[] = [...tidligereUtdanning, lagTomUtdanning(intl)];
    settUnderUtdanning({ ...underUtdanning, tidligereUtdanning: allUtdanning });
  };

  const settHarTattUtdanningEtterGrunnskolen = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    const tattUtdanningEtterGrunnskolenFelt = {
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar,
    };

    if (!svar) {
      const endretUtdanning = underUtdanning;
      delete endretUtdanning.tidligereUtdanning;
      settUnderUtdanning({
        ...endretUtdanning,
        [spørsmål.søknadid]: tattUtdanningEtterGrunnskolenFelt,
      });
    } else if (svar) {
      settUnderUtdanning({
        ...underUtdanning,
        [spørsmål.søknadid]: tattUtdanningEtterGrunnskolenFelt,
        tidligereUtdanning: [lagTomUtdanning(intl)],
      });
    }
  };

  return (
    <SeksjonGruppe>
      <KomponentGruppe>
        <Heading size="small" level="3" className={'sentrert'}>
          <LocaleTekst tekst={'utdanning.tittel.tidligere'} />
        </Heading>
        <LesMerTekst
          åpneTekstid={tidligereUtdanningHjelpetekst.headerTekstid}
          innholdTekstid={tidligereUtdanningHjelpetekst.innholdTekstid}
          html={true}
        />
      </KomponentGruppe>

      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={utdanningEtterGrunnskolenSpm(intl)}
          onChange={settHarTattUtdanningEtterGrunnskolen}
          valgtSvar={underUtdanning.harTattUtdanningEtterGrunnskolen?.verdi}
        />
      </KomponentGruppe>
      {underUtdanning.harTattUtdanningEtterGrunnskolen?.verdi && (
        <>
          {tidligereUtdanning?.map((utdanning, index) => {
            return (
              <Utdanning
                key={utdanning.id}
                tidligereUtdanninger={tidligereUtdanning}
                settTidligereUtdanninger={settTidligereUtdanning}
                utdanningsnummer={index}
              />
            );
          })}
          {erTidligereUtdanningFerdigUtfylt(tidligereUtdanning ? tidligereUtdanning : []) && (
            <KomponentGruppe>
              <FeltGruppe>
                <Label as="p">
                  <LocaleTekst tekst={'utdanning.label.leggtil'} />
                </Label>
                <LeggTilKnapp onClick={() => leggTilUtdanning()}>
                  <LocaleTekst tekst={'utdanning.knapp.leggtil'} />
                </LeggTilKnapp>
              </FeltGruppe>
            </KomponentGruppe>
          )}
        </>
      )}
    </SeksjonGruppe>
  );
};

export default TidligereUtdanning;
