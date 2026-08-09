# Source Mindmap App - Discovery

## Contexte utilisateur

L'utilisateur travaille avec Codex, Cursor, Claude Desktop, Git et des dossiers locaux contenant des notes, specs, copy, contrats et code. Les agents modifient directement les fichiers sources. Les IDE savent editer et commit/push, mais ne donnent pas une bonne vue de comprehension et de structuration des documents.

## Douleurs observees

1. Les fichiers Markdown et sources deviennent difficiles a lire comme systeme de connaissance.
2. Les mindmaps externes type XMind/MindNode/Heptabase deviennent obsoletes car elles ne restent pas liees aux fichiers sources.
3. Pour comprendre la copy d'un site, il faut parfois recopier les textes dans une mindmap, puis maintenir deux sources.
4. Les contrats avec renvois internes demandent des corrections manuelles quand les articles changent d'ordre.
5. Les agents creent de nouveaux fichiers que l'utilisateur doit retrouver, comprendre et integrer dans une vue d'ensemble.

## Alternatives actuelles

- Markdown brut dans IDE : bon pour editer, mauvais pour assimiler et reorganiser visuellement.
- XMind/MindNode : bon pour structurer, mauvais pour rester synchronise avec les sources.
- Heptabase : bon pour penser visuellement et faire de la recherche IA. Son MCP et son CLI 2026 en font une interface distante editable potentielle, mais pas encore une source fiable tant que le round-trip Markdown, les revisions, suppressions et highlights n'ont pas ete verifies.
- Notion : bon pour blocs, mais source proprietaire.
- Codex/Cursor/Claude : bons pour modifier les fichiers, pas pour lire et structurer comme PKM.

## Decisions de cadrage

- L'app ne remplace pas les IDE ni Git.
- La source principale reste le fichier local.
- Le Canvas est la vue principale de structure et d'edition source-aware.
- Le reader Markdown sert a lire, verifier le rendu et exporter.
- Les metadonnees visuelles restent hors source.
- Les changements externes par agents doivent etre detectes et visibles sans bloquer.
- Le MVP commence par Markdown pur.
- Les adapters `content/*.ts`, TSX/JSX et le cloud viennent apres validation du coeur Markdown.
- Une interface externe comme Heptabase peut devenir une replique editable d'une source locale seulement si chaque modification distante est convertie automatiquement en transaction locale, versionnee et reversible. Aucun contenu ne doit rester durablement divergent entre les deux interfaces.
- La synchronisation externe n'utilise jamais `last write wins` : changement unilateral applique automatiquement, changements concurrents fusionnes a trois voies ou suspendus pour validation.

## Criteres de validation MVP

- Importer plusieurs fichiers Markdown reels.
- Lire leur structure en mindmap sans recopie manuelle.
- Modifier une branche et voir le fichier source changer.
- Modifier le fichier hors app et voir la mindmap se mettre a jour.
- Masquer, labeliser, commenter et retrouver les branches sans polluer le Markdown.
- Recuperer une erreur via undo/snapshot.
