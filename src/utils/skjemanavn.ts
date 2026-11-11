export enum ESkjemanavn {
    Barnetilsyn = 'Barnetilsyn',
    Skolepenger = 'Skolepenger',
    Arbeidssøker = 'Arbeidssøker',
    Overgangsstønad = 'Overgangsstønad',
}

export const skjemanavnIdMapping = {
    [ESkjemanavn.Barnetilsyn]: 150002,
    [ESkjemanavn.Skolepenger]: 150004,
    [ESkjemanavn.Arbeidssøker]: 150801,
    [ESkjemanavn.Overgangsstønad]: 150001,
};

export const skjemanavnTilId = (skjemanavn: ESkjemanavn) => {
    return skjemanavnIdMapping[skjemanavn];
};

export const urlTilSkjemanavn = (url: string) => {
    if (url.includes('/barnetilsyn')) {
        return ESkjemanavn.Barnetilsyn;
    } else if (url.includes('/skolepenger')) {
        return ESkjemanavn.Skolepenger;
    } else if (url.includes('/arbeidssoker')) {
        return ESkjemanavn.Arbeidssøker;
    } else {
        return ESkjemanavn.Overgangsstønad;
    }
};
