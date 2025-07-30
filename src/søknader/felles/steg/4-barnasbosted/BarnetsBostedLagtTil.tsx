import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import BarneHeader from '../../../../components/BarneHeader';
import { formatDate, strengTilDato } from '../../../../utils/dato';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { IBarn } from '../../../../models/steg/barn';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { ESvarTekstid } from '../../../../models/felles/spørsmålogsvar';
import { harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { BodyShort, Label } from '@navikt/ds-react';
import { harVerdi } from '../../../../utils/typer';

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

  if (!forelder || (!barn.forelder?.borINorge && !barn.forelder?.kanIkkeOppgiAnnenForelderFar))
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
              {hentTekst('barnasbosted.element.andreforelder', intl)}
            </Label>
            <BodyShort>
              {forelder.navn?.verdi === 'Ikke oppgitt' && barn.erFraForrigeSøknad
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
              {hentTekstMedEnVariabel('barnasbosted.spm.hvorforikkeoppgi', intl, barnetsNavn)}
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
            <Label as="p">{hentTekst('datovelger.fødselsdato', intl)}</Label>
            <BodyShort>{formatDate(strengTilDato(forelder.fødselsdato.verdi))}</BodyShort>
          </div>
        )}
        {!forelder.fraFolkeregister && forelder.ident && (
          <div className="spørsmål-og-svar">
            <Label as="p">{hentTekst('person.ident.visning', intl)}</Label>
            <BodyShort>{forelder.ident.verdi}</BodyShort>
          </div>
        )}
        {forelder.borINorge && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel('barnasbosted.borinorge', intl, barnetsNavn)}
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
            <Label as="p">{hentTekst('barnasbosted.hvilketLand', intl)}</Label>
            <BodyShort>{forelder.land?.verdi}</BodyShort>
          </div>
        )}
        {forelder.harAnnenForelderSamværMedBarn?.verdi && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel(
                'barnasbosted.spm.harAnnenForelderSamværMedBarn',
                intl,
                barnetsNavn
              )}
            </Label>
            <BodyShort>{forelder.harAnnenForelderSamværMedBarn?.verdi || ''}</BodyShort>
          </div>
        )}
        {forelder.harDereSkriftligSamværsavtale?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel(
                'barnasbosted.spm.harDereSkriftligSamværsavtale',
                intl,
                barnetsNavn
              )}
            </Label>
            <BodyShort>{forelder.harDereSkriftligSamværsavtale.verdi}</BodyShort>
          </div>
        ) : null}
        {forelder.hvordanPraktiseresSamværet?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">{hentTekst('barnasbosted.element.samvær', intl)}</Label>
            <BodyShort>{forelder.hvordanPraktiseresSamværet.verdi}</BodyShort>
          </div>
        ) : null}
        {forelder.borAnnenForelderISammeHus ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel(
                'barnasbosted.spm.borAnnenForelderISammeHus',
                intl,
                barnetsNavn
              )}
            </Label>
            <BodyShort>{forelder.borAnnenForelderISammeHus.verdi}</BodyShort>
          </div>
        ) : null}
        {harVerdi(forelder?.boddSammenFør?.verdi) ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel('barnasbosted.spm.boddsammenfør', intl, barnetsNavn)}
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
              {hentTekstMedEnVariabel('barnasbosted.normaltekst.nårflyttetfra', intl, barnetsNavn)}
            </Label>
            <BodyShort>{formatDate(strengTilDato(forelder.flyttetFra.verdi))}</BodyShort>
          </div>
        ) : null}
        {forelder?.hvorMyeSammen?.verdi ? (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel('barnasbosted.spm.hvorMyeSammen', intl, barnetsNavn)}
            </Label>
            <BodyShort>{forelder.hvorMyeSammen.verdi}</BodyShort>
          </div>
        ) : null}
        {forelder.beskrivSamværUtenBarn && (
          <div className="spørsmål-og-svar">
            <Label as="p">
              {hentTekstMedEnVariabel('barnasbosted.spm.beskrivSamværUtenBarn', intl, barnetsNavn)}
            </Label>
            <BodyShort>{forelder.beskrivSamværUtenBarn.verdi}</BodyShort>
          </div>
        )}
        <LenkeMedIkon onClick={endreInformasjon} tekst_id="barnasbosted.knapp.endre" ikon={endre} />
      </div>
    </div>
  );
};

export default BarnetsBostedLagtTil;
