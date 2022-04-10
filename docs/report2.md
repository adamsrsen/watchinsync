# WatchInSync - Adam Sršeň
# Report 2 (21.3.2022 - 27.3.2022)
## Týždenný plán

 - Vytvorenie tabuliek databázy
 - Spraviť základné prepojenie stránky z databázou
 - Spraviť základnú synchronizáciu videa cez priame odkazy
 
## Commity
 - Zadefinovanie tabuliek pomocou TypeORM. Commit b5283b64595b4dfdbba76ea82e1403586a24d173
 - Spojaznenie TypeORM query buildera v Next.js. Commit 36b117a6fd6a41c6e1af7a78b8ab995f484cc780
 - Pridanie `public` stĺpca do tabuľky `rooms`, vyriešenie ďalších nezhôd medzi TypeORM a Next.js. Commit b7c0213bd1f8099b986a7ed5b49067b8fe6eb306
 - Prepojenie databázy s aplikáciou, pridávanie/odstraňovanie miestností, prezeranie verejných miestností, pridávanie/odstraňovanie videí do/zo zoznamu videí v miestnoti. Commit 3e4f1279b72729e752db0bb2f615c80401e8cf52
 - Vytvorenie endpointu pre socket.io a automatické obnovenie zoznamu videí pri zmene. Commit d8a0dedf6cc46d9ce6a60e8b37f6879ebf558d5e
 - Pridanie prehrávania `direct link` videí pomocou Video.js a základná synchronizácia medzi používateľmi (spustiť, zastaviť, zmeniť čas). Commit 969bc34dce8044abc2f3e29cd443c61608fb39a8

## Plán na ďalši týždeň

 - pridanie prehrávania YouTube videí
 - pridanie prehrávania Vimeo videí
 - pridanie prehrávania Twitch videí

## Záver
Tento týždeň som sa venoval primárne tomu, aby spolu jednotlivé knižnice spolu fungovali. Tu som narazil na pár problémou súvisiacich hlavne s knžnicami TypeORM a Next.js kde Next.js nechcel správne kompilovať `entity` zadefinovaných tabuliek databázy. Ďalší problém na, ktorý som narazil bol s nemožnosťou spustenia videa, čo je dlhodobý problém Video.js, ktorý znemožnuje zadefinovanie zdroju videa vo `<video>` tagu, ale nutnosť zadefinovať zdroj videa pomocou `<source>` tagu. Celkovo som tento týždeň zvládol spraviť naplánované veci a dokončiť nedorobené časti z minulého týždňa. Venoval som 15 hodín tento týždeň projektu. 