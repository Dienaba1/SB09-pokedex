# SB09 - Projet Pokédex

Bienvenue sur ce projet Pokédex ! 👋

Ta mission de cette semaine est de mettre en place un Pokédex. Pour ceux qui ne connaissent pas, un Pokédex est une encyclopédie virtuelle recensant tous les Pokémons du jeu.
Il faudra aussi mettre en place un système d'équipes de Pokémons. Les utilisateurs pourront créer des équipes, y ajouter des Pokémons et les administrer.

Le but de la semaine : s'entrainer à créer une API REST et consommer cette API via un client API, comme RestClient ou Postman (pas un front !)

Ton objectif : construire une **API REST professionnelle** pour un Pokédex avec système d'équipes.

Maintenant que le contexte est posé, attention à bien lire toutes les consignes ci-dessous et prendre des notes de ton côté si tu l'estimes nécessaire. 📝

Tu dois progresser à travers plusieur jalons :  
Jalon 1 - MVP  
Jalon 2 - API sécurisée : authentification et validation  
Jalon 3 - API professionnelle : documentation et tests  
Jalon 4 - fonctionnalités avancées : recherche et favoris  
Jalon 5 (optionnel) : front et consommation d'API  
Jalon 6 (optionnel) : Docker  
Jalon 7 (optionnel) : fonctionnalités supplémentaires  

## Durée et organisation

Tu as 4 jours pour réaliser ce projet. Consulte la [roadmap détaillée](./docs/roadmap.md) pour les user-stories et les contraintes exactes de chaque jalon.

Chaque jour à 16h, on partagera un markdown avec des étapes détaillées pour te débloquer. A la fin du projet, on te fournira une version de la correction pour que tu puisses comparer avec ta réalisation et voir d'autres manières de faire. 

## Carnet de bord

À la fin de cette première journée de projet, et à la fin des suivantes, on te demande de prendre 10-15 minutes pour écrire un petit bilan personnel de ton avancement.

### Pourquoi faire ça ?
Ce carnet de bord n’est pas une épreuve en plus, c’est un outil pour prendre du recul, mettre à plat ce que tu as fait et ce que tu aurais voulu faire.

### Ce que tu dois y écrire :
- Ce que tu as mis en place techniquement (même si ça n'est “pas fini”)
- Ce que tu voulais faire mais que tu n’as pas réussi à faire
- Les points bloquants ou les choix que tu as faits
- Ce que tu referais différemment
- Les prochaines étapes si tu avais eu plus de temps
- Si tu te sers d'une intelligence artificielle, tu peux aussi y mettre tes prompts et les liens vers tes conversations.

💡 Crée un fichier `carnet-de-bord.md` et le dépose-le dans le dossier de ton projet, à la racine.

Le but ? Aider l'équipe pédagogique à mieux comprendre ton intention et ton raisonnement mais aussi t'amener à prendre du recul sur ton travail et ta production !

## Charte de nommage 

Il faudra produire une charte de nommage dans un fichier `naming-convention.md` et la respecter du début à la fin ! Tu trouveras plus de détails dans la roadmap.

## Conception (optionnel)

Non obligatoire mais si tu veux travailler [MCD](https://kourou.oclock.io/ressources/fiche-recap/mcd-modele-conceptuel-de-donnees/), [MLD](https://kourou.oclock.io/ressources/fiche-recap/mld/), on ne peut que t'encourager à le faire. 👍

Cela te sera certainement très utile pour le titre professionnel notamment et de toute façon pour ton métier de développeur. C'est quand même mieux de savoir concevoir une base de données 🤓

### Conseils de conception

Pour le [MCD](https://kourou.oclock.io/ressources/fiche-recap/mcd-modele-conceptuel-de-donnees/), fais bien attention au sens des cardinalités, ne fais pas apparaitre les ids, attention à avoir des verbes qui ont du sens et qui ne se répètent pas.

Pour le MLD, tu as les [règles ici](https://kourou.oclock.io/ressources/fiche-recap/mld/).

## Infos et aides pour le projet

On t'a mis un dossier `docs` avec quelques fichiers te donnant des informations sur le projet.

- [roadmap.md](./docs/roadmap.md) qui contient les attendus du projet sous forme de user-stories (entre autres infos).
- [installation.md](./docs/installation.md) qui contient une courte série d'instructions pour lancer le projet.

Tu trouveras dans la feuille de route le détail des fonctionnalités attendues. Afin de produire un projet correspondant avec la réalité du métier, tu veilleras à produire un code propre, documenté et sécurisé, via notamment :
- la validation des entrées utilisateur
- la documentation
- le respect de contraintes métier
- la mise en place de tests
  
## Structure du projet

On t'a déjà créé un dossier api où tu trouveras les requêtes pour initaliser une base de données PostgreSQL.

Concernant la base de donnée, voici ce que tu pourrais avoir en version SQL, mais on te demande de la créer directement via les Models Sequelize et la synchronisation avec `sequelize.sync()` :

- [create_tables.sql](./api/data/sqlVersion/create_tables.sql) : le fichier de création des tables.
- [seeding_tables.sql](./api/data/sqlVersion/seeding_tables.sql) : le fichier de seeding des tables.

> _Tips: pour la partie seeding à adapter, n'oublie pas que tu as tes amis les IAs pour t'aider à générer le script. 🤖_

Bon, si tu bloques avec la génération via Sequelize, rien ne t'empêche d'utiliser ces deux scripts quand même et de bien faire la liaison avec tes Models.

## Besoin d'aide technique ?

Je n'ai qu'une seule chose à te dire : **ISSUE** ! 🚨

Je ne te montre pas le chemin, depuis le temps .. tu le connais 😏

## Le mot de la fin

Voilà, je crois que tu as tout ce qu'il faut pour te lancer, amuse-toi bien et n'oublie pas de faire des commits et push régulièrement, sinon tu risques de faire comme le concepteur de ce challenge qui a la facheuse tendance de ne pas pusher assez souvent ou alors au milieu d'une feature, et c'est dommage parce que la dernière fois, il a oublié de commiter les numéros du loto de la semaine prochaine justement, qui sont

_[TODO finir ce readme]_