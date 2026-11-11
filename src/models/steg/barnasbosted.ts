export enum EHarSamværMedBarn {
    jaIkkeMerEnnVanlig = 'jaIkkeMerEnnVanlig',
    jaMerEnnVanlig = 'jaMerEnnVanlig',
    nei = 'nei',
}

export enum EHarSkriftligSamværsavtale {
    jaKonkreteTidspunkter = 'jaKonkreteTidspunkter',
    jaIkkeKonkreteTidspunkter = 'jaIkkeKonkreteTidspunkter',
    nei = 'nei',
}

export enum EBorAnnenForelderISammeHus {
    ja = 'ja',
    nei = 'nei',
    vetikke = 'vetikke',
}

export enum EHvorMyeSammen {
    møtesIkke = 'møtesIkke',
    kunNårLeveres = 'kunNårLeveres',
    møtesUtenom = 'møtesUtenom',
}

export enum ESkalBarnetBoHosSøker {
    ja = 'ja',
    jaMenSamarbeiderIkke = 'jaMenSamarbeiderIkke',
    neiMenAvtaleDeltBosted = 'neiMenAvtaleDeltBosted',
    nei = 'nei',
}

export enum EHvorforIkkeOppgi {
    donorbarn = 'donorbarn',
    annet = 'annet',
}

export enum TypeBarn {
    BARN_MED_OPPRINNELIG_FORELDERINFORMASJON = 'BARN_MED_OPPRINNELIG_FORELDERINFORMASJON',
    BARN_MED_KOPIERT_FORELDERINFORMASJON = 'BARN_MED_KOPIERT_FORELDERINFORMASJON',
    BARN_UTEN_FELLES_FORELDERINFORMASJON = 'BARN_UTEN_FELLES_FORELDERINFORMASJON',
}
