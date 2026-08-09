# Feed Integration - Relation avec notes-feed-saas

## Decision

`notes-feed-saas` ne doit pas rester un produit separe au meme niveau que Source Mindmap App.

Il doit etre absorbe comme module futur de memoire active : feed, revue, radar projet, cartes de transformation et vue mobile/cloud.

Les anciens fichiers du projet ont ete deplaces dans `modules/notes-feed/` :

- `modules/notes-feed/README.md`
- `modules/notes-feed/PRODUCT.md`
- `modules/notes-feed/PROMPT.md`

## Pourquoi ne pas fusionner dans le MVP

Le coeur non negocie du produit est le lien source-aware :

- lire les vrais fichiers ;
- transformer Markdown en mindmap ;
- editer les branches et modifier la source ;
- reparser les changements externes faits par Codex/Cursor/Claude ;
- stocker labels/commentaires/positions hors source ;
- garder undo/snapshots.

Si le feed entre trop tot, le projet risque de devenir une inbox de plus avant d'avoir resolu la couche source. Le feed depend d'un bon index. Il ne doit pas le remplacer.

## Pourquoi fusionner conceptuellement

Les deux idees visent la meme douleur : rendre les notes et sources vivantes.

Source Mindmap resout :

- comprendre ;
- structurer ;
- comparer ;
- editer ;
- maintenir la source unique.

Notes Feed resout :

- refaire emerger ;
- prioriser ;
- rappeler ;
- detecter decisions/risques/actions ;
- proposer une reprise au bon moment.

Le feed a besoin des donnees produites par Source Mindmap :

- fichiers sources ;
- headings/phrases ;
- labels de travail ;
- commentaires ;
- liens compare ;
- validations en attente ;
- historique de changements ;
- fichiers recents ;
- branches cachees ;
- alternatives ;
- renvois.

## Produit cible

```text
Desktop Source Mindmap
  Canvas source-aware
  Reader Markdown
  Source browser
  Validation history

Cloud/Mobile Active Memory
  Today review
  Project radar
  Transformation queue
  Change digest
  Cards from source/mindmap signals
```

## Regle de source de verite

Le feed ne devient jamais source de verite du texte.

```text
Texte = fichiers locaux
Historique = Git + snapshots app
Mindmap metadata = D:\SYSTEM\.mindmap
Feed = index derive + actions utilisateur
```

## Modules feed possibles

### Today Review

5 a 7 cartes maximum :

- branche modifiee recemment ;
- commentaire non traite ;
- decision ouverte ;
- section a restructurer ;
- fichier cree par agent et non mindmappe ;
- validation en attente ;
- note ancienne liee a un projet actif.

### Project Radar

Vue par projet/dossier source :

- changements recents ;
- fichiers non mindmappes ;
- branches a valider ;
- risques/contradictions ;
- sections liees par compare ;
- transformations possibles.

### Transformation Queue

Cartes qui proposent de transformer une source :

- note -> spec ;
- paragraphe -> issue ;
- commentaire -> decision ;
- section -> checklist ;
- document -> PRD ;
- observation -> skill.

### Mobile Feed

Le mobile ne cherche pas a remplacer le Canvas. Il sert a :

- lire ;
- valider ;
- snooze ;
- ouvrir une source ;
- marquer utile/inutile ;
- lancer une reprise plus tard sur desktop.

## Timing

- MVP : pas de feed.
- P1/P2 : index source/mindmap assez propre pour alimenter des cartes simples.
- Apres usage reel : module Today/Radar.
- SaaS public seulement apres preuve interne que les cartes menent a des actions utiles.

## Critere de validation feed

Le feed fonctionne seulement si au moins 30% des cartes vues menent a une action utile :

- ouvrir et modifier une source ;
- valider/reparer une branche ;
- transformer une note ;
- prendre une decision ;
- archiver/ignorer explicitement ;
- relier a un projet.

En dessous, le feed est du bruit.
