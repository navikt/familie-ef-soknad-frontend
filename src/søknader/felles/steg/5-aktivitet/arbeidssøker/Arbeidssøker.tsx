import React, { useEffect, useState } from 'react';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import {
  erSøkerArbeidssøker,
  erVilligTilÅTaImotTilbud,
  kanBegynneInnenEnUke,
  ønskerHalvStilling,
  ønsketArbeidssted,
} from './ArbeidssøkerConfig';
import { IArbeidssøker } from '../../../../../models/steg/aktivitet/arbeidssøker';
import { ESvar, ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../../../components/spørsmål/MultiSvarSpørsmål';
import { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { hentSvarAlertFraSpørsmål } from '../../../../../utils/søknad';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Alert, Heading } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

const Arbeidssøker: React.FC<Props> = ({
  arbeidssituasjon,
  settArbeidssituasjon,
  settDokumentasjonsbehov,
}) => {
  const intl = useLokalIntlContext();
  const [arbeidssøker, settArbeidssøker] = useState<IArbeidssøker>(
    arbeidssituasjon.arbeidssøker ? arbeidssituasjon.arbeidssøker : {}
  );

  useEffect(() => {
    settArbeidssituasjon({ ...arbeidssituasjon, arbeidssøker: arbeidssøker });
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

    settDokumentasjonsbehov(spørsmål, valgtSvar);
  };

  const settMultiSvarSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
    settArbeidssøker({
      ...arbeidssøker,
      [spørsmål.søknadid]: {
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: svar.svar_tekst,
      },
    });
  };

  const registrertSomArbeidssøkerAlert = hentSvarAlertFraSpørsmål(
    ESvar.NEI,
    erSøkerArbeidssøker(intl)
  );

  return (
    <SeksjonGruppe>
      <KomponentGruppe>
        <Heading size="small" level="3" className={'sentrert'}>
          {hentTekst('arbeidssøker.tittel', intl)}
        </Heading>
      </KomponentGruppe>

      <KomponentGruppe>
        <JaNeiSpørsmål
          spørsmål={erSøkerArbeidssøker(intl)}
          onChange={settJaNeiSpørsmål}
          valgtSvar={arbeidssøker.registrertSomArbeidssøkerNav?.verdi}
        />
        {arbeidssøker.registrertSomArbeidssøkerNav?.svarid === ESvar.NEI && (
          <Alert size="small" variant="info" inline>
            {hentTekst(registrertSomArbeidssøkerAlert, intl)}
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
            <AlertStripeDokumentasjon>
              {hentTekst('arbeidssøker.alert.villig', intl)}
            </AlertStripeDokumentasjon>
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
          {arbeidssøker.kanBegynneInnenEnUke?.svarid === ESvar.NEI && (
            <Alert size="small" variant={'warning'} inline>
              {hentTekst('arbeidssøker.alert.senestEnUke', intl)}
            </Alert>
          )}
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
          {arbeidssøker.ønskerSøker50ProsentStilling?.svarid === ESvar.NEI && (
            <Alert size="small" variant={'warning'} inline>
              {hentTekst('arbeidssøker.alert.halvstilling', intl)}
            </Alert>
          )}
        </KomponentGruppe>
      )}
    </SeksjonGruppe>
  );
};

export default Arbeidssøker;
