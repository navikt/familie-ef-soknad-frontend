import { FC } from 'react';
import { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import LocaleTekst from '../../../language/LocaleTekst';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import { Heading, BodyShort } from '@navikt/ds-react';

interface Props {
  stønadstype: Stønadstype;
  dokumentasjonsbehov: IDokumentasjon[];
}

const EttersendDokumentasjon: FC<Props> = ({
  stønadstype,
  dokumentasjonsbehov,
}) => {
  return dokumentasjonsbehov.length > 0 ? (
    <KomponentGruppe>
      <FeltGruppe>
        <Heading size="small" level="3">
          <LocaleTekst tekst={'dokumentasjon.ettersend.tittel'} />
        </Heading>
      </FeltGruppe>
      <FeltGruppe>
        <BodyShort>
          <LocaleTekst tekst={`dokumentasjon.ettersend.tekst.${stønadstype}`} />
        </BodyShort>
      </FeltGruppe>
    </KomponentGruppe>
  ) : null;
};
export default EttersendDokumentasjon;
