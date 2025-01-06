import { object, string, array } from 'yup';
import { dnr as dnrValidator, fnr as fnrValidator } from '@navikt/fnrvalidator';

// eslint-disable-next-line
const datoRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

export enum ManglendeFelter {
  BOSITUASJONEN_DIN = 'BOSITUASJONEN_DIN',
  OM_DEG = 'OM_DEG',
  MER_OM_DIN_SITUASJON = 'MER_OM_DIN_SITUASJON',
  AKTIVITET = 'AKTIVITET',
}

export const manglendeFelterTilTekst: Record<ManglendeFelter, string> = {
  BOSITUASJONEN_DIN: 'Bosituasjonen din',
  OM_DEG: 'Om deg',
  MER_OM_DIN_SITUASJON: 'Mer om din situasjon',
  AKTIVITET: 'Arbeid, utdanning og andre aktiviteter',
};

export const listManglendeFelter = (manglendeFelter: string[]) => {
  const unikeManglendeFelter = [...new Set(manglendeFelter)];

  if (unikeManglendeFelter.length === 1) {
    return `steg "${unikeManglendeFelter[0]}"`;
  }

  return unikeManglendeFelter.map((item, index) => {
    if (index === 0) {
      return `stegene "${item}"`;
    } else if (index === unikeManglendeFelter.length - 1) {
      return ` og "${item}"`;
    } else {
      return `"${item}", `;
    }
  });
};

export const aktivitetSchema = object({
  firmaer: array()
    .of(
      object({
        arbeidsmengde: object({
          verdi: string().required(),
        }),
        arbeidsuke: object({
          verdi: string().required(),
        }),
        etableringsdato: object({
          verdi: string().required(),
        }),
        navn: object({
          verdi: string().required(),
        }),
        organisasjonsnummer: object({
          verdi: string().required(),
        }),
      })
    )
    .default(undefined),
  arbeidsforhold: array()
    .of(
      object({
        sluttdato: object({
          verdi: string().required().matches(datoRegex, 'Ikke en gyldig dato'),
        }).default(undefined),
      })
    )
    .default(undefined),
});

export const aktivitetSchemaBT = object({
  arbeidsforhold: array()
    .of(
      object({
        sluttdato: object({
          verdi: string().required().matches(datoRegex, 'Ikke en gyldig dato'),
        }).default(undefined),
      })
    )
    .default(undefined),
});

export const medlemskapSchema = object({
  perioderBoddIUtlandet: array()
    .of(
      object({
        periode: object({
          fra: object({
            verdi: string()
              .required()
              .matches(datoRegex, 'Ikke en gyldig dato'),
          }),
          til: object({
            verdi: string()
              .required()
              .matches(datoRegex, 'Ikke en gyldig dato'),
          }),
        }),
      })
    )
    .default(undefined),
});

export const merOmDinSituasjonSchema = object({
  datoSagtOppEllerRedusertStilling: object({
    verdi: string().required().matches(datoRegex, 'Ikke en gyldig dato'),
  }).default(undefined),
});

export const sivilstatusSchema = object({
  datoForSamlivsbrudd: object({
    verdi: string().required().matches(datoRegex, 'Ikke en gyldig dato'),
  }).default(undefined),
});

export const identErGyldig = (ident: string): boolean =>
  fnrValidator(ident).status === 'valid' ||
  dnrValidator(ident).status === 'valid';

export const datoSkalGifteSegEllerBliSamboerSchema = object({
  verdi: string().required().matches(datoRegex, 'Ikke en gyldig dato'),
});

export const identSchema = object({
  verdi: string()
    .required()
    .test('ident', 'Ikke gyldig ident', (ident: string) =>
      identErGyldig(ident)
    ),
});

export const fødselsdatoSchema = object({
  verdi: string()
    .required('Fødselsdato mangler')
    .matches(datoRegex, 'Ikke en gyldig dato'),
});
