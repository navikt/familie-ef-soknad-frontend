import React from 'react';
import { ESagtOppEllerRedusertStilling } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { SagtOppEllerRedusertStillingSpm } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { isAfter, isBefore, subMonths } from 'date-fns';
import { dagensDato, strengTilDato } from '../../../../utils/dato';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { Alert, Textarea } from '@navikt/ds-react';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import { useMerOmDinSituasjon } from './MerOmDinSituasjonContext';

const HarSøkerSagtOppEllerRedusertStilling: React.FC = () => {
  const intl = useLokalIntlContext();

  const { settDokumentasjonsbehov, dinSituasjon, settDinSituasjon } = useMerOmDinSituasjon();

  const {
    datoSagtOppEllerRedusertStilling,
    begrunnelseSagtOppEllerRedusertStilling,
    sagtOppEllerRedusertStilling,
  } = dinSituasjon;

  const settSagtOppEllerRedusertStilling = (spørsmål: ISpørsmål, svar: ISvar) => {
    const valgtSvar = {
      spørsmålid: spørsmål.søknadid,
      svarid: svar.id,
      label: hentTekst(spørsmål.tekstid, intl),
      verdi: svar.svar_tekst,
    };

    if (
      valgtSvarNei &&
      (datoSagtOppEllerRedusertStilling || begrunnelseSagtOppEllerRedusertStilling)
    ) {
      const endretSituasjon = dinSituasjon;
      delete endretSituasjon.datoSagtOppEllerRedusertStilling;
      delete endretSituasjon.begrunnelseSagtOppEllerRedusertStilling;
      settDinSituasjon({
        ...endretSituasjon,
        sagtOppEllerRedusertStilling: valgtSvar,
      });
    } else {
      settDinSituasjon({
        ...dinSituasjon,
        sagtOppEllerRedusertStilling: valgtSvar,
      });
    }

    settDokumentasjonsbehov(spørsmål, svar);
  };

  const settBegrunnelse = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    settDinSituasjon({
      ...dinSituasjon,
      begrunnelseSagtOppEllerRedusertStilling: {
        label: begrunnelseLabel,
        verdi: e.currentTarget.value,
      },
    });
  };

  const settDato = (dato: string): void => {
    settDinSituasjon({
      ...dinSituasjon,
      datoSagtOppEllerRedusertStilling: {
        label: hentTekst(datovelgerLabelId, intl),
        verdi: dato,
      },
    });
  };

  const valgtDatoMindreEnn6mndSiden = (valgtDato: Date) => {
    const seksMndSidenDato = subMonths(dagensDato, 6);
    return isAfter(valgtDato, seksMndSidenDato) && isBefore(valgtDato, dagensDato);
  };

  const erSagtOppEllerRedusertStillingValgt = (valgtSvar: ESagtOppEllerRedusertStilling) => {
    const tekstid: string = 'dinSituasjon.svar.' + valgtSvar;
    const svarTekst: string = hentTekst(tekstid, intl);
    return sagtOppEllerRedusertStilling?.verdi === svarTekst;
  };

  const harSagtOpp = erSagtOppEllerRedusertStillingValgt(ESagtOppEllerRedusertStilling.sagtOpp);
  const harRedusertStilling = erSagtOppEllerRedusertStillingValgt(
    ESagtOppEllerRedusertStilling.redusertStilling
  );
  const valgtSvarNei = hentTekst('svar.nei', intl);

  const erValgtDatoMindreEnn6mndSiden =
    datoSagtOppEllerRedusertStilling &&
    valgtDatoMindreEnn6mndSiden(strengTilDato(datoSagtOppEllerRedusertStilling.verdi));

  const alertLabelId = harSagtOpp
    ? 'dinSituasjon.alert.sagtOpp'
    : 'dinSituasjon.alert.redusertStilling';

  const begrunnelseLabel = harSagtOpp
    ? hentTekst('dinSituasjon.fritekst.sagtOpp', intl)
    : hentTekst('dinSituasjon.fritekst.redusertStilling', intl);

  const datovelgerLabelId = harSagtOpp
    ? 'sagtOppEllerRedusertStilling.datovelger.sagtOpp'
    : 'sagtOppEllerRedusertStilling.datovelger.redusertStilling';

  const valgtDatoMindreEnn6mndSidenAlertId = harSagtOpp
    ? 'sagtOppEllerRedusertStilling.datovelger-alert.sagtOpp'
    : 'dinSituasjon.datovelger-alert.redusertStilling';

  return (
    <>
      <MultiSvarSpørsmål
        spørsmål={SagtOppEllerRedusertStillingSpm(intl)}
        settSpørsmålOgSvar={settSagtOppEllerRedusertStilling}
        valgtSvar={sagtOppEllerRedusertStilling?.verdi}
      />
      {(harSagtOpp || harRedusertStilling) && (
        <>
          <KomponentGruppe>
            <AlertStripeDokumentasjon>{hentHTMLTekst(alertLabelId, intl)}</AlertStripeDokumentasjon>
          </KomponentGruppe>
          <KomponentGruppe>
            <Textarea
              autoComplete={'off'}
              label={begrunnelseLabel}
              value={
                begrunnelseSagtOppEllerRedusertStilling
                  ? begrunnelseSagtOppEllerRedusertStilling.verdi
                  : ''
              }
              maxLength={1000}
              onChange={(e) => settBegrunnelse(e)}
            />
          </KomponentGruppe>
          {begrunnelseSagtOppEllerRedusertStilling && (
            <KomponentGruppe>
              <Datovelger
                valgtDato={datoSagtOppEllerRedusertStilling?.verdi}
                tekstid={datovelgerLabelId}
                gyldigeDatoer={GyldigeDatoer.Tidligere}
                settDato={settDato}
              />
              {erValgtDatoMindreEnn6mndSiden && (
                <Alert size="small" variant="info" inline>
                  {hentTekst(valgtDatoMindreEnn6mndSidenAlertId, intl)}
                </Alert>
              )}
            </KomponentGruppe>
          )}
        </>
      )}
    </>
  );
};

export default HarSøkerSagtOppEllerRedusertStilling;
