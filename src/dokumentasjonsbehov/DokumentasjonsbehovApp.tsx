import React, { useEffect, useState } from 'react';
import Feilside from '../components/feil/Feilside';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { hentMeldingMottatt } from '../utils/søknad';
import { useLocation } from 'react-router-dom';
import {
  autentiseringsInterceptor,
  verifiserAtBrukerErAutentisert,
} from '../utils/autentiseringogvalidering/autentisering';
import { Helmet } from 'react-helmet';
import { erLokaltMedMock } from '../utils/miljø';
import mockDokumentasjonsbehovResponse from '../mock/mockDokumentasjonsbehovResponse.json';
import { Panel } from 'nav-frontend-paneler';
import {
  Normaltekst,
  Sidetittel,
  Systemtittel,
  Undertittel,
} from 'nav-frontend-typografi';
import LocaleTekst from '../language/LocaleTekst';
import AlertStripe from 'nav-frontend-alertstriper';
import { Stønadstype } from '../models/søknad/stønadstyper';
import { hentBannertittel } from '../utils/stønadstype';
import Banner from '../components/Banner';
import { Hovedknapp } from 'nav-frontend-knapper';
import { default as vedleggIkon } from '../assets/vedlegg.svg';
import { IDokumentasjon } from '../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../søknad/DokumentasjonsConfig';

interface IVedlegg {
  id: string;
  navn: string;
}

interface IDokumentasjonsbehov {
  label: string;
  id: string;
  harSendtInn: boolean;
  opplastedeVedlegg: IVedlegg[];
}

enum SøknadType {
  OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
  BARNETILSYN = 'BARNETILSYN',
  SKOLEPENGER = 'SKOLEPENGER',
}

const søknadTypeTilStønadType = (type: SøknadType) => {
  switch (type) {
    case SøknadType.OVERGANGSSTØNAD:
      return Stønadstype.overgangsstønad;
    case SøknadType.BARNETILSYN:
      return Stønadstype.barnetilsyn;
    case SøknadType.SKOLEPENGER:
      return Stønadstype.skolepenger;
    default:
      throw new Error(`Finner ikke søknadsType ${type}`);
  }
};

const søknadTypeTilEttersendelseUrl = (type: SøknadType) => {
  let skjemanummer;
  switch (type) {
    case SøknadType.OVERGANGSSTØNAD:
      skjemanummer = 'NAV%2015-00.01';
      break;
    case SøknadType.BARNETILSYN:
      skjemanummer = 'NAV%2015-00.02';
      break;
    case SøknadType.SKOLEPENGER:
      skjemanummer = 'NAV%2015-00.04';
      break;
    default:
      throw new Error(`Finner ikke søknadsType ${type}`);
  }
  return `https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/${skjemanummer}/dokumentinnsending`;
};

const hentDokumentasjonsConfigInnslagForDokumentasjonsbehov = (
  dokumentasjonsbehov: IDokumentasjonsbehov
): IDokumentasjon =>
  Object.values(DokumentasjonsConfig).filter(
    (dokumentasjon: IDokumentasjon) =>
      dokumentasjon.id === dokumentasjonsbehov.id
  )[0];

interface DokumentasjonsbehovResponse {
  dokumentasjonsbehov: IDokumentasjonsbehov[];
  innsendingstidspunkt: string;
  søknadType: SøknadType;
  personIdent: String;
}

const useQuery = () => new URLSearchParams(useLocation().search);

const DokumentasjonsbehovApp = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const [error, settError] = useState<boolean>(false);
  const [
    dokumentasjonsbehovResponse,
    settDokumentasjonsbehovResponse,
  ] = useState<DokumentasjonsbehovResponse>();
  let query = useQuery().get('soknad');
  const søknadId = query !== null ? query.toString() : '';

  autentiseringsInterceptor();

  useEffect(() => {
    verifiserAtBrukerErAutentisert(settAutentisering);
  }, [autentisert]);

  const fetchMeldingMottatt = () => {
    return hentMeldingMottatt(søknadId)
      .then((response) => {
        settDokumentasjonsbehovResponse(response);
      })
      .catch(() => settError(true));
  };

  useEffect(() => {
    if (erLokaltMedMock()) {
      // @ts-ignore
      settDokumentasjonsbehovResponse(mockDokumentasjonsbehovResponse);
      settFetching(false);
      return;
    }
    if (søknadId === '') {
      settError(true);
      return;
    }

    Promise.all([fetchMeldingMottatt()])
      .then(() => settFetching(false))
      .catch(() => settFetching(false));
    // eslint-disable-next-line
  }, []);

  if (!fetching && autentisert) {
    if (!error && dokumentasjonsbehovResponse) {
      const manglendeVedlegg = dokumentasjonsbehovResponse.dokumentasjonsbehov.filter(
        (it) => !it.harSendtInn && it.opplastedeVedlegg.length === 0
      );

      const harAlleredeSendtInn = dokumentasjonsbehovResponse.dokumentasjonsbehov.filter(
        (it) => it.harSendtInn
      );

      const vedlegg = dokumentasjonsbehovResponse.dokumentasjonsbehov.filter(
        (it) => it.opplastedeVedlegg.length > 0
      );
      return (
        <>
          <Helmet>
            <title>Dokumentasjonsbehov</title>
          </Helmet>

          <div className={'dokumentasjonsbehov'}>
            <Banner
              tekstid={hentBannertittel(
                søknadTypeTilStønadType(dokumentasjonsbehovResponse.søknadType)
              )}
            />

            <main className={'dokumentasjonsbehov__innhold'}>
              <Panel className={'dokumentasjonsbehov__panel'}>
                <Sidetittel>Dokumentasjon til søknaden</Sidetittel>
                <div className="seksjon">
                  <Normaltekst>
                    Det ser ut til at det mangler noe dokumentasjon i søknaden
                    du har sendt oss. Hvis du i mellomtiden har sendt oss dette,
                    kan du se bort fra denne meldingen.
                  </Normaltekst>
                </div>

                {manglendeVedlegg && (
                  <div className="seksjon">
                    <Systemtittel>
                      Dokumentasjon som ikke ble sendt inn sammen med søknaden
                    </Systemtittel>
                    {manglendeVedlegg.map((it) => {
                      const dokumentasjonsConfig = hentDokumentasjonsConfigInnslagForDokumentasjonsbehov(
                        it
                      );
                      return (
                        <AlertStripe
                          type={'advarsel'}
                          form={'inline'}
                          className={'tekstblokk'}
                          key={it.id}
                        >
                          <div>
                            <Undertittel>
                              <LocaleTekst
                                tekst={dokumentasjonsConfig.tittel}
                              />
                            </Undertittel>
                            {dokumentasjonsConfig.beskrivelse && (
                              <Normaltekst>
                                <LocaleTekst
                                  tekst={dokumentasjonsConfig.beskrivelse}
                                />
                              </Normaltekst>
                            )}
                          </div>
                        </AlertStripe>
                      );
                    })}

                    <Hovedknapp
                      onClick={() => {
                        window.location.href = søknadTypeTilEttersendelseUrl(
                          dokumentasjonsbehovResponse?.søknadType
                        );
                      }}
                    >
                      Ettersend dokumentasjon
                    </Hovedknapp>
                  </div>
                )}

                {vedlegg && (
                  <div className="seksjon">
                    <Systemtittel>
                      Dokumentasjon som ble sendt inn sammen med søknaden
                    </Systemtittel>

                    {vedlegg.map(
                      (dokumentasjonsbehov: IDokumentasjonsbehov) => (
                        <AlertStripe
                          type={'suksess'}
                          form={'inline'}
                          key={dokumentasjonsbehov.id}
                        >
                          <div>
                            <Undertittel>
                              <LocaleTekst
                                tekst={
                                  hentDokumentasjonsConfigInnslagForDokumentasjonsbehov(
                                    dokumentasjonsbehov
                                  ).tittel
                                }
                              />
                            </Undertittel>
                            {dokumentasjonsbehov.opplastedeVedlegg.map(
                              (fil) => (
                                <div className="fil" key={fil.id}>
                                  <img
                                    className="vedleggsikon"
                                    src={vedleggIkon}
                                    alt="Vedleggsikon"
                                  />
                                  <Normaltekst className="filnavn">
                                    {fil.navn}
                                  </Normaltekst>
                                </div>
                              )
                            )}
                          </div>
                        </AlertStripe>
                      )
                    )}
                  </div>
                )}

                {harAlleredeSendtInn && (
                  <div className="seksjon">
                    <Systemtittel>
                      Dokumentasjon du har oppgitt at du tidligere har sendt inn
                      til oss
                    </Systemtittel>

                    {harAlleredeSendtInn.map(
                      (dokumentasjonsbehov: IDokumentasjonsbehov) => (
                        <AlertStripe
                          type={'suksess'}
                          form={'inline'}
                          key={dokumentasjonsbehov.id}
                          className={'tekstblokk'}
                        >
                          <div>
                            <Undertittel>
                              <LocaleTekst
                                tekst={
                                  hentDokumentasjonsConfigInnslagForDokumentasjonsbehov(
                                    dokumentasjonsbehov
                                  ).tittel
                                }
                              />
                            </Undertittel>
                          </div>
                        </AlertStripe>
                      )
                    )}
                  </div>
                )}
              </Panel>
            </main>
          </div>
        </>
      );
    } else if (error) {
      return <Feilside />;
    } else {
      return <NavFrontendSpinner className="spinner" />;
    }
  } else {
    return <NavFrontendSpinner className="spinner" />;
  }
};

export default DokumentasjonsbehovApp;
