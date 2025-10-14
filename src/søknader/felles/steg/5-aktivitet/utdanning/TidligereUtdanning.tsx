import React from 'react';
import { UnderUtdanning, Utdanning } from '../../../../../models/steg/aktivitet/utdanning';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import RegistrerUtdanning from './RegistrerUtdanning';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { tidligereUtdanningHjelpetekst, utdanningEtterGrunnskolenSpm } from './UtdanningConfig';
import { lagTomUtdanning } from '../../../../../helpers/steg/utdanning';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { erTidligereUtdanningFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Heading, Label } from '@navikt/ds-react';
import { LesMerTekst } from '../../../../../components/lesmertekst/LesMerTekst';

interface Props {
  underUtdanning: UnderUtdanning;
  settUnderUtdanning: (utdanning: UnderUtdanning) => void;
}

const TidligereUtdanning: React.FC<Props> = ({ underUtdanning, settUnderUtdanning }) => {
  const intl = useLokalIntlContext();
  const tidligereUtdanning: Utdanning[] = underUtdanning.tidligereUtdanning
    ? underUtdanning.tidligereUtdanning
    : [];

  const settTidligereUtdanning = (tidligereUtdanninger: Utdanning[]) => {
    settUnderUtdanning({
      ...underUtdanning,
      tidligereUtdanning: tidligereUtdanninger,
    });
  };

  const leggTilUtdanning = () => {
    const allUtdanning: Utdanning[] = [...tidligereUtdanning, lagTomUtdanning(intl)];
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
          {hentTekst('utdanning.tittel.tidligere', intl)}
        </Heading>
        <LesMerTekst
          åpneTekstid={tidligereUtdanningHjelpetekst.headerTekstid}
          innholdTekstid={tidligereUtdanningHjelpetekst.innholdTekstid}
          html={true}
          testID={'grunn-til-spørsmål-om-tidligere-utdanning'}
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
              <RegistrerUtdanning
                key={utdanning.id}
                tidligereUtdanninger={tidligereUtdanning}
                settTidligereUtdanninger={settTidligereUtdanning}
                utdanningsnummer={index}
                testIder={[
                  'tidligereUtdanning-linje',
                  'tidligereutdanning-fra',
                  'tidligereutdanning-til',
                ]}
              />
            );
          })}
          {erTidligereUtdanningFerdigUtfylt(tidligereUtdanning ? tidligereUtdanning : []) && (
            <KomponentGruppe>
              <FeltGruppe>
                <Label as="p">{hentTekst('utdanning.label.leggtil', intl)}</Label>
                <LeggTilKnapp onClick={() => leggTilUtdanning()}>
                  {hentTekst('utdanning.knapp.leggtil', intl)}
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
