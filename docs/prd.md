# Source Mindmap App - PRD

## 1. Executive Summary

### One-liner

Source Mindmap App aide les builders, redacteurs et knowledge workers a comprendre et restructurer leurs fichiers sources reels via une mindmap editable, sans creer de copie obsolete.

### Why now?

Le travail avec des agents produit beaucoup de fichiers Markdown, TS, TSX et docs. Ces fichiers changent vite, mais les outils de mindmap classiques ne restent pas synchronises avec eux. Il manque une vue structurelle qui lise et ecrive directement les sources.

### Success looks like

- Ouvrir un dossier existant et voir les fichiers mindmappables.
- Importer un fichier Markdown en mindmap.
- Modifier une branche source et voir le fichier changer immediatement.
- Modifier le fichier hors app et voir la mindmap se mettre a jour.
- Comparer plusieurs sources sur une meme mindmap.

## 2. Target User

### Primary persona

Solo builder / consultant / designer-developpeur qui travaille avec Codex, Cursor, Claude Desktop et des repos locaux contenant beaucoup de Markdown, copy, specs, contrats et composants.

### Jobs to be Done

Quand mes fichiers de notes, specs ou copy deviennent trop longs ou disperses, je veux les voir sous forme de mindmap source-aware pour pouvoir les comprendre, les reorganiser et les modifier sans perdre la source unique.

Quand Codex ou Cursor cree/modifie un fichier, je veux que ma vue mindmap se mette a jour automatiquement pour rester synchronisee avec la realite du repo.

Quand je redacte un contrat, je veux deplacer des articles sans devoir corriger manuellement tous les renvois internes.

## 3. MVP Scope

### P0

- Ajouter aux fichiers Markdown une vue Cards derivee, sans creer de fichier `.canvas` canonique.
- Transformer les headings et leur hierarchie en cards de chapitres pour le premier lot executable.
- Ouvrir un dossier source existant.
- Scanner les fichiers `.md`.
- Afficher les fichiers nouveaux/non mindmappes.
- Creer une mindmap depuis un fichier.
- Ajouter plusieurs fichiers a une meme mindmap.
- Parser Markdown en titres pour le premier lot, avec une architecture permettant ensuite la fragmentation en paragraphes, listes, regles et phrases.
- Afficher la mindmap hierarchique.
- Editer une branche source avec autosave immediat.
- Deplacer une branche source dans sa hierarchie et reecrire la source.
- Masquer une branche sans modifier la source.
- Ajouter un label visuel sans modifier la source.
- Ajouter une branche commentaire hors source.
- Watcher les changements externes et reparser automatiquement.
- Stocker les metadonnees dans `D:\SYSTEM\.mindmap`.

### P1

- Ajouter la fragmentation progressive d'un chapitre en sous-chapitres, paragraphes, listes, regles et phrases sous forme de cards enfants.
- Support rapide des environnements utilises avec Cursor/Codex : `content/*.ts` simple, puis sources code contenant de la copy.
- Liens `compare` entre branches.
- Support des alternatives de phrases en metadonnees.
- Renvois dynamiques dans Markdown avec IDs stables.
- Branches enfant de preview/reference pour lire la cible d'un renvoi directement sous la branche courante sans se deplacer dans le document. Ces branches sont des mirrors/reference previews, pas des copies.
- Les previews de renvois sont repliees par defaut avec un indicateur visible du nombre de references.
- Preview Document pour lire/exporter le rendu.

### P2

- Import TSX/JSX avance avec extraction des textes.
- Labels automatiques pour nettoyer les conventions code.
- Vue feed/revue/radar mobile-cloud issue de `notes-feed-saas`, basee sur les sources et mindmaps existantes.
- Sync cloud via `notes-feed-saas`.
- Images et assets associes aux branches.
- Export PDF/DOCX.
- Adaptateur Heptabase optionnel : publier des notes et modules de skills comme repliques editables pour la recherche IA, la lecture, les whiteboards et la selection de passages.
- Synchronisation bidirectionnelle Heptabase/local : toute edition distante valide reecrit automatiquement la source locale ; toute edition locale actualise la carte distante ; les conflits concurrents sont suspendus et presentes, jamais resolus par derniere ecriture.
- Recall depuis Heptabase : une selection explicite devient un candidat local relie au passage source ; l'admission pedagogique, la correction et la creation de card restent pilotees par les workflows locaux.

## 4. User Flows

### Navigation model

Le MVP affiche une seule mindmap active a la fois. La navigation se fait par une sidebar avec :

- dossiers sources surveilles, affiches avec leur hierarchie reelle comme dans un IDE/iA Writer ;
- mindmaps creees ;
- elements recents ;
- fichiers nouveaux/non mindmappes ;
- changements a valider ;
- branches cachees.

Dans l'arborescence source, seuls les fichiers mindmappables sont ouvrables au MVP, d'abord les `.md`. Un fichier peut etre ouvert en lecture Document, ou glisse/depose dans une mindmap pour etre importe et transforme en branches source-aware.

Quand un fichier `.md` est glisse dans une mindmap, il devient une branche racine source. Sa structure interne devient ses enfants : headings, phrases, groupes de paragraphes et autres blocs supportes.

Le MVP importe les fichiers entiers, pas des selections partielles. Cliquer un `.md` ouvre la vue Document ; glisser un `.md` vers le Canvas importe tout le fichier. L'import partiel de section reste hors MVP.

L'import applique immediatement un layout automatique propre pour rendre la mindmap lisible sans repositionnement manuel initial.

Layout auto par defaut : hybride document. Le fichier importe devient la racine ; les sections principales partent en branches ; les phrases restent empilees verticalement sous leur section pour conserver une lecture naturelle du document.

Les branches source affichent le texte complet par defaut. La lisibilite et l'edition priment sur la compacite. Les labels peuvent remplacer l'affichage quand l'utilisateur veut une vue plus synthetique, mais le texte source complet reste accessible.

Les branches source utilisent une largeur de lecture limitee pour rester lisibles, avec un objectif d'environ 12 a 15 mots par ligne. Valeurs indicatives : phrase 45-60ch, titre 25-45ch, label court 18-32ch, panneau lecture/focus 65-75ch. La hauteur s'adapte au texte complet.

Le MVP ne prevoit pas de mode Focus Canvas separe. La lecture focus est couverte par la vue Document/reader Markdown. Le Canvas doit surtout fournir zoom, pan et collapse propres.

Toute branche qui a des enfants peut etre repliee/depliee. Commandes attendues : collapse/expand branche, collapse siblings, collapse all under file, expand all under file. Cela vaut pour fichiers, sections, groupes, phrases avec alternatives/commentaires et mirrors.

Creation : l'utilisateur doit pouvoir creer un nouveau Canvas/mindmap, puis creer un nouveau fichier Markdown source directement dans ce Canvas. Le nouveau fichier devient une branche racine source ; ses branches enfants ecrivent le `.md` au fur et a mesure.

Un nouveau fichier cree depuis le Canvas peut demarrer comme fichier non classe, en dehors des dossiers sources surveilles. Il reste un vrai fichier `.md`, stocke physiquement dans `D:\SYSTEM\MINDMAP_INBOX\` et visible dans une zone "Non classes" de la sidebar. L'utilisateur peut ensuite le deplacer vers le bon dossier source ; l'app met alors a jour les references de la mindmap.

Au premier lancement, l'app cree automatiquement `D:\SYSTEM\MINDMAP_INBOX\` si le dossier n'existe pas.

L'app cree aussi automatiquement `D:\SYSTEM\.mindmap\` au premier lancement si absent, avec la structure minimale `maps\`, `indexes\` et `settings.json`.

Undo/safety : l'app doit combiner un undo immediat en memoire avec des snapshots persistants dans `D:\SYSTEM\.mindmap\snapshots\`. Les snapshots capturent les fichiers sources modifies et les metadonnees mindmap affectees. Ils sont limites par retention, par exemple les 50 dernieres operations par fichier ou une fenetre recente de 24/48h.

Les diffs ne sont pas affiches apres chaque edition. Ils restent disponibles a la demande depuis l'historique, l'undo ou les snapshots.

Une mindmap peut contenir des sources venant de plusieurs dossiers differents. Chaque branche source doit garder et pouvoir afficher son origine : dossier racine, fichier et emplacement source.

L'origine d'une branche source est affichee avec un badge compact. Le detail complet apparait au hover ou a la selection. Depuis ce detail, l'utilisateur peut ouvrir rapidement le fichier ou l'extrait source dans un panneau lateral gauche ou droit.

Au MVP, le panneau lateral source est en lecture seule. Il sert a verifier le contexte source et a ouvrir le fichier dans un outil externe si besoin. L'edition de la source se fait via les branches du Canvas.

### Flow A - Creer une mindmap depuis un Markdown

1. L'utilisateur ouvre un dossier.
2. L'app liste les `.md` detectes.
3. L'utilisateur choisit "Creer mindmap".
4. L'app parse titres, paragraphes, phrases.
5. L'utilisateur edite/deplace des branches.
6. Le fichier Markdown est mis a jour immediatement.

### Flow B - Source modifiee par Codex

1. Codex modifie un fichier.
2. Git voit le fichier modifie.
3. L'app detecte le changement via file watcher.
4. L'app reparse la source.
5. La mindmap reflete la nouvelle structure.

### Flow C - Comparer plusieurs sources

1. L'utilisateur cree une mindmap de travail.
2. Il ajoute plusieurs fichiers sources.
3. Il relie des branches avec un lien `compare`.
4. Il labelise ou masque le bruit.
5. Il modifie les branches source utiles.
6. Chaque modification touche uniquement le fichier source lie a la branche.

### Flow D futur - Etudier et modifier depuis Heptabase

1. L'utilisateur autorise explicitement un fichier ou module local a etre etudie dans Heptabase.
2. L'app cree ou actualise la carte distante et conserve le mapping stable entre source, blocs et objet Heptabase.
3. L'utilisateur recherche, questionne l'IA, reorganise ou modifie le contenu dans Heptabase.
4. Le connecteur detecte la revision distante et calcule son diff contre la derniere base synchronisee.
5. Si seul Heptabase a change, le patch est applique atomiquement au Markdown local, snapshotte, puis reparsed.
6. Si les deux cotes ont change, l'app tente une fusion a trois voies ; toute ambiguite suspend l'ecriture et ouvre une validation.
7. Un passage marque pour recall revient comme selection candidate vers la source locale avant toute question ou creation de card.

## 5. Non-Goals MVP

- Pas de SaaS public.
- Pas de feed type Twitter ou timeline passive.
- Pas de commit/push Git depuis l'app.
- Pas de chatbot central.
- Pas d'organisation automatique par IA.
- Pas de remplacement de Cursor/Codex/Claude Desktop.
- Pas d'edition libre de code structurel en V1.
- Pas de sync cloud bidirectionnelle en V1.
- Pas d'import massif dans Heptabase avant validation d'un prototype de round-trip sur des fichiers factices.
- Pas d'export DOCX/PDF en V1.
- Pas de module `notes-feed-saas` en V1 : il devient une couche future au-dessus du source-aware index.

## 6. Core Rules

### Branch types

- `source` : liee a un range ou node source ; edition modifie la source.
- `label` : remplace l'affichage ; ne modifie pas la source.
- `comment` : note hors source ; non exportee.
- `mirror` : affiche une source ailleurs ; edition texte modifie la source, deplacement ne change pas l'ordre source.
- `reference-preview` : affiche localement la cible d'un renvoi dynamique ; edition texte modifie la source cible, deplacement ne modifie pas l'ordre source.
- `group` : organisation de travail ; peut ne pas exister dans la source.

### Editing

- Edition source = ecriture immediate dans le fichier.
- Hide = metadonnee, jamais suppression.
- Label = metadonnee, jamais source.
- Delete source = suppression directe dans le fichier source, comme dans un editeur Markdown normal. Pas de confirmation bloquante en usage courant, mais undo/snapshot obligatoire.
- Les branches masquees restent listees dans le menu gauche pour garder une vue de ce qui est cache pour chaque fichier/mindmap.
- Le masquage existe a deux niveaux : masquer dans cette mindmap ou masquer globalement pour cette source. L'action par defaut masque seulement dans la mindmap actuelle.

### External source changes

Quand une source est modifiee hors app par Codex, Cursor, Claude Desktop ou un editeur, l'app reparse automatiquement le fichier. La source actuelle reste affichee sans blocage, mais les impacts sur les metadonnees mindmap sont ajoutes a un historique de changements.

Le menu gauche affiche les changements a valider : branches modifiees, supprimees, nouvelles, labels/commentaires/liens a reconnecter. Les branches concernees ont aussi un rappel visuel directement dans le Canvas.

La validation ne bloque pas l'usage. Elle sert a confirmer ou reparer les labels, commentaires, liens, alternatives, masquages et mirrors affectes par les changements externes.

Une branche passe en validation si le texte source modifie porte un label, si une source supprimee portait un commentaire/label/alternative, si une branche a ete deplacee hors app, si une nouvelle branche source est detectee, si un lien `compare` pointe vers une branche fortement modifiee, ou si un mirror ne retrouve plus sa source.

Les petits changements typographiques peuvent etre appliques silencieusement. Les changements significatifs sont marques a valider. Les disparitions et conflits sont marques comme priorite forte.

### External editable replicas

Le fichier local reste la representation canonique et Git son historique durable, mais une replique externe autorisee peut servir d'interface d'edition. Une modification distante n'est jamais une seconde verite durable : elle devient une transaction entrante qui doit modifier automatiquement le fichier local ou etre placee en conflit explicite.

Chaque replique conserve au minimum un `sourceId`, un identifiant externe, le hash de la derniere base commune et les revisions connues des deux cotes. La synchronisation compare toujours local, distant et base commune. Aucun ecrasement silencieux par timestamp n'est autorise.

Les contenus executables ou fragiles, notamment le frontmatter et les instructions de routage d'un `SKILL.md`, ne sont editables a distance qu'apres preuve de round-trip sans perte. A defaut, seuls les modules pedagogiques Markdown explicitement autorises sont publies.

### Ordering

La mindmap est hierarchique. Le parent definit le contexte. Entre enfants d'un meme parent source, l'ordre vertical determine l'ordre dans la source.

La profondeur determine aussi le type rendu dans la source. Si une phrase est deposee comme enfant d'un paragraphe, elle devient une phrase de ce paragraphe. Si elle est deposee au meme niveau que les paragraphes, apres un paragraphe existant, elle devient un nouveau paragraphe.

Regle inspiree d'Essay.app : une phrase seule au niveau bloc peut etre traitee comme un titre/heading potentiel ; un groupe de plusieurs phrases est reconnu comme un paragraphe. L'app doit permettre de transformer explicitement une phrase bloc en heading ou en paragraphe selon l'intention.

Decision UX : les paragraphes ne sont pas affiches comme branches intermediaires par defaut. Les phrases apparaissent directement sous le heading/section, avec une representation visuelle des frontieres de paragraphes pour conserver le rendu Markdown.

Mode Essay : les titres de paragraphes sont des labels de travail hors source par defaut. Ils aident a comprendre l'idee du paragraphe dans la mindmap, mais n'apparaissent pas dans la lecture/export Markdown. L'utilisateur peut explicitement convertir un label en heading Markdown si ce titre doit devenir une partie du document.

Les alternatives de phrases sont hors source par defaut. La phrase choisie remplace le texte source ; les alternatives non retenues restent dans `D:\SYSTEM\.mindmap` comme materiau de travail et n'apparaissent pas dans le Markdown/export.

Une aide automatique peut suggerer un label/titre de paragraphe a partir des phrases du paragraphe. Cette suggestion reste un label hors source tant que l'utilisateur ne la convertit pas explicitement en heading Markdown. Ce n'est pas une organisation automatique du document.

Les commentaires peuvent etre attaches a une branche source ou exister comme branches commentaires libres. Dans les deux cas, ils restent hors source par defaut et ne sont pas inclus dans la lecture/export Markdown.

## 7. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Rewriting Markdown casse la source | High | snapshots, diff, parser AST, tests fixtures |
| Fuzzy matching perd les IDs apres edition externe | High | anchors robustes, hash + contexte, fallback manuel |
| Code import trop ambitieux | High | commencer par Markdown, puis `content/*.ts` |
| Canvas devient confus | Medium | branch types visibles, source vs label/comment clair |
| App devient IDE | Medium | pas de Git, pas de code editor complet |
| Heptabase normalise ou perd du Markdown | High | spike de round-trip, allowlist de syntaxes, diff strict avant activation |
| Editions concurrentes locale/distante | High | base commune, fusion a trois voies, conflit explicite, jamais `last write wins` |
| Highlight distant impossible a remapper | High | identite de bloc + heading + hash de passage, Recall Inbox explicite, fallback manuel |

## 8. Success Metrics

- Importer et editer 10 fichiers Markdown reels sans corruption.
- 90% des modifications externes sont reconnues et remappees correctement.
- Reproduire d'abord un cas Markdown reel ; le cas Dec Home devient le benchmark des adapters code apres le MVP Markdown.
- Rediger/restructurer un document avec 30+ paragraphes plus vite qu'en Markdown brut.
- Avant activation Heptabase : reussir des allers-retours edition, reorganisation, highlight et suppression sur une note PKA, un module de skill et une card factices, avec un diff local limite aux intentions utilisateur.
