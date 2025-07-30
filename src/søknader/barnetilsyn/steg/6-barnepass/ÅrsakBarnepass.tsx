/* eslint-disable react-hooks/rules-of-hooks */
import { FC } from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import MultiSvarSpørsmålMedNavn from '../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { hentBarnNavnEllerBarnet } from '../../../../utils/barn';
import { IBarn } from '../../../../models/steg/barn';
import { EÅrsakBarnepass, IBarnepass, IBarnepassOrdning } from '../../models/barnepass';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentUid } from '../../../../utils/autentiseringogvalidering/uuid';
import { årsakBarnepass } from './BarnepassConfig';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { Alert } from '@navikt/ds-react';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
  barn: IBarn;
  settBarnepass: (barnepass: IBarnepass, barneid: string) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

const ÅrsakBarnepass: FC<Props> = ({ barn, settBarnepass, settDokumentasjonsbehovForBarn }) => {
  const intl = useLokalIntlContext();
  const { barnepass } = barn;

  const årsakBarnepassConfig = årsakBarnepass(intl);

  const spørsmålTekstMedNavn = hentBarnNavnEllerBarnet(barn, årsakBarnepassConfig.tekstid, intl);
  const barnepassordningerListe: IBarnepassOrdning[] = barnepass?.barnepassordninger
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
    <SeksjonGruppe>
      <KomponentGruppe>
        <Alert size="small" variant="warning" inline>
          {hentHTMLTekst('barnepass.alert-advarsel.årsak', intl)}
        </Alert>
      </KomponentGruppe>
      <KomponentGruppe>
        <MultiSvarSpørsmålMedNavn
          spørsmål={årsakBarnepassConfig}
          spørsmålTekst={spørsmålTekstMedNavn}
          settSpørsmålOgSvar={settÅrsakBarnepass}
          valgtSvar={barnepass?.årsakBarnepass?.verdi}
        />
      </KomponentGruppe>
      <KomponentGruppe>
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
      </KomponentGruppe>
    </SeksjonGruppe>
  );
};

export default ÅrsakBarnepass;
