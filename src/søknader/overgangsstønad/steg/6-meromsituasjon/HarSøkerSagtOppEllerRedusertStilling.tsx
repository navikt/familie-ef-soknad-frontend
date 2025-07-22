import React from 'react';
import {
  ESagtOppEllerRedusertStilling,
  IDinSituasjon,
} from '../../../../models/steg/dinsituasjon/meromsituasjon';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import { hentTekst } from '../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { SagtOppEllerRedusertStillingSpm } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { isAfter, isBefore, subMonths } from 'date-fns';
import { dagensDato, strengTilDato } from '../../../../utils/dato';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { Alert, Textarea } from '@navikt/ds-react';
import { DatoBegrensning, Datovelger } from '../../../../components/dato/Datovelger';

interface Props {
  dinSituasjon: IDinSituasjon;
  settDinSituasjon: (dinSituasjon: IDinSituasjon) => void;
}

const HarSøkerSagtOppEllerRedusertStilling: React.FC<Props> = ({
  dinSituasjon,
  settDinSituasjon,
}) => {
  const intl = useLokalIntlContext();
  const { settDokumentasjonsbehov } = useOvergangsstønadSøknad();
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
        label: datovelgerLabel,
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
    const svarTekst: string = intl.formatMessage({ id: tekstid });
    return sagtOppEllerRedusertStilling?.verdi === svarTekst;
  };

  const hentLabelForSagtOppEllerRedusertStilling = (
    sagtOppLabel: string,
    redusertStillingLabel: string
  ) => {
    if (harSagtOpp) return hentTekst(sagtOppLabel, intl);
    else if (harRedusertStilling) return hentTekst(redusertStillingLabel, intl);
    else return '';
  };

  const harSagtOpp = erSagtOppEllerRedusertStillingValgt(ESagtOppEllerRedusertStilling.sagtOpp);
  const harRedusertStilling = erSagtOppEllerRedusertStillingValgt(
    ESagtOppEllerRedusertStilling.redusertStilling
  );
  const valgtSvarNei = hentTekst('svar.nei', intl);

  const erValgtDatoMindreEnn6mndSiden =
    datoSagtOppEllerRedusertStilling &&
    valgtDatoMindreEnn6mndSiden(strengTilDato(datoSagtOppEllerRedusertStilling.verdi));

  const alertLabel = hentLabelForSagtOppEllerRedusertStilling(
    'dinSituasjon.alert.sagtOpp',
    'dinSituasjon.alert.redusertStilling'
  );
  const begrunnelseLabel = hentLabelForSagtOppEllerRedusertStilling(
    'dinSituasjon.fritekst.sagtOpp',
    'dinSituasjon.fritekst.redusertStilling'
  );
  const datovelgerLabel = hentLabelForSagtOppEllerRedusertStilling(
    'sagtOppEllerRedusertStilling.datovelger.sagtOpp',
    'sagtOppEllerRedusertStilling.datovelger.redusertStilling'
  );

  const valgtDatoMindreEnn6mndSidenAlert = hentLabelForSagtOppEllerRedusertStilling(
    'sagtOppEllerRedusertStilling.datovelger-alert.sagtOpp',
    'dinSituasjon.datovelger-alert.redusertStilling'
  );

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
            <AlertStripeDokumentasjon>{hentTekst(alertLabel, intl)}</AlertStripeDokumentasjon>
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
                tekstid={datovelgerLabel}
                datobegrensning={DatoBegrensning.TidligereDatoer}
                settDato={settDato}
              />
              {erValgtDatoMindreEnn6mndSiden && (
                <Alert size="small" variant="info" inline>
                  {hentTekst(valgtDatoMindreEnn6mndSidenAlert, intl)}
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
