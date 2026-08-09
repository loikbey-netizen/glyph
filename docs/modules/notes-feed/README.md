# Notes Feed SaaS

> Decision 2026-06-29 : ce projet ne doit pas avancer comme SaaS separe pour l'instant. Il devient un module futur de `LOIK-BEY/source-mindmap-app` : feed/revue/radar mobile-cloud derive des fichiers sources, mindmaps, validations et historiques. Le coeur MVP reste Source Mindmap local-first.

Projet SaaS / outil interne autour d'un fil d'actualite intelligent pour notes personnelles, PKA, projets clients et workflows.

## Intuition

Les notes existent, mais elles ne reviennent pas naturellement au bon moment. Le produit doit transformer un systeme de notes en flux actionnable : idees a reprendre, decisions ouvertes, liens entre notes, taches implicites, patterns recurrents et opportunites de transformation.

## Positionnement a clarifier

- Assistant de memoire active
- Feed de revue quotidienne
- Couche d'orchestration au-dessus des notes
- Outil interne d'abord, SaaS ensuite si la valeur est claire

## Promesse a explorer

Faire remonter les bonnes notes au bon moment pour aider a penser, decider et executer sans fouiller manuellement dans son systeme.

## Types de cartes possibles

- A reprendre : note interessante non exploitee
- Connexion : lien entre deux notes, projets ou decisions
- Action : tache implicite detectee
- Decision : choix a trancher
- Rappel intelligent : note a revoir maintenant
- Synthese : plusieurs notes consolidees
- Nettoyage : doublon, note obsolete, note trop vague
- Transformation : convertir une note en spec, issue, prompt, doc, checklist ou skill
- Pattern : idee ou probleme recurrent
- Projet : point a faire avancer dans un projet actif
- Apprentissage : lecon reutilisable
- Risque : contradiction, oubli ou angle mort

## Contraintes produit

- Eviter un clone Notion, Readwise ou Twitter pour notes
- Eviter une timeline passive
- Eviter un chatbot central qui cache tout
- Eviter les connexions IA faibles ou inventees
- Eviter une nouvelle inbox a maintenir
- Interface calme, dense, lisible, orientee action

## Premiere mission pour le prochain chat

1. Reformuler l'idee en 3 versions de positionnement.
2. Identifier les 5 problemes utilisateur potentiels.
3. Choisir la cible la plus credible pour une V1.
4. Proposer 3 concepts de produit differents.
5. Proposer une V1 concrete.
6. Lister les donnees necessaires.
7. Lister les ecrans principaux.
8. Lister les evenements/actions utilisateur.
9. Lister les risques produit.
10. Recommander outil interne d'abord ou SaaS direct.

## Prompt de reprise

Voir `PROMPT.md`.

## Clarification produit

La premiere mission de cadrage est documentee dans `PRODUCT.md`.
