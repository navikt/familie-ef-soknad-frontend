import type { LokalIntlShape } from '../language/typer';

const REGEX_FEIL = /^CODE=(.*)$/;

const createId = (prefixId: string, id: string) => `${prefixId}.${id}`;

/**
 * Genererer feilmelding fra feil fra backend som kan inneholde en kode.
 * @param intl
 * @param prefixId eks `filopplaster.feilmelding`
 * @param defaultSuffixId eks `generisk`, blir satt sammen med prefixId => `filopplaster.feilmelding.generisk`
 * @param feilmelding eks `CODE=FOO` blir satt sammen med prefixId => `filopplaster.feilmelding.FOO`
 */
export const getFeilmelding = (
    intl: LokalIntlShape,
    prefixId: string,
    defaultSuffixId: string,
    feilmelding?: string
): string => {
    const matches = REGEX_FEIL.exec(feilmelding || '');
    if (matches?.length && matches?.length > 0) {
        const id = createId(prefixId, matches[1]);
        if (intl.messages[id]) {
            return intl.formatMessage({ id: id });
        }
    }
    return intl.formatMessage({ id: createId(prefixId, defaultSuffixId) });
};
