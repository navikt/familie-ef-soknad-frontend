import React, { FC, useState } from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';

import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { EBosituasjon } from '../../../../models/steg/bosituasjon';
import { hentTekst } from '../../../../utils/søknad';
import IdentEllerFødselsdatoGruppe from '../../../../components/gruppe/IdentEllerFødselsdatoGruppe';
import { EPersonDetaljer, IPersonDetaljer } from '../../../../models/søknad/person';
import { Label } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';
import { useBosituasjon } from './BosituasjonContext';
import { identErGyldig } from '../../../../utils/validering/validering';

interface Props {
  tittel: string;
  erIdentEllerFødselsdatoObligatorisk: boolean;
  samboerDetaljerType: EBosituasjon.samboerDetaljer | EBosituasjon.vordendeSamboerEktefelle;
  testIderTextFieldMedBredde?: string;
  testIderIdentEllerFødselsdatoGruppe?: string[];
}

export const OmSamboerenDin: FC<Props> = ({
  tittel,
  erIdentEllerFødselsdatoObligatorisk,
  samboerDetaljerType,
  testIderTextFieldMedBredde,
  testIderIdentEllerFødselsdatoGruppe,
}) => {
  const { bosituasjon, settBosituasjon } = useBosituasjon();
  const intl = useLokalIntlContext();
  const samboerDetaljer = bosituasjon[samboerDetaljerType];
  const [samboerInfo, settSamboerInfo] = useState<IPersonDetaljer>(
    samboerDetaljer ? samboerDetaljer : { kjennerIkkeIdent: false }
  );
  const [ident, settIdent] = useState<string>(samboerInfo?.ident ? samboerInfo?.ident.verdi : '');

  const oppdaterSamboerInfo = (personDetaljer: IPersonDetaljer) => {
    settSamboerInfo(personDetaljer);
    settBosituasjon({
      ...bosituasjon,
      [samboerDetaljerType]: personDetaljer,
    });
  };

  const settChecked = (checked: boolean) => {
    const endretSamboerInfo = samboerInfo;
    if (checked && endretSamboerInfo.ident?.verdi) {
      delete endretSamboerInfo.ident;
      oppdaterIdent('');
    }
    if (!checked && endretSamboerInfo.fødselsdato?.verdi) delete endretSamboerInfo.fødselsdato;

    oppdaterSamboerInfo({ ...endretSamboerInfo, kjennerIkkeIdent: checked });
  };

  const settFødselsdato = (date: string) => {
    oppdaterSamboerInfo({
      ...samboerInfo,
      fødselsdato: {
        label: hentTekst('datovelger.fødselsdato', intl),
        verdi: date,
      },
    });
  };

  const oppdaterSamboerInfoMedIdent = (ident: string, erGyldig: boolean) => {
    if (erGyldig) {
      oppdaterSamboerInfo({
        ...samboerInfo,
        [EPersonDetaljer.ident]: {
          label: hentTekst('person.ident', intl),
          verdi: ident,
        },
      });
    } else {
      oppdaterSamboerInfo({ ...samboerInfo, ident: undefined });
    }
  };

  const oppdaterIdent = (ident: string) => {
    settIdent(ident);
    oppdaterSamboerInfoMedIdent(ident, identErGyldig(ident));
  };

  const settNavn = (e: React.FormEvent<HTMLInputElement>) => {
    oppdaterSamboerInfo({
      ...samboerInfo,
      [EPersonDetaljer.navn]: {
        label: hentTekst('person.navn', intl),
        verdi: e.currentTarget.value,
      },
    });
  };
  return (
    <>
      <FeltGruppe>
        <Label as="p">{hentTekst(tittel, intl)}</Label>
      </FeltGruppe>

      <KomponentGruppe>
        <TextFieldMedBredde
          className={'inputfelt-tekst'}
          key={'navn'}
          label={hentTekst('person.navn', intl)}
          type="text"
          bredde={'L'}
          onChange={(e) => settNavn(e)}
          value={samboerInfo.navn?.verdi ? samboerInfo.navn?.verdi : ''}
          data-testid={testIderTextFieldMedBredde}
        />
      </KomponentGruppe>
      <KomponentGruppe>
        {samboerDetaljer?.navn && (
          <IdentEllerFødselsdatoGruppe
            identLabel={hentTekst('person.ident', intl)}
            datoLabel={
              !erIdentEllerFødselsdatoObligatorisk
                ? hentTekst('person.fødselsdato', intl)
                : hentTekst('datovelger.fødselsdato', intl)
            }
            checkboxLabel={hentTekst('person.checkbox.ident', intl)}
            ident={ident && !samboerInfo.kjennerIkkeIdent ? ident : ''}
            fødselsdato={samboerInfo.fødselsdato?.verdi || ''}
            checked={samboerInfo?.kjennerIkkeIdent}
            erGyldigIdent={identErGyldig(ident)}
            settIdent={oppdaterIdent}
            settFødselsdato={settFødselsdato}
            settChecked={settChecked}
            testIder={testIderIdentEllerFødselsdatoGruppe}
          />
        )}
      </KomponentGruppe>
    </>
  );
};
