import type { LokalIntlShape } from '../../language/typer';
import { linjeKursGrad } from '../../søknader/felles/steg/5-aktivitet/utdanning/UtdanningConfig';
import { hentUid } from '../../utils/autentiseringogvalidering/uuid';
import { hentTekst } from '../../utils/teksthåndtering';
import { nyttTekstFelt, tomPeriode } from '../tommeSøknadsfelter';

export const lagTomUtdanning = (intl: LokalIntlShape) => ({
    id: hentUid(),
    linjeKursGrad: {
        label: hentTekst(linjeKursGrad.label_tekstid, intl),
        verdi: '',
    },
    periode: tomPeriode,
});

export const lagTomUnderUtdanning = () => ({
    id: hentUid(),
    skoleUtdanningssted: nyttTekstFelt,
});
