import React from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import {
  EAktivitet,
  EArbeidssituasjon,
  IAktivitet,
} from '../../../../models/steg/aktivitet/aktivitet';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/søknad';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { Heading, Textarea } from '@navikt/ds-react';

interface Props {
  arbeidssituasjon: IAktivitet;
  settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
}

const EtablererEgenVirksomhet: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon }) => {
  const { etablererEgenVirksomhet } = arbeidssituasjon;
  const intl = useLokalIntlContext();

  const settTekstfelt = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    settArbeidssituasjon({
      ...arbeidssituasjon,
      etablererEgenVirksomhet: {
        spørsmålid: EArbeidssituasjon.etablererEgenVirksomhet,
        svarid: EAktivitet.etablererEgenVirksomhet,
        label: hentTekst('arbeidssituasjon.label.etablererEgenVirksomhet', intl),
        verdi: e.target.value,
      },
    });
  };

  return (
    <>
      <FeltGruppe>
        <Heading size="small" level="3">
          <LocaleTekst tekst={'arbeidssituasjon.tittel.etablererEgenVirksomhet'} />
        </Heading>
      </FeltGruppe>
      <KomponentGruppe>
        <Textarea
          autoComplete={'off'}
          label={intl.formatMessage({
            id: 'arbeidssituasjon.label.etablererEgenVirksomhet',
          })}
          value={etablererEgenVirksomhet?.verdi ? etablererEgenVirksomhet.verdi : ''}
          maxLength={2000}
          onChange={(e) => settTekstfelt(e)}
        />
        <FeltGruppe>
          <AlertStripeDokumentasjon>
            <LocaleTekst tekst={'arbeidssituasjon.alert.etablererEgenVirksomhet'} />
          </AlertStripeDokumentasjon>
        </FeltGruppe>
      </KomponentGruppe>
    </>
  );
};

export default EtablererEgenVirksomhet;
