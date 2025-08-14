/**
 * Enum som definerer hvilke datoer som er gyldige i ulike kontekster.
 * Brukes ofte til validering av datoer i datovelgere (f.eks. fødselsdato, flyttedato).
 * Verdiene representerer ulike intervaller som er tillatt, som fremtidige datoer,
 * tidligere datoer, eller kombinasjoner av historiske og fremtidige datoer.
 * Ofte begrenser dette datovelgerene fra å la bruker setter verdier utenfor grensen.
 */

export enum GyldigeDatoer {
  Alle = 'Alle',
  Fremtidige = 'Fremtidige',
  Tidligere = 'Tidligere',
  TidligereOgSeksMånederFrem = 'TidligereOgSeksMånederFrem',
  FemÅrTidligereOgSeksMånederFrem = 'FemÅrTidligereOgSeksMånederFrem',
  FemtiÅrTidligereOgSeksMånederFrem = 'FemtiÅrTidligereOgSeksMånederFrem',
}
