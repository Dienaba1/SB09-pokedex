# SB09 - Projet O'Pokedex

Bienvenue sur ce projet Pokédex ! 👋

Ta mission de cette semaine est de mettre en place un Pokédex. Pour ceux qui ne connaissent pas, un Pokédex est une encyclopédie virtuelle recensant tous les Pokémons du jeu.

Mais ça ne s'arrête pas là ! Tu devras également mettre en place un système d'équipes de Pokémons. Les utilisateurs pourront créer des équipes, y ajouter des Pokémons, les renommer, les supprimer, etc. 😁

Tu auras aussi quelques bonus à ta disposition si tu souhaites continuer à te challenger. 💪

Le but de cette semaine est de pratiquer :

- La création d'une API REST
- La consommation de cette API depuis un client API (RestClient ou Postman), voire même depuis un front si tu le souhaites.

Maintenant que le contexte est posé, attention à bien lire toutes les consignes ci-dessous et prendre des notes de ton côté si tu l'estimes nécessaire. 📝

## Organisation

On te donne 4 jours pour réaliser ce projet et on t'a mis une [roadmap dans le dossier docs](./docs/roadmap.md) pour t'aider à t'organiser. 🗺️

Chaque jour à 16h tu recevras un mardkown pour te débloquer et atteindre la version minimale du projet.

On te fournira une correction  en fin de projet pour que tu puisses la comparer avec ta réalisation et modifier/continuer ton projet si tu le souhaites 🚀

## Conception (optionnel)

Non obligatoire mais si tu veux travailler [MCD](https://kourou.oclock.io/ressources/fiche-recap/mcd-modele-conceptuel-de-donnees/), [MLD](https://kourou.oclock.io/ressources/fiche-recap/mld/), on ne peut que t'encourager à le faire. 👍

Cela te sera certainement très utile pour le titre professionnel notamment et de toute façon pour ton métier de développeur. C'est quand même mieux de savoir concevoir une base de données 🤓

### Conseils de conception

Pour le [MCD](https://kourou.oclock.io/ressources/fiche-recap/mcd-modele-conceptuel-de-donnees/), fais bien attention au sens des cardinalités, ne fais pas apparaitre les ids, attention à avoir des verbes qui ont du sens et qui ne se répètent pas.

Pour le MLD, tu as les [règles ici](https://kourou.oclock.io/ressources/fiche-recap/mld/).

## Infos et aides pour le projet

On t'a mis un dossier `docs` avec quelques fichiers te donnant des informations sur le projet.

- [roadmap.md](./docs/roadmap.md) qui contient les attendus du projet sous forme de user-stories.
- [installation.md](./docs/installation.md) qui contient une courte série d'instructions pour lancer le projet.

## Structure du projet

On t'a déjà créé un dossier api où tu trouveras les requêtes pour initaliser une base de données PostgreSQL.

Concernant la base de donnée, voici ce que tu pourrais avoir en version SQL, **mais on te demande de la créer directement via les Models Sequelize et la synchronisation avec `sequelize.sync()`** :

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


