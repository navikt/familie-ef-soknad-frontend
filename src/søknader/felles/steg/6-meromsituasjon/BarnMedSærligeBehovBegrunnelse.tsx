import React, { ChangeEvent } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import { hentBarnetsNavnEllerBeskrivelse } from '../../../../utils/barn';
import { useOvergangsstønadSøknad } from '../../../overgangsstønad/OvergangsstønadContext';
import { storeForbokstaver } from '../../../../utils/tekst';
import './BarnMedSærligeBehovBegrunnelse.css';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hentBeskjedMedNavn } from '../../../../utils/språk';
import LocaleTekst from '../../../../language/LocaleTekst';
import { LokalIntlShape } from '../../../../language/typer';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort, Label, Textarea } from '@navikt/ds-react';

const MAX_LENGDE_BEGRUNDELSE = 1500;

const BarnMedSærligeBehovBegrunnelse = () => {
  const intl = useLokalIntlContext();
  const { søknad, oppdaterBarnISøknaden } = useOvergangsstønadSøknad();
  const barnMedSærligeBehov = søknad.person.barn.filter((barn: IBarn) => barn.særligeTilsynsbehov);

  const settBarnSærligBehovBegrunnelse = (barnMedSærligeBehovBegrunnelse: IBarn) => {
    return (event: ChangeEvent<HTMLTextAreaElement>) => {
      const indeksBarnSomErHuket = søknad.person.barn.findIndex(
        (barn: IBarn) => barn.id === barnMedSærligeBehovBegrunnelse.id
      );
      const barnMedSærligeBehov: IBarn = søknad.person.barn[indeksBarnSomErHuket];
      const oppdatertBarn: IBarn = {
        ...barnMedSærligeBehov,
        særligeTilsynsbehov: {
          ...barnMedSærligeBehov.særligeTilsynsbehov!,
          verdi: event.target.value,
        },
      };
      oppdaterBarnISøknaden(oppdatertBarn);
    };
  };

  return (
    <>
      {barnMedSærligeBehov.map((barn: IBarn) => {
        const onChange = settBarnSærligBehovBegrunnelse(barn);
        return (
          <KomponentGruppe key={barn.id}>
            <Textarea
              autoComplete={'off'}
              onChange={onChange}
              label={<BarnMedSærligeBehovLabelTekst barn={barn} intl={intl} />}
              value={barn.særligeTilsynsbehov!.verdi}
              maxLength={MAX_LENGDE_BEGRUNDELSE}
            />
          </KomponentGruppe>
        );
      })}
    </>
  );
};

const BarnMedSærligeBehovLabelTekst: React.FC<{
  barn: IBarn;
  intl: LokalIntlShape;
}> = (props: { barn: IBarn; intl: LokalIntlShape }) => {
  const barnetsNavn = hentBarnetsNavnEllerBeskrivelse(props.barn, props.intl);
  const intl = useLokalIntlContext();
  const navn = props.barn.navn.verdi ? storeForbokstaver(barnetsNavn) : barnetsNavn;
  const omBarnetsTilsynsbehovLabel = hentBeskjedMedNavn(
    navn,
    intl.formatMessage({
      id: 'dinSituasjon.alert.harBarnMedSærligeBehov.tittel',
    })
  );

  return (
    <section className="om-barnets-tilsynsbehov" aria-live="polite">
      <Label className="blokk-xs">{omBarnetsTilsynsbehovLabel}</Label>
      <BodyShort>
        <LocaleTekst tekst={'dinSituasjon.alert.harBarnMedSærligeBehov.beskrivelse'} />
      </BodyShort>
    </section>
  );
};

export default BarnMedSærligeBehovBegrunnelse;
