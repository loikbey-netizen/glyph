Tu reprends un nouveau projet SaaS / outil interne autour d'un "fil d'actualite intelligent" pour mes notes personnelles et projets.

Reponds en francais. Effort eleve. Sois pragmatique, challenge mes hypotheses, mais aide-moi a structurer une V1 concrete.

## Contexte general

J'ai deja un systeme de travail base sur :
- des notes personnelles / PKA ;
- des projets clients ;
- des dossiers PROJECTS ;
- des audits, checklists, prompts, regles design, skills, workflows ;
- beaucoup de contenu capture : idees, taches, decisions, references, specs, retours clients, notes de reflexion, projets en cours.

Le probleme : mes notes existent, mais elles ne "reviennent pas a moi" naturellement. Je dois chercher, me souvenir, rouvrir des fichiers, ou demander a un agent de fouiller. Je veux un systeme plus vivant.

L'idee SaaS : creer un fil d'actualite de mes notes, un peu comme un feed, mais pas un reseau social. Le feed doit servir a faire remonter les bonnes informations au bon moment.

## Intuition produit

Je veux un systeme qui transforme mes notes en flux actionnable.

Pas seulement :
- une timeline chronologique ;
- une recherche ;
- un graphe de notes ;
- une todo list ;
- un assistant IA qui repond a une question.

Plutot :
- un feed intelligent qui me montre ce qui merite mon attention maintenant ;
- des notes anciennes qui redeviennent utiles ;
- des idees qui se reconnectent a mes projets actuels ;
- des taches implicites qui ressortent ;
- des angles morts dans mes projets ;
- des decisions a valider ;
- des apprentissages a reutiliser ;
- des opportunites de transformer une note en prompt, issue, spec, doc, skill, checklist, ou action.

## Objectif

Explorer si ca peut devenir :
1. d'abord un outil interne pour moi ;
2. ensuite peut-etre un SaaS pour d'autres knowledge workers / builders / consultants / designers / fondateurs ;
3. ou un module integre a mon systeme VibeCoding / PKA / NowStack.

## Stack probable

Je travaille souvent avec NowStack :
- TanStack Start ;
- Convex ;
- Better Auth ;
- Vercel ;
- PostHog si utile.

Je veux eviter un produit type "Notion AI clone". Il faut une vraie proposition d'usage.

## Ce que je veux que tu fasses

Commence par clarifier le produit comme un vrai PM/fondateur.

Challenge-moi sur :
1. Pour qui ce produit est vraiment fait.
2. Quel probleme douloureux il resout.
3. Pourquoi un feed est meilleur qu'une recherche, un graphe ou une todo list.
4. Quelle est la frequence d'usage realiste.
5. Quelles cartes/feed items sont vraiment utiles.
6. Ou l'IA apporte une vraie valeur et ou elle ajoute juste du bruit.
7. Comment eviter que le feed devienne anxiogene ou trop charge.
8. Quelle serait une V1 minimaliste mais puissante.
9. Quels signaux doivent alimenter le ranking du feed.
10. Comment mesurer que le produit fonctionne.

## Hypotheses a explorer

Le feed pourrait se baser sur :
- recence ;
- importance ;
- frequence de reapparition d'un theme ;
- liens avec projets actifs ;
- notes non traitees ;
- decisions ouvertes ;
- taches implicites ;
- notes avec forte densite d'idees ;
- notes souvent referencees ;
- notes similaires ou redondantes ;
- deadlines / rappels ;
- changements dans un projet ;
- historique de ce que j'ai ignore ou valide ;
- feedback utilisateur sur les cartes du feed.

## Types de cartes possibles

- A reprendre : une note interessante non exploitee.
- Connexion : deux notes ou projets lies.
- Action : une tache implicite detectee.
- Decision : un choix a trancher.
- Rappel intelligent : une note a revoir maintenant.
- Synthese : plusieurs notes consolidees.
- Nettoyage : doublon, note obsolete, note trop vague.
- Transformation : convertir une note en spec, issue, prompt, doc, checklist, skill.
- Pattern : comportement ou idee recurrente.
- Projet : quelque chose a faire avancer dans un projet actif.
- Apprentissage : lecon reutilisable.
- Risque : point oublie ou contradiction.

## Contraintes de design

Je prefere les interfaces :
- denses mais lisibles ;
- calmes, pas gadget ;
- utiles des le premier ecran ;
- orientees action ;
- avec peu de bruit visuel ;
- sans landing page marketing au depart ;
- sans cartes decoratives inutiles ;
- sans design SaaS generique violet/gradient ;
- avec une interface de travail serieuse, premium, rapide.

Le feed doit donner envie de revenir sans devenir addictif ou dispersant.

## Ce que je veux eviter

- Un clone Notion.
- Un clone Readwise.
- Un clone Twitter pour notes.
- Une timeline inutile.
- Un chatbot central qui cache tout.
- Une IA qui invente des connexions faibles.
- Trop de notifications.
- Trop de cartes sans action.
- Un systeme qui demande plus de maintenance qu'il n'apporte de valeur.
- Un produit qui devient juste une autre inbox.

## Premiere mission

Fais une phase de clarification produit :
1. Reformule l'idee en 3 versions de positionnement.
2. Donne les 5 problemes utilisateur potentiels.
3. Identifie la cible la plus credible pour une V1.
4. Propose 3 concepts de produit differents.
5. Propose une V1 tres concrete.
6. Liste les donnees necessaires.
7. Liste les ecrans principaux.
8. Liste les evenements/actions utilisateur.
9. Liste les risques produit.
10. Termine par une recommandation nette : outil interne d'abord ou SaaS direct.

Ne code pas encore. On commence par faconner le produit.

Important : ne sois pas complaisant. Si l'idee est trop vague, dis-le. Si le feed n'est pas le bon format, propose mieux. Mais si l'intuition est bonne, aide-moi a la rendre precise, testable et buildable.
