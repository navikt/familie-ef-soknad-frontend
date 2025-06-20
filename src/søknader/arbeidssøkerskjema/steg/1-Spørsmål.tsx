import React, { FC } from 'react';
import Side from '../side/Side';
import { useLocation, useNavigate } from 'react-router-dom';
import { hentTekst } from '../../../utils/søknad';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import JaNeiSpørsmål from '../../../components/spørsmål/JaNeiSpørsmål';
import {
  erSøkerArbeidssøker,
  erVilligTilÅTaImotTilbud,
  kanBegynneInnenEnUke,
  ønskerHalvStilling,
  ønsketArbeidssted,
} from '../../felles/steg/5-aktivitet/arbeidssøker/ArbeidssøkerConfig';
import LocaleTekst from '../../../language/LocaleTekst';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import { ESvar, ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import { hentBooleanFraValgtSvar } from '../../../utils/spørsmålogsvar';
import { useSkjema } from '../SkjemaContext';
import MultiSvarSpørsmål from '../../../components/spørsmål/MultiSvarSpørsmål';
import {
  ERouteArbeidssøkerskjema,
  RoutesArbeidssokerskjema,
} from '../routes/routesArbeidssokerskjema';
import { hentPath } from '../../../utils/routing';
import { logSidevisningArbeidssokerskjema } from '../../../utils/amplitude';
import { useMount } from '../../../utils/hooks';
import { kommerFraOppsummeringen } from '../../../utils/locationState';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Alert, BodyShort, Button, Label } from '@navikt/ds-react';

const Spørsmål: FC<{ ident: string }> = ({ ident }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  const { skjema, settSkjema } = useSkjema();
  const [arbeidssøker, settArbeidssøker] = React.useState(skjema.arbeidssøker);

  useMount(() => logSidevisningArbeidssokerskjema('OmArbeidssoker'));

  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);

  React.useEffect(() => {
    settSkjema({ ...skjema, arbeidssøker: arbeidssøker });
    // eslint-disable-next-line
  }, [arbeidssøker]);

  const settJaNeiSpørsmål = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    settArbeidssøker({
      ...arbeidssøker,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar,
      },
    });
  };

  const settMultiSvarSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
    settArbeidssøker({
      ...arbeidssøker,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
    });
  };

  return (
    <Side
      tittel={intl.formatMessage({ id: 'skjema.tittel.omarbeidssøker' })}
      erSpørsmålBesvart={arbeidssøker.ønskerSøker50ProsentStilling?.verdi !== undefined}
      skalViseKnapper={!kommerFraOppsummering}
    >
      <SeksjonGruppe>
        <FeltGruppe>
          <Label as="p">
            <LocaleTekst tekst={'person.ident.visning'} />
          </Label>
          <BodyShort>{ident}</BodyShort>
        </FeltGruppe>
        <KomponentGruppe>
          <JaNeiSpørsmål
            spørsmål={erSøkerArbeidssøker(intl)}
            onChange={settJaNeiSpørsmål}
            valgtSvar={arbeidssøker.registrertSomArbeidssøkerNav?.verdi}
          />
          {arbeidssøker.registrertSomArbeidssøkerNav?.verdi === false && (
            <Alert size="small" variant={'info'} inline>
              <LocaleTekst tekst={'skjema.alert.registrert'} />
            </Alert>
          )}
        </KomponentGruppe>

        {arbeidssøker.registrertSomArbeidssøkerNav && (
          <KomponentGruppe>
            <JaNeiSpørsmål
              spørsmål={erVilligTilÅTaImotTilbud(intl)}
              onChange={settJaNeiSpørsmål}
              valgtSvar={arbeidssøker.villigTilÅTaImotTilbudOmArbeid?.verdi}
            />
            {arbeidssøker.villigTilÅTaImotTilbudOmArbeid?.svarid === ESvar.NEI && (
              <Alert size="small" variant={'warning'} inline>
                <LocaleTekst tekst={'arbeidssøker.alert.villig'} />
              </Alert>
            )}
          </KomponentGruppe>
        )}
        {arbeidssøker.villigTilÅTaImotTilbudOmArbeid && (
          <KomponentGruppe>
            <JaNeiSpørsmål
              spørsmål={kanBegynneInnenEnUke(intl)}
              onChange={settJaNeiSpørsmål}
              valgtSvar={arbeidssøker.kanBegynneInnenEnUke?.verdi}
            />
          </KomponentGruppe>
        )}
        {arbeidssøker.kanBegynneInnenEnUke && (
          <KomponentGruppe>
            <MultiSvarSpørsmål
              spørsmål={ønsketArbeidssted(intl)}
              settSpørsmålOgSvar={settMultiSvarSpørsmål}
              valgtSvar={arbeidssøker.hvorØnskerSøkerArbeid?.verdi}
            />
          </KomponentGruppe>
        )}
        {arbeidssøker.hvorØnskerSøkerArbeid && (
          <KomponentGruppe>
            <JaNeiSpørsmål
              spørsmål={ønskerHalvStilling(intl)}
              onChange={settJaNeiSpørsmål}
              valgtSvar={arbeidssøker.ønskerSøker50ProsentStilling?.verdi}
            />
          </KomponentGruppe>
        )}
      </SeksjonGruppe>
      {kommerFraOppsummering ? (
        <Button
          variant="primary"
          className="tilbake-til-oppsummering"
          onClick={() =>
            navigate({
              pathname: hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Oppsummering),
            })
          }
        >
          {hentTekst('oppsummering.tilbake', intl)}
        </Button>
      ) : null}
    </Side>
  );
};

export default Spørsmål;
