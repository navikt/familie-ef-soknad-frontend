import React, { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import useSøknadContext from '../../context/SøknadContext';
import DatePicker from 'react-datepicker';
import { differenceInYears } from 'date-fns';
import { RadioPanel } from 'nav-frontend-skjema';
import { Input } from 'nav-frontend-skjema';

interface Props {
    settNavn: Function;
    settPersonnummer: Function;
    settBo: Function;
    boHosDeg: string;
    settDato: Function;
    barnDato: Date;
}

const LeggTilBarnFødt: React.FC<Props> = ( { settNavn, settPersonnummer, settBo, boHosDeg, settDato, barnDato }) => {
  return (
    <>
    <Input className="input-navn" onChange={(e) => settNavn(e.target.value)} label="Barnets fulle navn, om dette er bestemt" />

      <div className="fødselsnummer">
        <div className="fødselsdato">
      <Normaltekst>Fødselsdato</Normaltekst>
      <div className="barn-datovelger">
      <div className={'datepicker__container'}>
        <DatePicker
                onChange={(e) => settDato(e)}
                selected={barnDato}
                dateFormat={'dd.MM.yyyy'}
                className={'datovelger__input'}
            />
            </div>
        </div>
        </div>
        <Input className="personnummer" onChange={(e) => settPersonnummer(e.target.value)} label="Personnummer. Kun hvis barnet har fått." />
        </div>

      <div className="bo-hos-deg-spørsmål">
      <Normaltekst>Bor barnet hos deg?</Normaltekst>
      <div className="radiogruppe-2">
      <RadioPanel
            key={"ja"}
            name={"radio-bosted"}
            label="Ja"
            value={"ja"}
            checked={boHosDeg === "ja"}
            onChange={(e) => settBo(e)}
        />
        <RadioPanel
            key={"nei"}
            name={"radio-bosted"}
            label="Nei"
            value={"nei"}
            checked={boHosDeg === "nei"}
            onChange={(e) => settBo(e)}
        />
        </div>
        </div>

        </>
  );
};

export default LeggTilBarnFødt;
