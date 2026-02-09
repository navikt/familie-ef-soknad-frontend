import { FC } from 'react';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { IBarn } from '../../../../models/steg/barn';
import { BarnepassOrdning, EÅrsakBarnepass, IBarnepass } from '../../models/barnepass';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { årsakBarnepass } from './BarnepassConfig';
import { Alert, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useBarnepass } from './BarnepassContext';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

interface Props {
  barn: IBarn;
  settBarnepass: (barnepass: IBarnepass, barneid: string) => void;
}

export const ÅrsakBarnepass: FC<Props> = ({ barn, settBarnepass }) => {
  const intl = useLokalIntlContext();
  const { settDokumentasjonsbehovForBarn } = useBarnepass();
  const { barnepass } = barn;

  const årsakBarnepassConfig = årsakBarnepass(intl);

  const spørsmålTekstMedNavn = hentBarnNavnEllerBarnet(barn, årsakBarnepassConfig.tekstid, intl);
  const barnepassordningerListe: BarnepassOrdning[] = barnepass?.barnepassordninger
    ? barnepass.barnepassordninger
    : [{ id: hentUid() }];

  const valgtÅrsak = barnepass?.årsakBarnepass?.svarid;
  const dokumentasjonsbehovTekst: string | undefined = årsakBarnepassConfig.svaralternativer.find(
    (svarsalternativ) => svarsalternativ.id === valgtÅrsak
  )?.alert_tekstid;

  const settÅrsakBarnepass = (spørsmål: ISpørsmål, svar: ISvar) => {
    settBarnepass(
      {
        ...barn.barnepass,
        årsakBarnepass: {
          spørsmålid: spørsmål.søknadid,
          svarid: svar.id,
          label: spørsmålTekstMedNavn,
          verdi: svar.svar_tekst,
        },
        barnepassordninger: barnepassordningerListe,
      },
      barn.id
    );
    settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id);
  };
  return (
    <VStack gap={'space-48'}>
      <Alert size="small" variant="warning" inline>
        {hentHTMLTekst('barnepass.alert-advarsel.årsak', intl)}
      </Alert>
      <MultiSvarSpørsmålMedNavn
        spørsmål={årsakBarnepassConfig}
        spørsmålTekst={spørsmålTekstMedNavn}
        settSpørsmålOgSvar={settÅrsakBarnepass}
        valgtSvar={barnepass?.årsakBarnepass?.verdi}
      />
      {valgtÅrsak === EÅrsakBarnepass.myeBortePgaJobb && (
        <Alert size="small" variant="info" inline>
          {hentTekst('barnepass.alert-info.myeBortePgaJobb', intl)}
        </Alert>
      )}
      {dokumentasjonsbehovTekst && (
        <AlertStripeDokumentasjon>
          {hentTekst(dokumentasjonsbehovTekst, intl)}
        </AlertStripeDokumentasjon>
      )}
    </VStack>
  );
};
