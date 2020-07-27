import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Side from '../../../components/side/Side';
import CheckboxSpørsmål from '../../../components/spørsmål/CheckboxSpørsmål';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import { ISpørsmål, ISvar } from '../../../models/spørsmålogsvar';
import { hentTekst } from '../../../utils/søknad';
import { useHistory, useLocation } from 'react-router-dom';
import { Hovedknapp } from 'nav-frontend-knapper';
import { returnerAvhukedeSvar } from '../../../utils/spørsmålogsvar';
import {
  filtrerAktivitetSvaralternativer,
  fjernAktivitet,
} from '../../../helpers/steg/aktivitet';
import { erAktivitetSeksjonFerdigUtfylt } from '../../../helpers/steg/aktivitetvalidering';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { ErDuIArbeidSpm, hvaErDinArbeidssituasjonSpm } from './AktivitetConfig';
import AktivitetOppfølgingSpørsmål from './AktivitetOppfølgingSpørsmål';
import { IAktivitet } from '../../../models/steg/aktivitet/aktivitet';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmål from '../../../components/spørsmål/MultiSvarSpørsmål';

const Aktivitet: React.FC = () => {
  const intl = useIntl();
  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
    mellomlagreOvergangsstønad,
  } = useBarnetilsynSøknad();
  const history = useHistory();
  const location = useLocation();
  const [arbeidssituasjon, settArbeidssituasjon] = useState<IAktivitet>(
    søknad?.aktivitet
  );
  const { hvaErDinArbeidssituasjon } = arbeidssituasjon;
  const kommerFraOppsummering = location.state?.kommerFraOppsummering;

  useEffect(() => {
    settSøknad({ ...søknad, aktivitet: arbeidssituasjon });
    // eslint-disable-next-line
  }, [arbeidssituasjon]);

  const oppdaterArbeidssituasjon = (nyArbeidssituasjon: IAktivitet) => {
    settArbeidssituasjon({ ...arbeidssituasjon, ...nyArbeidssituasjon });
  };

  const settErDuIArbeid = (spørsmål: ISpørsmål, svar: ISvar) => {
    oppdaterArbeidssituasjon({
      ...arbeidssituasjon,
      erIArbeid: {
        spørsmålid: spørsmål.søknadid,
        svarid: svar.id,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: hentTekst(svar.svar_tekstid, intl),
      },
    });
  };

  const settArbeidssituasjonFelt = (
    spørsmål: ISpørsmål,
    svarHuketAv: boolean,
    svar: ISvar
  ) => {
    const { avhukedeSvar, svarider } = returnerAvhukedeSvar(
      hvaErDinArbeidssituasjon,
      svarHuketAv,
      svar,
      intl
    );

    const endretArbeidssituasjon = fjernAktivitet(svarider, arbeidssituasjon);

    oppdaterArbeidssituasjon({
      ...endretArbeidssituasjon,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: svarider,
        label: hentTekst(spørsmål.tekstid, intl),
        verdi: avhukedeSvar,
      },
    });
    settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
  };

  const erAlleFelterUtfylt = hvaErDinArbeidssituasjon.svarid.every((id) =>
    erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon)
  );

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    hvaErDinArbeidssituasjon?.svarid.length !== 0 && erAlleFelterUtfylt;

  const erSpørsmålFørAktivitetBesvart = (
    svarid: string,
    arbeidssituasjon: IAktivitet
  ) => {
    const svaridPos = arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid.indexOf(
      svarid
    );
    return (
      svaridPos &&
      arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid
        .filter((aktivitet, index) => index < svaridPos)
        .every((id) => erAktivitetSeksjonFerdigUtfylt(id, arbeidssituasjon))
    );
  };

  return (
    <Side
      tittel={intl.formatMessage({ id: 'stegtittel.arbeidssituasjon' })}
      skalViseKnapper={!kommerFraOppsummering}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      mellomlagreOvergangsstønad={mellomlagreOvergangsstønad}
    >
      <SeksjonGruppe>
        <KomponentGruppe>
          <MultiSvarSpørsmål
            spørsmål={ErDuIArbeidSpm}
            settSpørsmålOgSvar={settErDuIArbeid}
            valgtSvar={arbeidssituasjon?.erIArbeid?.verdi}
          />
        </KomponentGruppe>
        {arbeidssituasjon.erIArbeid?.verdi && (
          <KomponentGruppe>
            <CheckboxSpørsmål
              spørsmål={filtrerAktivitetSvaralternativer(
                søknad.person,
                hvaErDinArbeidssituasjonSpm
              )}
              settValgteSvar={settArbeidssituasjonFelt}
              valgteSvar={
                hvaErDinArbeidssituasjon?.verdi
                  ? hvaErDinArbeidssituasjon?.verdi
                  : []
              }
            />
          </KomponentGruppe>
        )}
      </SeksjonGruppe>

      {arbeidssituasjon.hvaErDinArbeidssituasjon?.svarid.map(
        (svarid, index) => {
          const harValgtMinstEnAktivitet =
            hvaErDinArbeidssituasjon?.svarid.length !== 0;

          const erValgtFørsteAktivitet =
            hvaErDinArbeidssituasjon?.svarid[0] === svarid;

          const visSeksjon = harValgtMinstEnAktivitet
            ? !erValgtFørsteAktivitet
              ? erSpørsmålFørAktivitetBesvart(svarid, arbeidssituasjon)
              : true
            : true;

          return (
            visSeksjon && (
              <AktivitetOppfølgingSpørsmål
                key={index}
                svarid={svarid}
                arbeidssituasjon={arbeidssituasjon}
                settArbeidssituasjon={settArbeidssituasjon}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
              />
            )
          );
        }
      )}

      {kommerFraOppsummering &&
      erSisteSpørsmålBesvartOgMinstEttAlternativValgt ? (
        <div className={'side'}>
          <Hovedknapp
            className="tilbake-til-oppsummering"
            onClick={() =>
              history.push({
                pathname: '/oppsummering',
              })
            }
          >
            {hentTekst('oppsummering.tilbake', intl)}
          </Hovedknapp>
        </div>
      ) : null}
    </Side>
  );
};

export default Aktivitet;
