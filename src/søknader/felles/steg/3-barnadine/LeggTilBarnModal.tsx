import { Button, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { ModalWrapper } from '../../../../components/Modal/ModalWrapper';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentNyttBarn } from '../../../../helpers/steg/barn';
import { ESvar } from '../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../models/steg/barn';
import { hentTekst } from '../../../../utils/teksthåndtering';
import type { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { barnetFødt } from './BarneConfig';
import styles from './LeggTilBarnModal.module.css';
import { LeggTilBarnUfødt } from './LeggTilBarnUfødt';

interface Props {
    tittel: string;
    lukkModal: () => void;
    id?: string;
    settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
    barneListe: IBarn[];
    oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
}

export const LeggTilBarnModal: React.FC<Props> = ({
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
    const [skalHaBarnepass, settSkalHaBarnepass] = useState<boolean | undefined>(true);
    const barnetFødtSpm = barnetFødt(intl);

    useEffect(() => {
        if (id) {
            const detteBarnet = barneListe.find(b => b.id === id);

            settNavn(detteBarnet?.navn?.verdi ? detteBarnet.navn.verdi : '');
            settIdent(detteBarnet?.ident?.verdi ? detteBarnet.ident.verdi : '');
            settBarnFødt(detteBarnet?.født?.verdi);
            settBoHosDeg(detteBarnet?.harSammeAdresse?.verdi ? ESvar.JA : ESvar.NEI);
            settSkalHaBarnepass(detteBarnet?.skalHaBarnepass?.verdi);
            detteBarnet?.fødselsdato.verdi && settDato(detteBarnet.fødselsdato?.verdi);
        }
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

        const erBarnFødtSvar = barnetFødtSpm.svaralternativer.find(svar => svar.id === ESvar.NEI);
        erBarnFødtSvar && settDokumentasjonsbehovForBarn(barnetFødtSpm, erBarnFødtSvar, nyttBarn.id);

        oppdaterBarnISøknaden(nyttBarn);

        lukkModal();
    };

    return (
        <ModalWrapper tittel={tittel} visModal={true} onClose={lukkModal}>
            <VStack gap="space-24" aria-live="polite" className={styles.modalInnhold}>
                <LeggTilBarnUfødt settBo={settBo} boHosDeg={boHosDeg} settDato={settDato} barnDato={barnDato} />
                {boHosDeg && (
                    <Button
                        className={styles.leggTilBarnKnap}
                        data-testid="leggTilBarnModal"
                        variant="primary"
                        aria-live="polite"
                        onClick={() => leggTilEllerEndreBarn(id)}
                    >
                        {hentTekst('barnadine.leggtil', intl)}
                    </Button>
                )}
            </VStack>
        </ModalWrapper>
    );
};
