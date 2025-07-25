import { FC } from 'react';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import { BodyShort, Heading } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

interface Props {
  stønadstype: Stønadstype;
  dokumentasjonsbehov: IDokumentasjon[];
}

const EttersendDokumentasjon: FC<Props> = ({ stønadstype, dokumentasjonsbehov }) => {
  const intl = useLokalIntlContext();
  return dokumentasjonsbehov.length > 0 ? (
    <KomponentGruppe>
      <FeltGruppe>
        <Heading size="small" level="3">
          {hentTekst('dokumentasjon.ettersend.tittel', intl)}
        </Heading>
      </FeltGruppe>
      <FeltGruppe>
        <BodyShort>{hentHTMLTekst(`dokumentasjon.ettersend.tekst.${stønadstype}`, intl)}</BodyShort>
      </FeltGruppe>
    </KomponentGruppe>
  ) : null;
};
export default EttersendDokumentasjon;
