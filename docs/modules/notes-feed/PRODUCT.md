# Notes Feed SaaS - clarification produit

## Diagnostic court

L'intuition est bonne, mais le mot "feed" est dangereux. Un feed classique optimise la consommation. Ici, la valeur doit venir de la reprise, de la decision et de la transformation. Le produit ne doit pas etre un flux infini de notes interessantes, mais un poste de pilotage qui choisit quelques cartes utiles maintenant et force une sortie claire : ignorer, reporter, transformer, decider, archiver.

Le vrai produit n'est pas "Twitter pour mes notes". C'est une couche de tri actif au-dessus d'un systeme de connaissance deja riche.

## 1. Trois positionnements possibles

### Positionnement A - Memoire active pour builders

Un assistant de memoire active qui fait remonter les notes, decisions et idees utiles a tes projets en cours, au moment ou elles peuvent encore changer quelque chose.

Promesse : arreter de perdre la valeur cachee dans les notes anciennes.

### Positionnement B - Revue quotidienne actionnable

Un rituel quotidien de 10 minutes qui transforme ton vrac de notes en decisions, actions et prochaines transformations.

Promesse : remplacer la fouille manuelle par une revue courte, dense et orientee sortie.

### Positionnement C - Orchestrateur de connaissance projet

Une couche d'orchestration qui relie notes personnelles, projets clients, audits, specs, prompts et workflows pour detecter ce qui bloque, ce qui revient, et ce qui merite d'etre transforme.

Promesse : rendre un systeme PKA operationnel, pas seulement consultable.

## 2. Cinq problemes utilisateur potentiels

1. Les notes utiles meurent apres capture.
   L'utilisateur ecrit beaucoup, mais la valeur se dissout car rien ne relance les bonnes notes au bon moment.

2. Les decisions ouvertes restent implicites.
   Beaucoup de notes contiennent des choix non tranches, mais elles ne sont pas visibles comme decisions.

3. Les idees ne se reconnectent pas aux projets actifs.
   Une idee capturee il y a deux mois pourrait aider un projet aujourd'hui, mais le lien depend de la memoire humaine.

4. Le systeme de notes devient une dette cognitive.
   Plus l'utilisateur capture, plus il accumule une surface mentale qu'il ne peut plus revisiter.

5. Les agents savent chercher, mais pas maintenir un rythme.
   Demander a un agent de fouiller marche ponctuellement, mais ce n'est pas un rituel stable, mesurable et incorporable dans le travail quotidien.

## 3. Cible la plus credible pour une V1

La cible V1 la plus credible, c'est toi : solo builder / consultant / designer-developpeur avec un systeme de notes deja dense, des projets actifs, et des workflows documentes.

Ce n'est pas un compromis faible. C'est probablement la meilleure cible parce que :

- tu as deja la douleur ;
- tu as deja les donnees ;
- tu peux evaluer la qualite des cartes sans panel externe ;
- tu peux tolerer une interface interne imparfaite ;
- tu peux mesurer si le produit change vraiment ton comportement.

La cible SaaS secondaire viendra seulement apres preuve interne : knowledge workers qui produisent beaucoup de notes operationnelles, pas les utilisateurs de prise de notes casual.

## 4. Trois concepts de produit differents

### Concept 1 - Daily Review Feed

Chaque jour, le systeme propose 5 a 12 cartes maximum. Chaque carte doit avoir une raison explicite et une action simple.

Exemples :

- "Cette decision est ouverte depuis 14 jours."
- "Cette note ressemble a un probleme actif dans Tamkin."
- "Cette idee a ete mentionnee dans 3 contextes differents."
- "Cette note peut devenir une issue ou une checklist."

Force : simple, testable, ritualisable.

Risque : devient vite un flux de suggestions moyennes si le ranking est faible.

### Concept 2 - Project Radar

Au lieu d'un feed global, l'utilisateur choisit un projet actif. Le systeme remonte les notes, risques, decisions et patterns lies a ce projet.

Force : plus concret que le feed general, meilleure tolerance aux faux positifs.

Risque : moins magique, moins transversal.

### Concept 3 - Transformation Queue

Le produit detecte les notes qui meritent d'etre converties en artefacts : spec, prompt, issue, doc, checklist, skill, audit, decision log.

Force : valeur tres actionnable, moins anxiogene qu'un feed.

Risque : plus proche d'un outil de production que d'un systeme de memoire active.

## 5. V1 concrete

Je recommande une V1 hybride : Daily Review Feed + Transformation Queue.

Objectif V1 : chaque jour, generer une revue de 7 cartes maximum a partir d'un corpus local, puis mesurer si ces cartes produisent une action utile.

Perimetre V1 :

- ingestion de fichiers Markdown depuis un ou plusieurs dossiers configures ;
- extraction de metadata basique : chemin, date de modification, titre, tags, liens, projet probable ;
- generation de cartes candidates par heuristiques simples et IA controlee ;
- ranking transparent avec raison affichee ;
- actions utilisateur : utile, ignorer, snooze, transformer, ouvrir source, marquer decide ;
- historique des actions pour ameliorer le prochain feed ;
- vue "Today" uniquement, pas de reseau social, pas de feed infini.

Limite volontaire : pas de chatbot central en V1. Le produit peut avoir une action "demander un developpement", mais pas devenir une interface conversationnelle principale.

## 6. Donnees necessaires

Donnees de source :

- chemin du fichier ;
- contenu Markdown ;
- titre ;
- date de creation si disponible ;
- date de modification ;
- liens internes ;
- tags ou frontmatter ;
- projet associe si detectable ;
- sections ou headings ;
- todos explicites ;
- decisions explicites ou implicites ;
- densite semantique estimee.

Donnees d'usage :

- cartes vues ;
- cartes ignorees ;
- cartes marquees utiles ;
- snooze ;
- transformation lancee ;
- source ouverte ;
- action terminee ;
- type de carte prefere ;
- raison de rejet si utile.

Donnees de contexte :

- projets actifs ;
- priorites de la semaine ;
- fichiers recemment modifies ;
- audits ouverts ;
- decisions recentes ;
- deadlines manuelles ;
- dossiers a inclure ou exclure.

## 7. Ecrans principaux

1. Today
   La revue du jour. 5 a 7 cartes, dense, lisible, avec action immediate.

2. Card Detail
   Source, raison du signal, extraits, liens, action proposee, historique.

3. Transform
   Choix du format de sortie : issue, spec, prompt, doc, checklist, skill, decision.

4. Projects Radar
   Vue par projet actif avec risques, decisions ouvertes, notes reliees, transformations possibles.

5. Sources
   Dossiers indexes, statut d'ingestion, exclusions, erreurs.

6. Feedback / History
   Ce qui a ete accepte, ignore, reporte, transforme. Important pour auditer le bruit.

## 8. Evenements et actions utilisateur

Evenements produit :

- source indexee ;
- note modifiee ;
- carte generee ;
- carte affichee ;
- carte ouverte ;
- carte ignoree ;
- carte marquee utile ;
- carte snoozee ;
- transformation demandee ;
- transformation acceptee ;
- transformation modifiee ;
- decision marquee comme tranchee ;
- projet associe manuellement ;
- signal juge faux positif.

Actions principales :

- ouvrir la note source ;
- accepter la carte ;
- ignorer la carte ;
- snooze 1 jour / 1 semaine / custom ;
- transformer en artefact ;
- relier a un projet ;
- marquer comme decision ;
- marquer comme deja traite ;
- demander une synthese courte ;
- supprimer du feed futur.

## 9. Risques produit

1. Le feed devient une inbox de plus.
   Mitigation : nombre de cartes limite, actions de cloture, pas de backlog infini.

2. L'IA cree des connexions faibles.
   Mitigation : raison explicite, score de confiance, feedback "faux positif", preference aux signaux verifiables.

3. Le produit optimise l'interessant au lieu de l'utile.
   Mitigation : mesurer les transformations et decisions, pas le temps passe.

4. Le ranking est impossible a juger.
   Mitigation : afficher pourquoi une carte apparait et permettre de corriger le signal.

5. Le produit demande trop de maintenance.
   Mitigation : ingestion passive, configuration minimale, aucune obligation de tagger.

6. Le feed general est trop vague.
   Mitigation : commencer avec projets actifs + revue quotidienne, pas avec toute la memoire indistincte.

7. La valeur SaaS est surestimee.
   Mitigation : outil interne d'abord, puis extraction des patterns seulement apres usage reel.

## 10. Recommandation nette

Outil interne d'abord.

Pas SaaS direct. Le risque principal n'est pas technique, c'est la qualite du signal. Tant que le systeme ne prouve pas qu'il te fait reprendre, decider ou transformer plus vite que tes routines actuelles, il n'y a pas encore de produit SaaS.

La bonne prochaine etape n'est pas de builder une plateforme complete. C'est de tester un rituel :

- chaque matin, 7 cartes maximum ;
- chaque carte a une raison et une action ;
- chaque action est mesuree ;
- apres 10 sessions, on juge froidement si le feed a cree de la valeur.

Critere de validation V1 : au moins 30 % des cartes vues doivent mener a une action utile ou a une decision explicite. En dessous, le produit est probablement un joli bruit.

