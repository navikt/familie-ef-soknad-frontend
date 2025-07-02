import React, { FC, useEffect, useState } from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';

import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { EBosituasjon, IBosituasjon } from '../../../../models/steg/bosituasjon';
import { hentTekst } from '../../../../utils/søknad';
import IdentEllerFødselsdatoGruppe from '../../../../components/gruppe/IdentEllerFødselsdatoGruppe';
import { EPersonDetaljer, IPersonDetaljer } from '../../../../models/søknad/person';
import { Label } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../../../../components/TextFieldMedBredde';

interface Props {
  tittel: string;
  erIdentEllerFødselsdatoObligatorisk: boolean;
  settBosituasjon: (bositasjon: IBosituasjon) => void;
  bosituasjon: IBosituasjon;
  samboerDetaljerType: EBosituasjon.samboerDetaljer | EBosituasjon.vordendeSamboerEktefelle;
  dataTestIdTextFieldMedBredde?: string;
  dataTestIdsIdentEllerFødselsdatoGruppe?: string[];
}

const OmSamboerenDin: FC<Props> = ({
  tittel,
  erIdentEllerFødselsdatoObligatorisk,
  settBosituasjon,
  bosituasjon,
  samboerDetaljerType,
  dataTestIdTextFieldMedBredde,
  dataTestIdsIdentEllerFødselsdatoGruppe,
}) => {
  const intl = useLokalIntlContext();
  const samboerDetaljer = bosituasjon[samboerDetaljerType];
  const [samboerInfo, settSamboerInfo] = useState<IPersonDetaljer>(
    samboerDetaljer ? samboerDetaljer : { kjennerIkkeIdent: false }
  );
  const [ident, settIdent] = useState<string>(samboerInfo?.ident ? samboerInfo?.ident.verdi : '');
  const [erGyldigIdent, settGyldigIdent] = useState<boolean>(!!samboerDetaljer?.ident?.verdi);

  useEffect(() => {
    erGyldigIdent &&
      settSamboerInfo({
        ...samboerInfo,
        [EPersonDetaljer.ident]: {
          label: hentTekst('person.ident', intl),
          verdi: ident,
        },
      });

    if (!erGyldigIdent) {
      const nySamboerInfo = { ...samboerInfo };
      delete nySamboerInfo.ident;

      settSamboerInfo(nySamboerInfo);
    }

    // eslint-disable-next-line
  }, [erGyldigIdent, ident]);

  useEffect(() => {
    settBosituasjon({
      ...bosituasjon,
      [samboerDetaljerType]: samboerInfo,
    });
    // eslint-disable-next-line
  }, [samboerInfo]);

  const settChecked = (checked: boolean) => {
    const endretSamboerInfo = samboerInfo;
    if (checked && endretSamboerInfo.ident?.verdi) {
      delete endretSamboerInfo.ident;
      settIdent('');
    }
    if (!checked && endretSamboerInfo.fødselsdato?.verdi) delete endretSamboerInfo.fødselsdato;

    settSamboerInfo({ ...endretSamboerInfo, kjennerIkkeIdent: checked });
  };

  const settFødselsdato = (date: string) => {
    settSamboerInfo({
      ...samboerInfo,
      fødselsdato: {
        label: hentTekst('datovelger.fødselsdato', intl),
        verdi: date,
      },
    });
  };

  const hvisGyldigIdentSettIdentISamboerDetaljer = (erGyldig: boolean) => {
    settGyldigIdent(erGyldig);
  };

  const oppdaterIdent = (e: React.FormEvent<HTMLInputElement>) => {
    settIdent(e.currentTarget.value);
  };

  const settNavn = (e: React.FormEvent<HTMLInputElement>) => {
    settSamboerInfo({
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
          data-testid={dataTestIdTextFieldMedBredde}
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
            erGyldigIdent={erGyldigIdent}
            settGyldigIdent={hvisGyldigIdentSettIdentISamboerDetaljer}
            settFødselsdato={settFødselsdato}
            settChecked={settChecked}
            settIdent={oppdaterIdent}
            dataTestIds={dataTestIdsIdentEllerFødselsdatoGruppe}
          />
        )}
      </KomponentGruppe>
    </>
  );
};

export default OmSamboerenDin;
