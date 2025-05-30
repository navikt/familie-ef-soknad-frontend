import { FC } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { verdiTilTekstsvar } from '../../../../utils/visning';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import LocaleTekst from '../../../../language/LocaleTekst';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  stønadstype: Stønadstype;
  barn: IBarn;
}

const OppsummeringBarn: FC<Props> = ({ stønadstype, barn }) => {
  const intl = useLokalIntlContext();
  const {
    alder,
    ident,
    navn,
    født,
    skalHaBarnepass,
    harSammeAdresse,
    lagtTil,
    harAdressesperre,
  } = barn;

  return (
    <>
      {!harAdressesperre && navn && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="person.navn" />
          </Label>
          <BodyShort>{navn.verdi}</BodyShort>
        </div>
      )}

      {!harAdressesperre && ident && ident.verdi !== '' && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="person.fnr" />
          </Label>
          <BodyShort>{ident.verdi}</BodyShort>
        </div>
      )}

      {alder && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="person.alder" />
          </Label>
          <BodyShort>{alder.verdi}</BodyShort>
        </div>
      )}

      {født?.verdi && lagtTil && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="barnekort.spm.født" />
          </Label>
          <BodyShort>{verdiTilTekstsvar(født.verdi, intl)}</BodyShort>
        </div>
      )}

      {stønadstype === Stønadstype.barnetilsyn && skalHaBarnepass && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="barnekort.skalHaBarnepass" />
          </Label>
          <BodyShort>
            {verdiTilTekstsvar(skalHaBarnepass?.verdi, intl)}
          </BodyShort>
        </div>
      )}

      {!harAdressesperre && harSammeAdresse && (
        <div className={'spørsmål-og-svar'}>
          <Label as="p">
            <LocaleTekst tekst="barnekort.spm.sammeAdresse" />
          </Label>
          <BodyShort>
            {verdiTilTekstsvar(harSammeAdresse.verdi, intl)}
          </BodyShort>
        </div>
      )}
    </>
  );
};

export default OppsummeringBarn;
