import { FC } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { verdiTilTekstsvar } from '../../../../utils/visning';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Label } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';

interface Props {
  stønadstype: Stønadstype;
  barn: IBarn;
}

const OppsummeringBarn: FC<Props> = ({ stønadstype, barn }) => {
  const intl = useLokalIntlContext();
  const { alder, ident, navn, født, skalHaBarnepass, harSammeAdresse, lagtTil, harAdressesperre } =
    barn;

  return (
    <>
      {!harAdressesperre && navn && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('person.navn', intl)}</Label>
          <BodyShort>{navn.verdi}</BodyShort>
        </div>
      )}

      {!harAdressesperre && ident && ident.verdi !== '' && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('person.fnr', intl)}</Label>
          <BodyShort>{ident.verdi}</BodyShort>
        </div>
      )}

      {alder && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('person.alder', intl)}</Label>
          <BodyShort>{alder.verdi}</BodyShort>
        </div>
      )}

      {født?.verdi && lagtTil && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('barnekort.spm.født', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(født.verdi, intl)}</BodyShort>
        </div>
      )}

      {stønadstype === Stønadstype.barnetilsyn && skalHaBarnepass && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('barnekort.skalHaBarnepass', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(skalHaBarnepass?.verdi, intl)}</BodyShort>
        </div>
      )}

      {!harAdressesperre && harSammeAdresse && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">{hentTekst('barnekort.spm.sammeAdresse', intl)}</Label>
          <BodyShort>{verdiTilTekstsvar(harSammeAdresse.verdi, intl)}</BodyShort>
        </div>
      )}
    </>
  );
};

export default OppsummeringBarn;
