import React from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import {
  EAktivitet,
  EArbeidssituasjon,
  IAktivitet,
} from '../../../../models/steg/aktivitet/aktivitet';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { Heading, Textarea } from '@navikt/ds-react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

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
      <KomponentGruppe className={'sentrert'}>
        <Heading size="small" level="3">
          {hentTekst('arbeidssituasjon.tittel.etablererEgenVirksomhet', intl)}
        </Heading>
      </KomponentGruppe>
      <KomponentGruppe>
        <Textarea
          autoComplete={'off'}
          label={hentTekst('arbeidssituasjon.label.etablererEgenVirksomhet', intl)}
          value={etablererEgenVirksomhet?.verdi ? etablererEgenVirksomhet.verdi : ''}
          maxLength={2000}
          onChange={(e) => settTekstfelt(e)}
        />
        <FeltGruppe>
          <AlertStripeDokumentasjon>
            {hentHTMLTekst('arbeidssituasjon.alert.etablererEgenVirksomhet', intl)}
          </AlertStripeDokumentasjon>
        </FeltGruppe>
      </KomponentGruppe>
    </>
  );
};

export default EtablererEgenVirksomhet;
