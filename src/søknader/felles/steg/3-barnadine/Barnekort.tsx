import React from 'react';
import barn1 from '../../../../assets/barn1.svg';
import barn2 from '../../../../assets/barn2.svg';
import barn3 from '../../../../assets/barn3.svg';
import ufødtIkon from '../../../../assets/ufodt.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IBarn } from '../../../../models/steg/barn';
import { formatDate, strengTilDato } from '../../../../utils/dato';
import { Heading, VStack } from '@navikt/ds-react';
import { InformasjonsElement } from './BarnekortInformasjonsElement';
import styles from './Barnekort.module.css';

interface Props {
  gjeldendeBarn: IBarn;
  footer: React.ReactNode;
}

export const Barnekort: React.FC<Props> = ({ gjeldendeBarn, footer }) => {
  const intl = useLokalIntlContext();

  const {
    navn,
    fødselsdato,
    født,
    ident,
    alder,
    lagtTil,
    harSammeAdresse,
    medforelder,
    harAdressesperre,
  } = gjeldendeBarn;

  const formatFnr = (fødselsnummer: string) => {
    return fødselsnummer.substring(0, 6) + ' ' + fødselsnummer.substring(6, 11);
  };

  const ikoner = [barn1, barn2, barn3];
  const ikon = født?.verdi ? ikoner[Math.floor(Math.random() * ikoner.length)] : ufødtIkon;

  let bosted: string;

  if (lagtTil) {
    bosted = født?.verdi
      ? harSammeAdresse.verdi
        ? hentTekst('barnekort.adresse.bor', intl)
        : hentTekst('barnekort.adresse.borIkke', intl)
      : harSammeAdresse.verdi
        ? hentTekst('barnekort.adresse.skalBo', intl)
        : hentTekst('barnekort.adresse.skalIkkeBo', intl);
  } else {
    bosted = harSammeAdresse.verdi
      ? hentTekst('barnekort.adresse.registrert', intl)
      : hentTekst('barnekort.adresse.uregistrert', intl);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img alt="barn" src={ikon} />
      </div>
      <VStack gap="space-16" className={styles.innhold}>
        <Heading size="small" level="3">
          {navn.verdi ? navn.verdi : hentTekst('barnekort.normaltekst.barn', intl)}
        </Heading>
        {!harAdressesperre &&
          (ident.verdi ? (
            <InformasjonsElement
              forklaringId={'barnekort.fødselsnummer'}
              verdi={formatFnr(ident.verdi)}
            />
          ) : (
            <InformasjonsElement
              forklaringId={født?.verdi ? 'barnekort.fødselsdato' : 'barnekort.termindato'}
              verdi={formatDate(strengTilDato(fødselsdato.verdi))}
            />
          ))}
        <InformasjonsElement
          forklaringId={'barnekort.alder'}
          verdi={
            født?.verdi
              ? alder.verdi + ' ' + hentTekst('barnekort.år', intl)
              : hentTekst('barnekort.erUfødt', intl)
          }
        />
        {!harAdressesperre && (
          <InformasjonsElement forklaringId={'barnekort.bosted'} verdi={bosted} />
        )}
        {medforelder && (medforelder.verdi?.navn || medforelder.verdi?.alder) && (
          <InformasjonsElement
            forklaringId={'barnasbosted.forelder.annen'}
            verdi={
              medforelder?.verdi && medforelder?.verdi.navn
                ? medforelder?.verdi?.navn
                : medforelder?.verdi?.alder
                  ? `${hentTekst('barnekort.medforelder.hemmelig', intl)}, ${
                      medforelder.verdi.alder
                    }`
                  : null
            }
          />
        )}
        {footer}
      </VStack>
    </div>
  );
};
