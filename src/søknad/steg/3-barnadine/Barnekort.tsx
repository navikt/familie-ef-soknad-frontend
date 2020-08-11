import React, { useState } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import barn1 from '../../../assets/barn1.svg';
import barn2 from '../../../assets/barn2.svg';
import barn3 from '../../../assets/barn3.svg';
import ufødtIkon from '../../../assets/ufodt.svg';
import { useIntl } from 'react-intl';
import LeggTilBarn from './LeggTilBarn';
import Modal from 'nav-frontend-modal';
import { IBooleanFelt, ITekstFelt } from '../../../models/søknad/søknadsfelter';
import { hentTekst } from '../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../models/felles/spørsmålogsvar';
import { IBarn } from '../../../models/steg/barn';

interface Props {
  navn: ITekstFelt;
  ident: ITekstFelt;
  fødselsdato: ITekstFelt;
  alder: ITekstFelt;
  harSammeAdresse: IBooleanFelt;
  lagtTil: boolean;
  født: IBooleanFelt;
  id: string;
  velgBarnForDenneSøknaden?: React.ReactNode;
  slettBarn: Function;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
  barneListe: IBarn[];
  settBarneListe: (barneListe: IBarn[]) => void;
}

const Barnekort: React.FC<Props> = ({
  id,
  navn,
  ident,
  alder,
  harSammeAdresse,
  lagtTil,
  født,
  fødselsdato,
  velgBarnForDenneSøknaden,
  slettBarn,
  settDokumentasjonsbehov,
  barneListe,
  settBarneListe,
}) => {
  const intl = useIntl();
  const [åpenEndreModal, settÅpenEndreModal] = useState(false);

  const formatFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
  };

  const ikoner = [barn1, barn2, barn3];
  const ikon = født.verdi
    ? ikoner[Math.floor(Math.random() * ikoner.length)]
    : ufødtIkon;

  let bosted: string = '';

  if (lagtTil) {
    bosted = født.verdi
      ? harSammeAdresse.verdi
        ? hentTekst('barnekort.adresse.bor', intl)
        : hentTekst('barnekort.adresse.borIkke', intl)
      : harSammeAdresse.verdi
      ? hentTekst('barnekort.adresse.skalBo', intl)
      : hentTekst('barnekort.adresse.skalIkkeBo', intl);
  } else {
    bosted = harSammeAdresse.verdi
      ? intl.formatMessage({ id: 'barnekort.adresse.registrert' })
      : intl.formatMessage({ id: 'barnekort.adresse.uregistrert' });
  }

  return (
    <div className="barnekort">
      <div className="barnekort__header">
        <img alt="barn" className="barneikon" src={ikon} />
      </div>
      <div className="barnekort__informasjonsboks">
        <div className="informasjonsboks-innhold">
          <Element>
            {født.verdi
              ? navn.verdi
              : intl.formatMessage({ id: 'barnekort.normaltekst.barn' })}
          </Element>
          <div className="informasjonselement">
            {ident.verdi ? (
              <>
                <Normaltekst>
                  {intl.formatMessage({ id: 'barnekort.fødselsnummer' })}
                </Normaltekst>
                <Normaltekst>{formatFnr(ident.verdi)}</Normaltekst>
              </>
            ) : (
              <>
                <Normaltekst>
                  {født.verdi
                    ? intl.formatMessage({ id: 'barnekort.fødselsdato' })
                    : intl.formatMessage({ id: 'barnekort.termindato' })}
                </Normaltekst>
                <Normaltekst>{fødselsdato.verdi}</Normaltekst>
              </>
            )}
          </div>
          <div className="informasjonselement">
            <Normaltekst>
              {intl.formatMessage({ id: 'barnekort.alder' })}
            </Normaltekst>
            <Normaltekst>
              {født.verdi ? alder.verdi : hentTekst('barnekort.erUfødt', intl)}
              {født.verdi && ' ' + intl.formatMessage({ id: 'barnekort.år' })}
            </Normaltekst>
          </div>
          <div className="informasjonselement">
            <Normaltekst>
              {intl.formatMessage({ id: 'barnekort.bosted' })}
            </Normaltekst>
            <Normaltekst>{bosted}</Normaltekst>
          </div>
          {velgBarnForDenneSøknaden}
          {lagtTil ? (
            <div className="barnekort__endre-barnekort">
              <Normaltekst>
                <span
                  className="lenke"
                  onClick={() => settÅpenEndreModal(true)}
                >
                  {intl.formatMessage({ id: 'barnekort.lenke.endre' })}
                </span>
              </Normaltekst>
            </div>
          ) : null}
          {lagtTil ? (
            <div className="barnekort__endre-barnekort">
              <Normaltekst>
                <span className="lenke" onClick={() => slettBarn(id)}>
                  {intl.formatMessage({ id: 'barnekort.fjern' })}
                </span>
              </Normaltekst>
            </div>
          ) : null}
        </div>
        <Modal
          isOpen={åpenEndreModal}
          onRequestClose={() => settÅpenEndreModal(false)}
          closeButton={true}
          contentLabel="legg til barn modal"
        >
          <div style={{ padding: '2rem 2.5rem' }}>
            <LeggTilBarn
              settÅpenModal={settÅpenEndreModal}
              id={id}
              barneListe={barneListe}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
              settBarneListe={settBarneListe}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Barnekort;
