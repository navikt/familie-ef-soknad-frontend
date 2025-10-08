import React, { ChangeEvent } from 'react';
import { IBarn } from '../../../../models/steg/barn';
import { hentBarnetsNavnEllerBeskrivelse } from '../../../../utils/barn';
import './BarnMedSærligeBehovBegrunnelse.css';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Label, Textarea } from '@navikt/ds-react';
import LesMerTekst from '../../../../components/LesMerTekst';
import { hentTekstMedEnVariabel, storeForbokstaver } from '../../../../utils/teksthåndtering';
import { useMerOmDinSituasjon } from '../../../overgangsstønad/steg/6-meromsituasjon/MerOmDinSituasjonContext';

const MAX_LENGDE_BEGRUNDELSE = 1500;

const BarnMedSærligeBehovBegrunnelse = () => {
  const intl = useLokalIntlContext();

  const { søknad, oppdaterBarnISøknaden } = useMerOmDinSituasjon();

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
        const barnetsNavn = hentBarnetsNavnEllerBeskrivelse(barn, intl);
        const navn = barn.navn.verdi ? storeForbokstaver(barnetsNavn) : barnetsNavn;
        const omBarnetsTilsynsbehovLabel = hentTekstMedEnVariabel(
          'dinSituasjon.alert.harBarnMedSærligeBehov.tittel',
          intl,
          navn
        );
        return (
          <KomponentGruppe key={barn.id}>
            <Label className="blokk-xs" as={'label'}>
              {omBarnetsTilsynsbehovLabel}
            </Label>
            <LesMerTekst
              åpneTekstid={''}
              innholdTekstid={'dinSituasjon.alert.harBarnMedSærligeBehov.beskrivelse'}
            ></LesMerTekst>
            <Textarea
              autoComplete={'off'}
              onChange={onChange}
              label={omBarnetsTilsynsbehovLabel}
              hideLabel={true}
              value={barn.særligeTilsynsbehov!.verdi}
              maxLength={MAX_LENGDE_BEGRUNDELSE}
            />
          </KomponentGruppe>
        );
      })}
    </>
  );
};

export default BarnMedSærligeBehovBegrunnelse;
