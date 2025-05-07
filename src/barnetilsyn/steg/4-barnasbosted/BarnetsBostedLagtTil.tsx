import React from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import BarneHeader from '../../../components/BarneHeader';
import { formatDate, strengTilDato } from '../../../utils/dato';
import endre from '../../../assets/endre.svg';
import LenkeMedIkon from '../../../components/knapper/LenkeMedIkon';
import { hentBeskjedMedNavn } from '../../../utils/språk';
import { IBarn } from '../../../models/steg/barn';
import { hentTekst } from '../../../utils/søknad';
import { ESvarTekstid } from '../../../models/felles/spørsmålogsvar';
import { harValgtSvar } from '../../../utils/spørsmålogsvar';
import { Label, BodyShort } from '@navikt/ds-react';
import { harVerdi } from '../../../utils/typer';

interface Props {
  barn: IBarn;
  settAktivIndex: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  settSisteBarnUtfylt: (sisteBarnUtfylt: boolean) => void;
}

const BarnetsBostedLagtTil: React.FC<Props> = ({
  barn,
  settAktivIndex,
  index,
  settSisteBarnUtfylt,
}) => {
  const forelder = barn.forelder;
  const intl = useLokalIntlContext();
  const barnetsNavn =
    barn.navn && barn.navn.verdi !== ''
      ? barn.navn.verdi
      : hentTekst('barnet.storForBokstav', intl);

  if (
    !forelder ||
    (!barn.forelder?.borINorge && !barn.forelder?.kanIkkeOppgiAnnenForelderFar)
  )
    return null;

  const endreInformasjon = () => {
    settAktivIndex(index);
    settSisteBarnUtfylt(false);
  };

  return (
    <div className="barnas-bosted-lagt-til">
      <BarneHeader barn={barn} visBakgrunn={true} />
      <div className="barnas-bosted-lagt-til__svar">
        {(forelder.navn || forelder.kanIkkeOppgiAnnenForelderFar) && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {barnetsNavn}
              {intl.formatMessage({ id: 'barnasbosted.element.andreforelder' })}
            </Label>
            <BodyShort>
              {forelder.navn?.verdi === 'Ikke oppgitt' &&
              barn.erFraForrigeSøknad
                ? hentTekst('barnasbosted.kanikkeoppgiforelder', intl)
                : forelder.navn?.verdi
                  ? forelder.navn?.verdi
                  : hentTekst('barnasbosted.kanikkeoppgiforelder', intl)}
            </BodyShort>
          </div>
        )}
        {forelder.hvorforIkkeOppgi && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({ id: 'barnasbosted.spm.hvorforikkeoppgi' })
              )}
            </Label>
            <BodyShort>
              {forelder.ikkeOppgittAnnenForelderBegrunnelse
                ? forelder.ikkeOppgittAnnenForelderBegrunnelse?.verdi
                : hentTekst('barnasbosted.spm.donorbarn', intl)}
            </BodyShort>
          </div>
        )}
        {harValgtSvar(forelder.fødselsdato?.verdi) && forelder.fødselsdato && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {intl.formatMessage({ id: 'datovelger.fødselsdato' })}
            </Label>
            <BodyShort>
              {formatDate(strengTilDato(forelder.fødselsdato.verdi))}
            </BodyShort>
          </div>
        )}
        {!forelder.fraFolkeregister && forelder.ident && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {intl.formatMessage({ id: 'person.ident.visning' })}
            </Label>
            <BodyShort>{forelder.ident.verdi}</BodyShort>
          </div>
        )}
        {forelder.borINorge && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({ id: 'barnasbosted.borinorge' })
              )}
            </Label>
            <BodyShort>
              {forelder.borINorge?.verdi
                ? hentTekst(ESvarTekstid.JA, intl)
                : hentTekst(ESvarTekstid.NEI, intl)}
            </BodyShort>
          </div>
        )}
        {forelder.land && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {intl.formatMessage({ id: 'barnasbosted.hvilketLand' })}
            </Label>
            <BodyShort>{forelder.land?.verdi}</BodyShort>
          </div>
        )}
        {forelder.harAnnenForelderSamværMedBarn?.verdi && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.harAnnenForelderSamværMedBarn',
                })
              )}
            </Label>
            <BodyShort>
              {forelder.harAnnenForelderSamværMedBarn?.verdi || ''}
            </BodyShort>
          </div>
        )}
        {forelder.harDereSkriftligSamværsavtale?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.harDereSkriftligSamværsavtale',
                })
              )}
            </Label>
            <BodyShort>
              {forelder.harDereSkriftligSamværsavtale.verdi}
            </BodyShort>
          </div>
        ) : null}
        {forelder.hvordanPraktiseresSamværet?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {intl.formatMessage({ id: 'barnasbosted.element.samvær' })}
            </Label>
            <BodyShort>{forelder.hvordanPraktiseresSamværet.verdi}</BodyShort>
          </div>
        ) : null}
        {forelder.borAnnenForelderISammeHus ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.borAnnenForelderISammeHus',
                })
              )}
            </Label>
            <BodyShort>{forelder.borAnnenForelderISammeHus.verdi}</BodyShort>
          </div>
        ) : null}
        {harVerdi(forelder?.boddSammenFør?.verdi) ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.boddsammenfør',
                })
              )}
            </Label>
            <BodyShort>
              {forelder.boddSammenFør?.verdi
                ? hentTekst(ESvarTekstid.JA, intl)
                : hentTekst(ESvarTekstid.NEI, intl)}
            </BodyShort>
          </div>
        ) : null}
        {forelder?.flyttetFra?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.normaltekst.nårflyttetfra',
                })
              )}
            </Label>
            <BodyShort>
              {formatDate(strengTilDato(forelder.flyttetFra.verdi))}
            </BodyShort>
          </div>
        ) : null}
        {forelder?.hvorMyeSammen?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.hvorMyeSammen',
                })
              )}
            </Label>
            <BodyShort>{forelder.hvorMyeSammen.verdi}</BodyShort>
          </div>
        ) : null}
        {forelder.beskrivSamværUtenBarn && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentBeskjedMedNavn(
                barnetsNavn,
                intl.formatMessage({
                  id: 'barnasbosted.spm.beskrivSamværUtenBarn',
                })
              )}
            </Label>
            <BodyShort>{forelder.beskrivSamværUtenBarn.verdi}</BodyShort>
          </div>
        )}
        <LenkeMedIkon
          onClick={endreInformasjon}
          tekst_id="barnasbosted.knapp.endre"
          ikon={endre}
        />
      </div>
    </div>
  );
};

export default BarnetsBostedLagtTil;
