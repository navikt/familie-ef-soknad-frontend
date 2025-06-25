import { IPerson } from '../../models/søknad/person';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { EAktivitet, IAktivitet } from '../../models/steg/aktivitet/aktivitet';

export const filtrerAktivitetSvaralternativer = (
  person: IPerson,
  aktivitetSpørsmål: ISpørsmål
): ISpørsmål => {
  const AktivitetSpørsmål: ISpørsmål = aktivitetSpørsmål;
  const harSøkerBarnUnderEttÅr: boolean = person.barn.some(
    (barn) => !barn.født || (barn.alder && parseInt(barn.alder.verdi) < 1)
  );

  if (!harSøkerBarnUnderEttÅr) {
    const filtrerteSvaralternativer: ISvar[] = AktivitetSpørsmål.svaralternativer.filter(
      (svar) => svar.id !== EAktivitet.erHjemmeMedBarnUnderEttÅr
    );
    return {
      ...AktivitetSpørsmål,
      svaralternativer: filtrerteSvaralternativer,
    };
  } else return AktivitetSpørsmål;
};

export const fjernAktivitet = (svarider: string[], arbeidssituasjon: IAktivitet) => {
  const endretArbeidssituasjon = arbeidssituasjon;

  const erSvarid = (aktivitet: EAktivitet) => {
    return svarider.find((svarid) => svarid === aktivitet);
  };

  if (
    !erSvarid(EAktivitet.erArbeidstakerOgEllerLønnsmottakerFrilanser) &&
    endretArbeidssituasjon.arbeidsforhold
  )
    delete endretArbeidssituasjon.arbeidsforhold;

  if (
    !erSvarid(EAktivitet.erSelvstendigNæringsdriveneEllerFrilanser) &&
    endretArbeidssituasjon.firmaer
  )
    delete endretArbeidssituasjon.firmaer;
  if (
    !erSvarid(EAktivitet.etablererEgenVirksomhet) &&
    endretArbeidssituasjon.etablererEgenVirksomhet
  )
    delete endretArbeidssituasjon.etablererEgenVirksomhet;

  if (!erSvarid(EAktivitet.erAnsattIEgetAS) && endretArbeidssituasjon.egetAS)
    delete endretArbeidssituasjon.egetAS;
  if (!erSvarid(EAktivitet.erArbeidssøker) && endretArbeidssituasjon.arbeidssøker)
    delete endretArbeidssituasjon.arbeidssøker;
  if (!erSvarid(EAktivitet.tarUtdanning) && endretArbeidssituasjon.underUtdanning)
    delete endretArbeidssituasjon.underUtdanning;

  return endretArbeidssituasjon;
};
