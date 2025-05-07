import React, { useEffect, useState } from 'react';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import LeggTilBarnUfødt from './LeggTilBarnUfødt';
import Seksjonsgruppe from '../../../components/gruppe/SeksjonGruppe';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { IBarn } from '../../../models/steg/barn';
import { hentNyttBarn } from '../../../helpers/steg/barn';
import { ESvar } from '../../../models/felles/spørsmålogsvar';
import LocaleTekst from '../../../language/LocaleTekst';
import { Button } from '@navikt/ds-react';
import { SettDokumentasjonsbehovBarn } from '../../../models/søknad/søknad';
import { styled } from 'styled-components';
import { ModalWrapper } from '../../../components/Modal/ModalWrapper';
import { barnetFødt } from './BarneConfig';

interface Props {
  tittel: string;
  lukkModal: () => void;
  id?: string;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
  barneListe: IBarn[];
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
}

const StyledSeksjonsgruppe = styled(Seksjonsgruppe)`
  min-height: 500px;
  width: 450px;
  padding: 2rem 2.5rem;

  @media (max-width: 767px) {
    width: auto;
    padding: 2rem 0;
  }
`;

const LeggTilBarnModal: React.FC<Props> = ({
  tittel,
  lukkModal,
  id,
  barneListe,
  settDokumentasjonsbehovForBarn,
  oppdaterBarnISøknaden,
}) => {
  const intl = useLokalIntlContext();

  const [barnDato, settBarnDato] = useState<string>('');
  const [født, settBarnFødt] = useState<boolean>();
  const [navn, settNavn] = useState('');
  const [ident, settIdent] = useState<string>('');
  const [boHosDeg, settBoHosDeg] = useState<string>('');
  const [skalHaBarnepass, settSkalHaBarnepass] = useState<boolean | undefined>(
    true
  );
  const barnetFødtSpm = barnetFødt(intl);

  useEffect(() => {
    if (id) {
      const detteBarnet = barneListe.find((b) => b.id === id);

      settNavn(detteBarnet?.navn?.verdi ? detteBarnet.navn.verdi : '');
      settIdent(detteBarnet?.ident?.verdi ? detteBarnet.ident.verdi : '');
      settBarnFødt(detteBarnet?.født?.verdi);
      settBoHosDeg(detteBarnet?.harSammeAdresse?.verdi ? ESvar.JA : ESvar.NEI);
      settSkalHaBarnepass(detteBarnet?.skalHaBarnepass?.verdi);
      detteBarnet?.fødselsdato.verdi &&
        settDato(detteBarnet.fødselsdato?.verdi);
    }
    // eslint-disable-next-line
  }, []);

  const settDato = (date: string): void => {
    date && settBarnDato(date);
  };

  const settBo = (nyttBo: string) => {
    settBoHosDeg(nyttBo);
  };

  const leggTilEllerEndreBarn = (id: string | undefined) => {
    const nyttBarn: IBarn = hentNyttBarn(
      id,
      ident,
      barnDato,
      navn,
      boHosDeg,
      født ? født : false,
      intl,
      skalHaBarnepass
    );

    const erBarnFødtSvar = barnetFødtSpm.svaralternativer.find(
      (svar) => svar.id === ESvar.NEI
    );
    erBarnFødtSvar &&
      settDokumentasjonsbehovForBarn(
        barnetFødtSpm,
        erBarnFødtSvar,
        nyttBarn.id
      );

    oppdaterBarnISøknaden(nyttBarn);

    lukkModal();
  };

  return (
    <ModalWrapper tittel={tittel} visModal={true} onClose={lukkModal}>
      <StyledSeksjonsgruppe aria-live="polite">
        <KomponentGruppe>
          <LeggTilBarnUfødt
            settBo={settBo}
            boHosDeg={boHosDeg}
            settDato={settDato}
            barnDato={barnDato}
          />
        </KomponentGruppe>
        {boHosDeg && (
          <Button
            variant="primary"
            aria-live="polite"
            onClick={() => leggTilEllerEndreBarn(id)}
          >
            <LocaleTekst tekst={'barnadine.leggtil'} />
          </Button>
        )}
      </StyledSeksjonsgruppe>
    </ModalWrapper>
  );
};

export default LeggTilBarnModal;
