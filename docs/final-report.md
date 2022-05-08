# WatchInSync - Adam Sršeň
# Final report (14.3.2022 - 8.5.2022)
[Repozitár](https://github.com/adamsrsen/watchinsync)

[Stránka projektu](https://watchinsync.srsen.xyz)
 
## Features
 - Uživatelské prostredie ✅
 - Navigácia stránkou ✅
 - Synchroniácia videa ✅
 - Podpora priamich odkazov cez Video.js ✅
 - Podpora YouTube videí ✅
 - Podpora Vimeo videí ✅
 - Podpora Twitch videí ✅
 - Podpora Facebook videí ✅
 - Prihlasovanie ✅
 - Právomoci ✅
 - Chat ✅
 - Video chat ❌ (nestihol som to implementovať, kvôli výreznému časovému podhodnoteniu právomocí)

✅ - implementované
🔵 - rozpracované
❌ - neimplmentované

## Venovaný čas projektu
84 hodín (70 hodín som mal naplánovaných bez dolaďovania, väčšinu rozdielu tvorí implementácia právomocí a dolaďovanie aplikácie)

## Problémy
Najväčšie problémy som mal zo začiatku kedy som sa snažil používať TypeORM s Next.js, čo sa mi nakoniec podarilo rozbehať. Ďalším problémom bola synchronizácia videa a spravenie jednotnej synchronizácie pre všetky platformy, kvôli rozličným implementáciam prehrávačou a rôznej dostupnosti funkcií.

## Čo by som robil inak
Trochu inak by som navrhol databázu hlavne právomoci a vybral by som si iné knižnice, ktoré lepšie fungujú dokopy.

## Záver
Najviac som hrdý na to že to funguje. Som pomerne spokojný s finálnou verziou projektu, ale mrzí ma že som nestihol implementovať video chat a niektoré veci nie si uplne doladené tak jak by sa mi to páčilo.

## Cloc
### Finálna verzia
| Language   | files | blank | comment | code  |
|------------|-------|-------|---------|-------|
| JSON       | 5     | 0     | 0       | 11054 |
| TypeScript | 77    | 486   | 51      | 4281  |
| Sass       | 24    | 99    | 0       | 532   |
| Markdown   | 8     | 40    | 0       | 144   |
| JavaScript | 1     | 1     | 1       | 23    |
| SVG        | 1     | 0     | 0       | 1     |
| SUM        | 116   | 626   | 52      | 16035 |
### Kostra
| Language   | files | blank | comment | code |
|------------|-------|-------|---------|------|
| JSON       | 4     | 0     | 0       | 4951 |
| TypeScript | 6     | 11    | 4       | 60   |
| JavaScript | 2     | 3     | 1       | 23   |
| CSS        | 1     | 2     | 0       | 14   |
| Sass       | 1     | 0     | 0       | 3    |
| SUM        | 14    | 16    | 55      | 5051 |