# Source Mindmap App - Open Questions

## Product

- Quel nom produit utiliser ?
- Quel fichier Markdown reel utiliser comme premier benchmark MVP ?

## Source handling

- Quel niveau d'IDs inscrire dans les Markdown pour les renvois ?
- Quelle syntaxe finale pour les refs dynamiques : `{{ref:id}}`, wikilink, custom directive ?
- Comment gerer les phrases modifiees hors app sans perdre leur identite ?
- Faut-il ajouter les listes, citations et tableaux Markdown dans le MVP ou en P1 ?
- Quelles exclusions par defaut exactes : `.git`, `node_modules`, `.next`, `dist`, `build`, `public`, autres ?

## Code support

- Pour TSX, faut-il extraire seulement les textes visibles ou aussi les composants/props ?
- Comment eviter de casser Prettier/formatting lors des rewrites ?
- Quel premier benchmark code utiliser apres MVP Markdown : Dec Home `content/*.ts` ou TSX inline ?

## UX

- Comment representer l'ordre vertical des enfants dans une mindmap sans rendre le deplacement ambigu ?
- Comment distinguer visuellement source, label, commentaire, mirror et reference-preview sans surcharger ?
- Quel niveau de zoom/collapse appliquer par defaut a l'import d'un gros fichier ?

## Safety

- Comment signaler un conflit si Codex modifie un fichier pendant une edition Canvas ?
- Faut-il bloquer l'ecriture si le fichier a change depuis le dernier parse ?
- Format exact des snapshots : copie fichier complete, patch, ou les deux ?

## Heptabase study interface

- Le CLI Heptabase restitue-t-il le Markdown et ses blocs sans perte apres un aller-retour complet ?
- Expose-t-il une revision ou un `lastEditedTime` suffisamment fiable pour detecter les changements incrementaux, suppressions comprises ?
- Les highlights possedent-ils un identifiant, un contenu et une cible de bloc stables accessibles par CLI ou seulement par MCP ?
- Peut-on conserver frontmatter, commentaires, code blocks, blockquotes, listes et liens sans normalisation destructive par l'editeur Heptabase ?
- Quelle frequence de polling donne une synchronisation acceptable en l'absence de webhook documente ?
- Quelle action Heptabase explicite admet un passage dans le workflow local `selection -> integrate -> question -> correction -> card` ?
