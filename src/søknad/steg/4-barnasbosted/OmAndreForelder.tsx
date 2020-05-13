import React, { useState } from 'react';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import { Input } from 'nav-frontend-skjema';
import { Checkbox } from 'nav-frontend-skjema';
import Datovelger, {
  DatoBegrensning,
} from '../../../components/dato/Datovelger';
import { IBarn } from '../../../models/barn';
import { IForelder } from '../../../models/forelder';
import { hentTekst } from '../../../utils/søknad';
import { Normaltekst } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import { useIntl } from 'react-intl';

interface Props {
  barn: IBarn;
  settForelder: Function;
  forelder: IForelder;
}
const OmAndreForelder: React.FC<Props> = ({ settForelder, forelder }) => {
  const intl = useIntl();

  const hukAv = (e: any) => {
    const nyForelder = { ...forelder };

    if (e.target.checked) {
      delete nyForelder.navn;
      delete nyForelder.fødselsdato;
      delete nyForelder.personnr;
    }

    settForelder({
      ...nyForelder,
      kanIkkeOppgiAnnenForelderFar: {
        label: hentTekst('barnasbosted.hvorforikkeoppgi', intl),
        verdi: !forelder.kanIkkeOppgiAnnenForelderFar?.verdi,
      },
    });
  };

  console.log(forelder);

  return (
    <>
      <KomponentGruppe>
        <FeltGruppe>
          <Input
            className="foreldre-navn-input"
            onChange={(e) =>
              settForelder({
                ...forelder,
                navn: {
                  label: 'halla',
                  verdi: e.target.value,
                },
              })
            }
            value={forelder.navn ? forelder.navn?.verdi : ''}
            label="Navn"
            disabled={forelder.kanIkkeOppgiAnnenForelderFar?.verdi}
          />
        </FeltGruppe>
      </KomponentGruppe>
      <KomponentGruppe>
        <div className="fødselsnummer">
          <Datovelger
            settDato={(e: Date | null) => {
              e !== null &&
                settForelder({
                  ...forelder,
                  flyttetFra: {
                    label: 'Fødselsnummer datotest',
                    verdi: e,
                  },
                });
            }}
            valgtDato={
              forelder.fødselsdato && forelder.fødselsdato.verdi
                ? forelder.fødselsdato.verdi
                : undefined
            }
            tekstid={'datovelger.fødselsdato'}
            datobegrensning={DatoBegrensning.TidligereDatoer}
          />
          <Input
            className="personnummer"
            onChange={(e) =>
              settForelder({
                ...forelder,
                personnr: {
                  label: 'Personnr',
                  verdi: e.target.value,
                },
              })
            }
            value={forelder.personnr ? forelder.personnr?.verdi : ''}
            label="Personnummer (hvis barnet har fått)"
            disabled={forelder.kanIkkeOppgiAnnenForelderFar?.verdi}
          />
        </div>
        <FeltGruppe classname="checkbox-forelder">
          <Checkbox
            label={'Jeg kan ikke oppgi den andre forelderen'}
            checked={
              forelder.kanIkkeOppgiAnnenForelderFar?.verdi
                ? forelder.kanIkkeOppgiAnnenForelderFar?.verdi
                : false
            }
            onChange={hukAv}
          />
        </FeltGruppe>
        {forelder.kanIkkeOppgiAnnenForelderFar?.verdi ? (
          <>
            <Normaltekst>
              {intl.formatMessage({ id: 'barnasbosted.hvorforikkeoppgi' })}
            </Normaltekst>
            <FeltGruppe>
              <Textarea
                value={
                  forelder.ikkeOppgittAnnenForelderBegrunnelse &&
                  forelder.ikkeOppgittAnnenForelderBegrunnelse.verdi
                    ? forelder.ikkeOppgittAnnenForelderBegrunnelse.verdi
                    : ''
                }
                onChange={(e: any) =>
                  settForelder({
                    ...forelder,
                    ikkeOppgittAnnenForelderBegrunnelse: {
                      label: hentTekst('barnasbosted.hvorforikkeoppgi', intl),
                      verdi: e.target.value,
                    },
                  })
                }
                label=""
              />
            </FeltGruppe>
          </>
        ) : null}
      </KomponentGruppe>
    </>
  );
};

export default OmAndreForelder;
