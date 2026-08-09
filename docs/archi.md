# Source Mindmap App - Technical Architecture

## Overview

MVP local-first desktop app. Pas de SaaS au depart.

Stack validee :

- Base produit : fork maintenable de Glyph, avec suivi selectif de son upstream.

## Distribution et suivi upstream

- Source Mindmap est une application distincte de Glyph : nom produit et
  identifiant Windows propres, installation côte à côte autorisée.
- `origin` pointe vers le fork Source Mindmap ; `upstream` pointe vers Glyph.
- Aucun contrôle ni installation automatique d'une release Glyph au démarrage.
- Le contrôle des releases upstream reste manuel et informatif : il n'installe
  jamais un binaire Glyph.
- Chaque mise à jour upstream passe par une branche `sync/glyph-vX.Y.Z`, une
  revue du diff, les tests complets et la vérification native des fonctions
  Source Mindmap avant fusion et publication d'un nouvel installateur.
- Desktop shell : Tauri.
- UI : React + TypeScript, en reutilisant le moteur Canvas natif de Glyph.
- Backend local : Rust via les commandes et evenements Tauri.
- Parsing Markdown : unified/remark/mdast.
- Parsing code futur : TypeScript compiler API / Babel parser.
- File watching : watcher Rust/Tauri deja present dans Glyph, adapte au modele source-aware.
- Storage metadonnees : fichiers JSON dans `D:\SYSTEM\.mindmap`.

## Markdown Views

Un onglet ouvert sur un fichier `.md` propose trois representations de la meme source :

- `Document` : rendu Markdown ;
- `Source` : syntaxe Markdown brute editable ;
- `Cards` : projection structurelle editable des chapitres et sous-chapitres.

La vue Cards est un modele derive en memoire. Elle ne serialise pas le texte dans un fichier `.canvas`. Les editions de cards reecrivent la section correspondante du `.md`, puis le fichier est reparsed. Les changements externes detectes par le watcher reconstruisent la projection.

Le stockage `D:\SYSTEM\.mindmap` ne conserve que les metadonnees non textuelles : positions, etat replie, labels visuels, connexions de travail, hashes et identifiants necessaires a la reconciliation.

Le premier slice represente les headings Markdown comme cards hierarchiques. Le modele conserve une granularite extensible : sous-chapitres, paragraphes, listes, regles et phrases pourront ensuite etre fragmentes en cards enfants sans changer la source canonique ni remplacer la vue initiale.

## Source Model

```ts
type SourceRef = {
  sourceId: string
  absolutePath: string
  kind: "markdown" | "typescript-content" | "tsx" | "jsx"
  rootPath?: string
}

type SourceNode = {
  nodeId: string
  sourceId: string
  parentNodeId?: string
  nodeKind: "document" | "heading" | "paragraph" | "sentence" | "code-block" | "literal" | "jsx-text"
  sourceRange: {
    startOffset: number
    endOffset: number
    startLine?: number
    endLine?: number
  }
  textHash: string
  contextHash?: string
}
```

A single mindmap can reference sources from multiple roots. Branches must preserve their source origin: root path, file path and source range.

Source origin UI: compact badge on branch, full source details on hover/selection, quick open of file/source excerpt in a side panel.

MVP side panel is read-only. It displays source context and can open the file externally. Source editing happens through Canvas branches.

Source browser mirrors the real folder hierarchy for watched roots. MVP opens mindmappable files only, starting with `.md`. Dragging a source file into a mindmap imports it and creates source-aware branches.

Imported `.md` files become source root branches. Their parsed structure is attached under that root branch.

MVP imports full files only, not partial selections. Import triggers automatic layout so the map is immediately readable.

Default auto-layout is document-hybrid: imported file as root, main sections as branches, sentences stacked vertically under their section.

Source branches display full text by default. Labels can override the visible text for synthesis, while source text remains accessible.

Readable branch widths should target roughly 12-15 words per line. Indicative constraints: sentence 45-60ch, title 25-45ch, short label 18-32ch, read/focus panel 65-75ch. Branch height grows with content.

No separate Canvas focus mode in MVP. Focused reading is handled by the Markdown reader/document view. Canvas must provide solid zoom, pan and collapse.

Any branch with children can be collapsed/expanded. Required commands: collapse/expand branch, collapse siblings, collapse all under file, expand all under file.

Creation flow: create a new Canvas/mindmap, then create a new Markdown source file inside that Canvas. The file becomes a source root branch and child branches write to the `.md` incrementally.

New Canvas-created files can start as unfiled real `.md` files outside watched source folders, physically stored in `D:\SYSTEM\MINDMAP_INBOX\`. They appear in an "Unfiled" sidebar area and can later be moved into a watched source folder, updating map references.

On first launch, the app creates `D:\SYSTEM\MINDMAP_INBOX\` if missing.

## Mindmap Model

```ts
type Branch = {
  branchId: string
  kind: "source" | "label" | "comment" | "mirror" | "reference-preview" | "group"
  sourceNodeId?: string
  parentBranchId?: string
  position: { x: number; y: number }
  collapsed?: boolean
  hidden?: boolean
  displayLabel?: string
  commentText?: string
}

type BranchLink = {
  linkId: string
  type: "compare" | "reference"
  fromBranchId: string
  toBranchId: string
}
```

Reference previews display the target of a dynamic source reference as a child/mirror under the referencing branch. They are not copies and moving them does not reorder the source.

Reference previews are collapsed by default and expose a visible reference count/indicator.

## Global Storage

Toutes les metadonnees app vivent sous :

```text
D:\SYSTEM\.mindmap\
  maps\
    {mapId}.json
  indexes\
    sources.json
  settings.json
```

Les projets sources ne sont pas pollues.

On first launch, the app creates `D:\SYSTEM\.mindmap\` with `maps\`, `indexes\` and `settings.json` if missing.

Persistent snapshots live under `D:\SYSTEM\.mindmap\snapshots\`. Runtime undo uses memory for immediate reversal; snapshots capture modified source files and affected mindmap metadata for crash/recovery safety. Retention should be capped, e.g. last 50 operations per file or recent 24/48h window.

Diffs are available on demand from history/undo/snapshots, not shown after every edit.

## File Watch Flow

```text
Source file changed
→ watcher event
→ read file
→ parse AST
→ match nodes with previous source nodes
→ update branches linked to source nodes
→ create non-blocking change history items for impacted metadata
→ visually mark branches that need validation
```

External changes never block displaying the current source. Validation only concerns mindmap metadata affected by the source change.

Validation severity:

- minor text change: silent update when metadata remains safe;
- significant text/structure change: non-blocking validation marker;
- deleted/unmatched source node or mirror conflict: high-priority validation marker.

## Canvas Edit Flow

```text
User edits source branch
→ locate source node/range
→ rewrite source via AST/string patch
→ save file
→ watcher reparses file
→ canvas refreshes from source
```

## Ordering Rule

The mindmap is hierarchical. Parent/children defines source context.

For source branches under the same source parent:

```text
sort by vertical position
→ rewrite sibling order in source
```

Branches with `label`, `comment`, `group`, `mirror` do not reorder source unless explicitly converted to source.

Depth controls source semantics. A sentence dropped inside a paragraph becomes part of that paragraph. The same sentence dropped as a sibling after a paragraph becomes a new paragraph.

Essay-style rule: a single standalone sentence at block level can be treated as a potential heading/title; multiple sentences grouped together form a paragraph. The UI must expose explicit conversions when intent is ambiguous.

UX decision: paragraph nodes are not shown as intermediate branches by default. Sentences appear directly under headings/sections, while paragraph boundaries are represented visually so Markdown reconstruction remains unambiguous.

Essay mode: paragraph titles are work labels stored outside the source by default. They can be explicitly converted into Markdown headings when the user wants them in the document/export.

Sentence alternatives are stored outside the source by default. Selecting one alternative rewrites the source sentence; non-selected alternatives remain in `D:\SYSTEM\.mindmap`.

Automatic paragraph-title suggestions may generate work labels from paragraph sentences. These suggestions stay outside the source unless explicitly converted into Markdown headings.

Comments can be attached to source branches or exist as free comment branches. Both are stored outside the source by default and are excluded from Markdown reading/export.

## Markdown Adapter MVP

Markdown parser extracts:

- document root ;
- headings ;
- paragraphs ;
- sentences ;
- lists later ;
- blockquotes/code blocks preserved.

Sentence splitting must be conservative and locale-aware enough for French/English punctuation.

## Code Adapters Later

### `content/*.ts`

Extract:

- exported arrays ;
- object literals ;
- string literals ;
- FAQ question/answer pairs ;
- metadata title/description.

### TSX/JSX

Extract:

- JSX text nodes ;
- string literals used as visible copy ;
- children of known UI components when safe.

MVP should not rewrite JSX structure.

## Safety

- Snapshot before structural rewrites.
- Undo must cover source edits and source deletes.
- Source delete behaves like deleting text in a Markdown editor: direct action, no blocking confirmation in normal use.
- Hide is non-destructive.
- Hidden branches remain visible in a left-panel hidden list per file/map.
- Hide scope can be local-to-map or global-to-source. Default hide action is local-to-map.
- External concurrent changes force reparse before write.

## Future Cloud

`notes-feed-saas` can later provide:

- active-memory module derived from the source-aware index ;
- mobile feed/review/radar ;
- cloud sync of `D:\SYSTEM\.mindmap` ;
- review cards ;
- search across sources ;
- active memory.

Cloud is not the authority for source text.

Product decision: `notes-feed-saas` should not remain a separate core product competing with Source Mindmap. It becomes a future module using the same source index, history, validation events and mindmap metadata.

## External Study Adapter - Heptabase

Heptabase est un adaptateur post-MVP, pas un stockage parallele libre. Il expose une replique editable pour la recherche IA, les whiteboards, la lecture et la selection. A l'equilibre, le texte canonique est toujours materialise dans le fichier local et son historique dans Git/snapshots.

```ts
type ExternalReplica = {
  provider: "heptabase"
  sourceId: string
  externalObjectId: string
  externalBlockMap?: Record<string, string>
  baseContentHash: string
  localRevisionHash: string
  externalRevision?: string
  lastSyncedAt: string
  syncStatus: "synced" | "local-ahead" | "remote-ahead" | "conflict" | "unsupported"
}
```

Le registre ne duplique pas le texte : il conserve seulement identites, revisions, hashes et mapping de blocs necessaires a la reconciliation.

### Sync flow

```text
Local watcher + Heptabase poller
-> charger local, distant et derniere base commune
-> aucun changement : noop
-> local seul : patcher la carte distante puis verifier par relecture
-> distant seul : snapshot local, patcher la source, reparser, verifier le diff
-> deux cotes : fusion a trois voies
-> fusion certaine : appliquer aux deux cotes et enregistrer la nouvelle base
-> fusion ambigue : status conflict, aucune ecriture destructive
```

Les ecritures utilisent un verrou par `sourceId` et un identifiant d'operation pour eviter les boucles de watcher. Une synchronisation n'est validee qu'apres relecture des deux representations et egalite semantique de leur contenu supporte.

### Recall bridge

Un highlight Heptabase brut n'entre pas directement dans le recall tant que son enumeration incrementale et son mapping de bloc ne sont pas prouves. Le contrat minimal est une action explicite `Recall Inbox` qui fournit : objet externe, texte exact, bloc ou heading cible, hash du passage et date ISO.

Le bridge retrouve le `SourceNode`, materialise la selection dans le Markdown selon les regles PKA, puis delegue question, correction et admission de card au workflow local. Heptabase peut afficher et declencher l'intention ; il ne devient pas proprietaire des cards canoniques ni de leur planification.

### Feasibility gate

Avant implementation produit, un prototype jetable doit verifier avec le CLI reel active :

1. create/read/update/delete d'une carte et detection de revision ;
2. round-trip sans perte du sous-ensemble Markdown autorise ;
3. detection d'une edition distante sans scan complet prohibitif ;
4. exposition et stabilite des highlights/blocs ;
5. prevention des boucles et gestion d'un conflit concurrent ;
6. restauration via snapshot apres echec simule.

Si l'un de ces contrats ne peut pas etre garanti par le CLI officiel, l'adaptateur Heptabase reste une vue de recherche non editable pour les syntaxes concernees.
