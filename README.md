# familie-ef-soknad

Frontend - søknad for enslig forsørger.

## Kjør lokalt
Lokal kjøring krever internett da tokenet hentes fra fakedings: `https://github.com/navikt/fakedings` 

1. `npm install`
2. `npm run start`
3. Kjør opp `familie-ef-soknad-api`
4. Gå til `http://localhost:3000/familie/alene-med-barn/soknad/`

### Mot preprod:
1. Hent token fra 
   - [`https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teamfamilie:familie-ef-soknad-api`](https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teamfamilie:familie-ef-soknad-api)
   - [`https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teamfamilie:familie-dokument`](https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:teamfamilie:familie-dokument)
2. `.env` må inneholde følgende
 ``` 
TOKENX_API=...
TOKENX_DOKUMENT=...
```
Du kan også hente token ved å kjøre `dev:hent-tokens` med person ident fra Dolly. Dette gjøre den manuelle prosessen litt enklere, da den fyller ut .env filen automagisk!
3. `npm install` 
4. `npm run start:preprod` 
5. Gå til url: `http://localhost:3000/familie/alene-med-barn/soknad/`

* Hvis man ønsker å kjøre med mock-api
1. `node mock/mock-server.js`
2. `npm run start:mock`

## Kjør lokalt med mellomlagring
1. Last ned [familie-dokument](https://github.com/navikt/familie-dokument) og [familie-ef-soknad-api](https://github.com/navikt/familie-ef-soknad-api)
2. Kjør `mvn clean install` i begge prosjektene
2. Kjør opp appene lokalt ved å kjøre familie-dokument din `DevLauncher` og familie-ef-soknad-api sin `ApplicationLocalLauncher` 

## Testing
Appen benytter [vitest](https://vitest.dev/) til enhetstesting. Legg gjerne til nye tester etter oppdateringer av appen.
For å kjøre opp tester lokalt kan man kjøre `npm run test`. For å kjøre opp testene i interaktiv modus kan man kjøre `npm run vitest`.

## Tekstinnhold
I appen har vi tekstinnhold på norsk bokmål, engelsk og nynorsk. 
Ønsker du å legge til eller redigere på en tekst, skal dette gjøres i exceldokumentet "EF Tekstinnhold App Søknadsdialog" som du finner på Teams under Team Familie > Enslig forsørger > Filer > Søknadsdialog > "EF Tekstinnhold App Søknadsdialog". 
1. Åpne "EF Tekstinnhold App Søknadsdialog" i nettleseren
2. Trykk på "Automate" i fanen, og velg "EF Script - Konverter tabell til json format".
3. Trykk på "Vis/Show" fulgt av "Kjør/Run".

Det skrives ut 3 ulike tekstbolker i "Utdata"-fanen under kodesnutten. Denne skal kopieres og limes inn i tilhørende "tekster_xx.json" fil. Husk å kjøre reformat (optn + cmd + l")


## Sett opp Prettier lokalt on save (IntelliJ)

1. I IntelliJ, åpne settings. Finn prettier. Ligger under Languages and Frameworks -> Javascript -> Prettier.
2. Sjekk av bokser for: 'On reformat code' og 'On save'

Test om Prettier fungerer ved å gå inn i en tilfeldig tsx-fil, lag et par nye linjer, og `Ctrl`+ `S`. Hvis koden reformatteres (fjerner alle utenom en av de tomme linjene), så er Prettier på plass lokalt! :sparkles:

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.
