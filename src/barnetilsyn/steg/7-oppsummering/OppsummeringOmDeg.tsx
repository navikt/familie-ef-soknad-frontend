import { FC } from 'react';
import {
  VisLabelOgSvar,
  visLabelOgVerdiForSpørsmålFelt,
  visListeAvLabelOgSvar,
} from '../../../utils/visning';
import endre from '../../../assets/endre.svg';
import LenkeMedIkon from '../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../utils/søknad';
import {
  IMedlemskap,
  IUtenlandsopphold,
} from '../../../models/steg/omDeg/medlemskap';
import { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import { ISøker } from '../../../models/søknad/person';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import {
  SeksjonSpacingTop,
  StyledOppsummering,
  StyledOppsummeringMedUndertitler,
} from '../../../components/stegKomponenter/StyledOppsummering';
import LocaleTekst from '../../../language/LocaleTekst';
import { useNavigate } from 'react-router-dom';
import { BodyShort, Ingress, Label } from '@navikt/ds-react';
import { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';

interface Props {
  søker: ISøker;
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt;
  harMeldtAdresseendring?: ISpørsmålBooleanFelt;
  sivilstatus: ISivilstatus;
  medlemskap: IMedlemskap;
  endreInformasjonPath?: string;
}

const OppsummeringOmDeg: FC<Props> = ({
  søker,
  søkerBorPåRegistrertAdresse,
  harMeldtAdresseendring,
  sivilstatus,
  medlemskap,
  endreInformasjonPath,
}) => {
  const intl = useLokalIntlContext();

  const navigate = useNavigate();
  const omDeg = søker;
  const utenlandsopphold: IUtenlandsopphold[] | undefined =
    medlemskap.perioderBoddIUtlandet;

  const borDuPåDenneAdressen = visLabelOgVerdiForSpørsmålFelt(
    søkerBorPåRegistrertAdresse,
    intl
  );

  const harDuMeldtAdresseendring = visLabelOgVerdiForSpørsmålFelt(
    harMeldtAdresseendring,
    intl
  );
  const datoFlyttetFraHverandre = VisLabelOgSvar(sivilstatus);
  const tidligereSamboer = VisLabelOgSvar(sivilstatus.tidligereSamboerDetaljer);
  const medlemskapSpørsmål = VisLabelOgSvar(medlemskap);

  const perioderUtland = visListeAvLabelOgSvar(
    utenlandsopphold,
    hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)
  );

  return (
    <>
      <KomponentGruppe>
        <StyledOppsummering>
          <div className="spørsmål-og-svar">
            <Label as="p">
              <LocaleTekst tekst="person.ident" />
            </Label>
            <BodyShort>{omDeg.fnr}</BodyShort>
          </div>
          <div className="spørsmål-og-svar">
            <Label as="p">
              <LocaleTekst tekst="person.statsborgerskap" />
            </Label>
            <BodyShort>{omDeg.statsborgerskap}</BodyShort>
          </div>
          <div className="spørsmål-og-svar">
            <Label as="p">
              <LocaleTekst tekst="person.adresse" />
            </Label>
            <BodyShort>{omDeg.adresse.adresse}</BodyShort>
            <BodyShort>
              {omDeg.adresse.postnummer} {omDeg.adresse.poststed}
            </BodyShort>
          </div>
          {borDuPåDenneAdressen}
          {harDuMeldtAdresseendring}
          {tidligereSamboer && (
            <div className="spørsmål-og-svar">
              <Ingress>
                {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
              </Ingress>
              {tidligereSamboer}
            </div>
          )}
          {datoFlyttetFraHverandre}
          {medlemskapSpørsmål}
        </StyledOppsummering>

        <StyledOppsummeringMedUndertitler>
          <SeksjonSpacingTop>{perioderUtland}</SeksjonSpacingTop>
        </StyledOppsummeringMedUndertitler>
      </KomponentGruppe>
      <LenkeMedIkon
        onClick={() =>
          navigate(
            { pathname: endreInformasjonPath },
            { state: { kommerFraOppsummering: true } }
          )
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </>
  );
};

export default OppsummeringOmDeg;
