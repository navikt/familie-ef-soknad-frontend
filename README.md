# familie-ef-soknad

Frontend - søknad for enslig forsørger.

## Kjør lokalt

1. `npm install`
2. `npm start`

Kjør uten redirect til autentisering lokalt: 
sett .env variabel: 
REACT_APP_BRUK_API_I_DEV=false

Med api må du sette cookie første gang:
`http://localhost:8091/local/cookie?redirect=http://localhost:3000/familie/alene-med-barn/soknad/`

## Kjør lokalt med mellomlagring
1. Last ned (familie-dokument)[https://github.com/navikt/familie-dokument] og (familie-ef-soknad-api)[https://github.com/navikt/familie-ef-soknad-api]
2. Kjør `mvn clean install` i begge prosjektene
2. Kjør opp appene lokalt ved å kjøre familie-dokument din `DevLauncher` og familie-ef-soknad-api sin `ApplicationLocalLauncher` 

## Sett opp Prettier lokalt on save (IntelliJ)

1. I IntelliJ, åpne `Preferences/Plugins` for så å søke opp og installere `File Watchers` og `Prettier` hvis dette ikke allerede er gjort.  
2. Finn `File Watchers` under `Preferences/Tools/File Watchers`, og trykk på `+-ikonet nederst til venstre. for å legge til en ny Watcher.
3. Fyll deretter inn feltene slik som tabellen under, og fjern ellers avhuking på `Auto-Save edited files to trigger the watcher` og `Trigger the watcher on external changes`. Trykk ok. 
 

| File Watcher  | Second Header |
| -------- | ------------ |
| Name  | Prettier |
| File type | any |
|  Scope | Project Files |
| Program | $ProjectFileDir$/node_modules/.bin/prettier |
| Arguments | --write $FilePathRelativeToProjectRoot$ |
| Output paths to refresh | $FilePathRelativeToProjectRoot$ |
| Working Directory | $ProjectFileDir$ |


Test om Prettier fungerer ved å gå inn i en tilfeldig tsx-fil, lag et par nye linjer, og `Ctrl`+ `S`. Hvis koden reformatteres (fjerner alle utenom en av de tomme linjene), så er Prettier på plass lokalt! :sparkles:
