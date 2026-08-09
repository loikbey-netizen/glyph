# Source Mindmap App - Idea

## One-liner

Une app desktop/local-first qui transforme des fichiers sources reels (`.md`, puis `.ts/.tsx/.jsx`) en mindmap editable, pour comprendre, structurer, comparer et modifier l'information sans creer de source parallele.

## Probleme

Les agents comme Codex, Claude Desktop et Cursor savent modifier des fichiers, mais ils sont mauvais pour lire des documents longs, visualiser la structure, comparer plusieurs sources et manipuler l'information comme un systeme de personal knowledge management.

Aujourd'hui, le workaround est de recopier la structure dans XMind, MindNode, Heptabase ou un autre outil de mindmap. Le probleme est que cette carte devient vite obsolete : si la source change, la mindmap ne suit pas ; si la mindmap change, la source ne suit pas.

## Vision

Le Canvas est la vue principale. Il affiche une mindmap hierarchique dont les branches peuvent etre liees a des morceaux reels de fichiers sources.

Modifier une branche source modifie immediatement le fichier source. Modifier le fichier source avec Codex, Cursor, Claude Desktop ou un editeur normal met automatiquement a jour la mindmap.

## Sources de verite

- Texte et ordre reel : fichiers sources locaux.
- Historique : Git, gere par Codex/Cursor/Claude/terminal, pas par l'app.
- Metadonnees mindmap : dossier global `D:\SYSTEM\.mindmap`.
- Cloud futur : sync/index/feed, pas source principale pour le texte.
- Feed futur : module de memoire active derive des sources et mindmaps, pas produit separe au MVP.

## Regle produit centrale

Toute fonctionnalite qui modifie le sens du document final est stockee dans la source.
Toute fonctionnalite purement visuelle, personnelle ou d'analyse est stockee dans `D:\SYSTEM\.mindmap`.

Dans la source :

- texte reel ;
- ordre reel ;
- IDs necessaires aux renvois ;
- renvois dynamiques ;
- numerotation logique si necessaire.

Dans `D:\SYSTEM\.mindmap` :

- positions ;
- labels visuels ;
- branches cachees ;
- commentaires prives ;
- liens comparatifs ;
- groupes de travail ;
- etat d'interface.

## Cas d'usage principaux

### 1. Markdown long

Importer un fichier Markdown. L'app le transforme en mindmap : titres, paragraphes, phrases. Deplacer une branche source modifie le Markdown. Modifier une phrase modifie le Markdown.

### 2. Methode Essay.app

Ecrire, produire, reecrire, reordonner et comparer des alternatives au niveau phrase, paragraphe ou section.

### 3. Contrats et renvois internes

Chaque article/clause a un ID stable. Les renvois pointent vers cet ID, pas vers un numero fige. Si un article change de place, son numero est recalcule et tous les renvois dynamiques sont mis a jour dans le rendu/export.

### 4. Copy de sites et apps

Importer plusieurs sources d'un projet, par exemple `content/home.ts`, `content/cuisine.ts`, `components/sections/hero-section.tsx`, puis comparer les sections communes sur une meme mindmap.

### 5. Code comprehension

Importer un fichier code, masquer le bruit, labeliser les branches techniques et ne garder visible que les parties utiles a comprendre. Les labels ne modifient pas la source.

### 6. Memoire active / feed

Faire remonter les bonnes notes, decisions, sections, contradictions ou transformations au bon moment. Ce besoin vient de l'ancien projet `notes-feed-saas`, mais il doit s'appuyer sur l'index source-aware et les mindmaps plutot que devenir une deuxieme source ou une inbox separee.

## Decisions validees

- Le produit est construit comme un fork maintenable de Glyph, avec un remote `upstream` conserve pour integrer selectivement ses evolutions.
- La stack est Tauri : React/TypeScript pour l'interface et la projection en cards, Rust pour les operations fichiers, le watcher, les snapshots et les garanties d'ecriture.
- Un fichier Markdown s'ouvre sous trois representations d'une meme source : Document, Source et Cards.
- La vue Cards est generee depuis le `.md` ; elle ne cree pas de fichier `.canvas` canonique ni de copie du texte.
- Le moteur Canvas de Glyph est reutilise comme composant de vue, mais le texte et l'ordre restent exclusivement dans le Markdown.
- Les metadonnees visuelles sans contenu source restent stockees dans `D:\SYSTEM\.mindmap`.
- Le premier lot affiche les chapitres Markdown comme cards. La fragmentation progressive en sous-chapitres, paragraphes, listes, regles et phrases reste dans la vision produit et sera ajoutee apres validation du coeur.
- Le coeur V1 est personnel : comprendre et restructurer des sources existantes.
- Le premier MVP cible Markdown pur, puis doit rapidement s'etendre aux fichiers de copy/code utilises dans des environnements Cursor/Codex.
- Les fichiers locaux restent la source principale.
- Codex/Cursor/Claude continuent a gerer code, commit et push.
- L'app ne remplace pas les IDE.
- L'app observe et modifie les fichiers sources.
- Autosave immediat pour toute edition source.
- Pas d'IA centrale en MVP.
- Une mindmap peut contenir plusieurs sources.
- Les nouvelles sources creees par les agents doivent apparaitre comme "non mindmappees".
- Les metadonnees mindmap sont centralisees dans `D:\SYSTEM\.mindmap`, pas dans chaque projet.
- Les branches peuvent avoir des labels qui remplacent l'affichage sans modifier la source.
- Masquer une branche ne supprime jamais la source.
- Supprimer une branche source supprime directement le texte source comme dans un editeur Markdown normal, sans confirmation bloquante. Undo et snapshots sont obligatoires.
- Les fichiers non classes crees depuis un Canvas sont stockes dans `D:\SYSTEM\MINDMAP_INBOX\`.
- Les metadonnees mindmap, historiques, validations et snapshots sont stockes dans `D:\SYSTEM\.mindmap\`.
- Une mindmap peut contenir des sources venant de plusieurs dossiers.
- Le reader Markdown sert a lire/exporter ; le Canvas sert a structurer et editer.
- Le MVP importe des fichiers entiers, pas des selections partielles.
- Les renvois dynamiques sont P1, avec previews repliees par defaut.
- `notes-feed-saas` est a absorber comme module futur : feed/revue/radar mobile-cloud, pas comme coeur MVP.
