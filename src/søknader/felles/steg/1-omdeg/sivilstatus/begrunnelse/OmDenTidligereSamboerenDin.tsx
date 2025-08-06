import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import KomponentGruppe from '../../../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../../../components/gruppe/FeltGruppe';
import { TextFieldMedBredde } from '../../../../../../components/TextFieldMedBredde';
import { identErGyldig } from '../../../../../../utils/validering/validering';
import { Checkbox } from '@navikt/ds-react';
import { DatoBegrensning, Datovelger } from '../../../../../../components/dato/Datovelger';
import { useOmDeg } from '../../OmDegContext';

export const OmDenTidligereSamboerenDin: FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { tidligereSamboerDetaljer } = sivilstatus;
  const ident = sivilstatus.tidligereSamboerDetaljer?.ident?.verdi;
  const checked = tidligereSamboerDetaljer?.kjennerIkkeIdent;

  const feilmelding: string = hentTekst('person.feilmelding.ident', intl);

  const settTidligereSamboersFødselsdato = (date: string) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        fødselsdato: {
          label: hentTekst('datovelger.fødselsdato', intl),
          verdi: date,
        },
      },
    });
  };

  const settKjennerIkkeIdent = (checked: boolean) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: checked,
      },
    });
  };

  const settNavn = (e: React.FormEvent<HTMLInputElement>) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        navn: {
          label: hentTekst('person.navn', intl),
          verdi: e.currentTarget.value,
        },
      },
    });
  };

  const settIdent = (ident: string) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        ident: {
          label: hentTekst('person.ident', intl),
          verdi: ident,
        },
      },
    });
  };

  const erGyldigIdent = (): boolean => {
    return identErGyldig(sivilstatus.tidligereSamboerDetaljer?.ident?.verdi ?? '');
  };

  return (
    <>
      <KomponentGruppe>
        <FeltGruppe>
          <TextFieldMedBredde
            key={'navn'}
            label={hentTekst('person.navn', intl)}
            type="text"
            bredde={'L'}
            onChange={(e) => settNavn(e)}
            value={tidligereSamboerDetaljer?.navn?.verdi}
          />
        </FeltGruppe>
        <FeltGruppe>
          <TextFieldMedBredde
            key={'ident'}
            label={hentTekst('person.ident', intl)}
            disabled={checked}
            bredde={'L'}
            pattern="[0-9]*"
            value={ident}
            error={ident && !erGyldigIdent() ? feilmelding : undefined}
            onChange={(e) => {
              settIdent(e.target.value);
            }}
          />
        </FeltGruppe>
        <FeltGruppe>
          <Checkbox
            className={'checkbox'}
            checked={checked}
            onChange={() => settKjennerIkkeIdent(!checked)}
          >
            {hentTekst('person.checkbox.ident', intl)}
          </Checkbox>
        </FeltGruppe>
      </KomponentGruppe>
      {checked && (
        <KomponentGruppe>
          <Datovelger
            valgtDato={tidligereSamboerDetaljer?.fødselsdato?.verdi || ''}
            tekstid={'datovelger.fødselsdato'}
            datobegrensning={DatoBegrensning.TidligereDatoer}
            settDato={(e) => settTidligereSamboersFødselsdato(e)}
          />
        </KomponentGruppe>
      )}
    </>
  );
};
