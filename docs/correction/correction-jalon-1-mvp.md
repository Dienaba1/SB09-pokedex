# Correction guidée O'Pokedex

## :one: Jalon 1 : MVP

> [!NOTE]
> Le fichier `docs/installation.md` fourni dans l'énoncé vous guide pas à pas dans la mise en place de votre API. Vous devriez normalement déjà avoir Node installé sur votre machine.<br>
> Pensez à bien vous positionner dans le dossier `api/` avant d'initialiser votre dépôt (`npm init -y`) et d'écrire votre code. <br>Si par la suite vous voulez créer un front, vous pourrez le faire dans un dossier `client/` à la racine du dépôt.

---

### :large_orange_diamond: Étape 0 : Charte de nommage

Avant de toucher au code, prenez quelques minutes pour poser **votre** charte de nommage. Ce n'est pas une perte de temps : c'est ce qui vous évitera d'avoir, dans le même projet, un coup `getUserById`, un coup `get_user_by_id` et un coup `fetchUser` 😅

Voici les points à trancher, avec quelques repères courants dans l'écosystème JS/Node :

- **Variables, fonctions** : en JavaScript, le standard est le `camelCase` (`getAllTeams`, `teamId`...).
- **Classes / Models** : plutôt en `PascalCase` (`Team`, `Pokemon`, `TeamPokemon`...). C'est d'ailleurs ce que Sequelize attend pour vos modèles.
- **Tables et colonnes en base** : en PostgreSQL, la convention la plus répandue est le `snake_case` (`team_pokemon`, `created_at`...). Vous verrez plus loin que Sequelize utilise par défaut le `camelCase` pour les attributs JS mais peut très bien mapper vers des colonnes en `snake_case`.
- **Routes / endpoints** : suivez les conventions RESTful (noms de ressources au pluriel, en minuscules, ressources imbriquées pour les relations, ex. `/teams/:id/pokemons`).
- **Branches Git** : par exemple `feature/nom-de-la-feature`, `fix/nom-du-bug`...
- **Commits** : par exemple le format [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/) (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).

> [!TIP]
> Une fois vos choix faits, notez-les (dans le `README.md`, ou dans un fichier `CONVENTIONS.md` dédié). Vous pourrez ainsi vous y référer tout au long du projet, et ça sera particulièrement utile si vous travaillez en équipe.

> [!IMPORTANT]
> L'important n'est pas la convention que vous choisissez, mais le fait de **vous y tenir du début à la fin**. Un jury, comme un collègue, remarquera tout de suite des incohérences de nommage : c'est un critère de professionnalisme.

---

### :large_orange_diamond: Étape 1 : mise en place initiale du projet

En suivant le fichier d'installation, vous devriez avoir fait les actions/commandes suivantes :

- `npm init -y` dans le dossier `api/`
- Modification du fichier `package.json` créé pour :
  - remplacer `"type": "commonjs"` par `"type": "module"` (pour utiliser les imports ES6)
  - un script de dev `"dev": "node --watch index.js"`

> [!TIP]
> C'est le bon moment pour créer votre fichier `.gitignore` afin de ne pas l'oublier !

 ```md
   node_modules/
   ```

#### :small_orange_diamond: Installation des dépendances

1. Installez Express (framework pour créer des API facilement) :

   ```bash
   npm install express
   ```

> [!TIP]
> Dans ce projet, on va se reposer sur la gestion native du `.env` par Node, en utilisant le flag `--env-file` dans le script qui démarre le serveur. Le script modifié ressemblera donc à ceci :

```bash
    "dev": "node --watch --env-file=.env index.js"
```

Si vous avez une version de Node inférieure à la 22, vous devrez sans doute installer le package `dotenv` et l'importer avec `import "dotenv/config"` dans chaque fichier où vous allez l'utiliser. Ou alors, mettre votre version de Node à jour pour adopter la solution décrite au dessus 😉

#### :small_orange_diamond: Création du fichier principal

Créez un fichier `index.js` à la racine du projet (toujours dans le dossier `api/`).
Importez Express, créez votre app, une première route `"/"` pour tester et démarrez votre serveur. Vous pouvez dans un premier temps lui passer le port en dur, mais le mieux est de lui passer une variable d'environnement et pour cela, vous aurez besoin d'un fichier `.env`.

#### :small_orange_diamond: Configuration des variables d'environnement

Créez le fichier `.env` à la racine du projet (toujours dans le dossier `api/`, vous avez compris 😁).

   ```md
   PORT=3001
   ```

>[!TIP]
> Mettez dans votre fichier un numéro de port différent de celui que vous avez mis par défaut dans votre `index.js`. Ainsi au démarrage du serveur, vous saurez tout de suite si votre `.env` est bien chargé juste en regardant le numéro de port 😉

> [!IMPORTANT]  
>
> - Pensez à créer le fichier `.env.example` pour documenter vos variables d'environnement et faciliter la mise en place du `.env` par d'autres développeurs.

> [!CAUTION]
>
> - Pensez aussi à ajouter votre `.env` à votre `.gitignore`. Tant qu'il n'y a que le port dedans, ce n'est pas très grave, mais quand vous y aurez ajouté vos informations de connexion ou autres secrets, tout oubli sera problématique 😱

#### :small_orange_diamond: Lancement du serveur et tests avec un outil API

   ```bash
   npm run dev
   ```

Vous pouvez tester avec l'extension REST Client directement dans VS Code, en créant un fichier `tests.http`. Mais vous pouvez aussi utiliser des outils externes comme Postman, Insomnia, Thunder Client, Swagger (qui permet aussi d'écrire la doc de l'API 😉)

Si tout fonctionne, bravo ! 👏
Vous pouvez maintenant passer à la suite !

:arrow_right: Structure recommandée

```bash
api/
  ├── index.js           # Point d'entrée principal
  ├── package.json       # Configuration du projet
  ├── .env               # Variables d'environnement (ne pas commiter)
  ├── .env.example       # Exemple de variables d'environnement
  ├── controllers/       # Logique des routes
  ├── services/          # Logique métier (règles de gestion)
  ├── models/            # Définitions des modèles de données
  ├── routers/           # Définition des routes
  └── utils/             # Fonctions utilitaires
  └── data/              # Contenant les scripts de migration
```

> [!NOTE]
> Vous remarquerez qu'on a ajouté un dossier `services/` à la structure habituelle. On y reviendra en détail à l'étape 7 : c'est la couche qui contiendra la logique métier (les règles de gestion comme la limite de 6 Pokémons par équipe), séparée des contrôleurs qui eux gèrent uniquement les requêtes/réponses HTTP.

---

### :large_orange_diamond: Étape 2 : Mise en place de la BDD

Avant de poursuivre, vous aurez besoin d'une BDD. Commencez par la créer sur votre Postgresql, en créant aussi un utilisateur dédié à cette BDD.

> [!WARNING]  
> Évitez d'utiliser l'user principal "postgres" qui a tous les droits, car vous ne ferez pas ça en entreprise. Un projet = une BDD = un user dédié.

Une fois cette préparation faite, ajoutez les infos de connexion à votre `.env` et une version épurée et documentée à votre `.env.example`.

---

### :large_orange_diamond: Étape 3 : Initialisation de Sequelize

Ajoutez les dépendances nécessaires à votre projet (`Sequelize`, `pg`) et créez un fichier qui s'occupera de la connexion à la BDD. Ce fichier aura besoin de vos infos de connexion depuis le `.env`.

<details>
<summary> Un petit coup de pouce ? 💡
</summary>

```javascript
//fichier models/sequelize.client.js

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PG_URL, {
define: {
    createdAt: "created_at",
    updatedAt: "updated_at"
},
logging: false
}); 

await sequelize.authenticate();
```

</details>

---

### :large_orange_diamond: Étape 4 : GET & DELETE pour Team

Ce guide vous aidera à implémenter les fonctionnalités de base pour récupérer (GET) et supprimer (DELETE) des équipes de Pokémon. Suivez ces étapes pas à pas pour mettre en place ces opérations CRUD essentielles.

#### :small_orange_diamond: Configurer les modèles Sequelize

Commençons par créer les modèles qui définiront la structure de nos données : le modèle Team (`models/Team.js`), puis le modèle Pokémon (`models/Pokemon.js`), et enfin le modèle de liaison (`models/TeamPokemon.js`).

> [!TIP]
> Il est aussi possible de se passer de ce dernier fichier décrivant la table de liaison, et de faire l'association directement dans le fichier `index.js`. La déclaration sera alors légèrement différente.

L'étape suivante est la création du fichier `models/index.js`, qui importera `sequelize` et tous les modèles, déclarera les associations à l'aide des méthodes `belongsToOne()`, `belongsToMany()`, etc.
Une fois les associations faites, le fichier devra exporter à nouveau les modèles et `sequelize`. Ainsi, c'est ce fichier d'index qu'on importera au besoin, et non plus les modèles directement.

> [!TIP]
> Choisissez bien vos alias d'association (`as: "..."`). C'est notamment ce qui déterminera le nom des méthodes générées automatiquement par Sequelize (`addPokemon`, `removePokemon`, `getPokemons`...), dont vous aurez besoin un peu plus loin.

#### :small_orange_diamond: Préparer un fichier de seeding

On vous fournit des fichiers SQL pour référence, avec toutes les données nécessaires dedans. Cependant, l'idée n'est pas d'exécuter ces fichiers SQL tels quels, ça rentrerait en conflit notamment avec la gestion interne des ID de Sequelize. On va donc plutôt écrire un script qui initialise et réinitialise la BDD à la demande, et qui utilisera les méthodes de Sequelize, `sync()` et `bulkCreate()`. Comme c'est une tâche potentiellement chronophage, on va demander à une IA de faire ça pour nous ! 🤩

>[!TIP]
> Exemple de prompt à utiliser directement dans VS Code
>
> *Dans ce dépôt se trouve un fichier de seeding, `seeding_tables.sql`. Utilise les valeurs contenues dans ce fichier pour créer un script de seeding utilisant Sequelize, avec les méthodes `sync()` et `bulkCreate()`. Ce fichier SQL ne sert que de référence, pas de source de vérité. La source de vérité sera le nouveau fichier contenant le script de seeding, qu'on pourra appeler via un script appelé `db:seed` dans `package.json`. Toute modification ultérieure sera renseignée directement dans ce script sans passer par le fichier SQL d'origine.*

On devrait obtenir un fichier qui ressemble à ça :

<details>

<summary> ➡️ Cliquez pour voir le détail du fichier db-seed.js
</summary>

```js
import { Type, Pokemon, PokemonType, Team, TeamPokemon, sequelize } from './models/index.js';

const types = [
  { id: 1, name: 'Acier', color: 'aaaabb' },
  // ...
  { id: 17, name: 'Vol', color: '6699ff' },
];

const pokemons = [
  { id: 1, name: 'Bulbizarre', hp: 45, atk: 49, def: 49, atk_spe: 65, def_spe: 65, speed: 45 },
  // ...
 { id: 151, name: 'Mew', hp: 100, atk: 100, def: 100, atk_spe: 100, def_spe: 100, speed: 100 },
];

const pokemonTypes = [
  { pokemonId: 1, typeId: 10 },
  // ...
   { pokemonId: 151, typeId: 12 },
];

const teams = [
  { id: 1, name: 'Ultimate Team', description: 'La meilleure team du monde' },
  { id: 2, name: 'La Team de l\'enfer', description: 'Le feuuuuu' },
  { id: 3, name: 'Squad fofolle', description: 'Pour tout gagner' },
];

const teamPokemons = [
  { pokemonId: 3, teamId: 1 },
  // ...
  { pokemonId: 144, teamId: 3 },
];

async function seedDatabase() {
    try {
        console.log('🔄 Synchronisation avec la base de données...');
        await sequelize.sync({ force: true });
        console.log('✅ Tables créées avec succès');

        console.log('🌱 Insertion des types...');
        await Type.bulkCreate(types);
        console.log('✅ Types insérés');

        console.log('🌱 Insertion des Pokémon...');
        await Pokemon.bulkCreate(pokemons);
        console.log('✅ Pokémon insérés');

        console.log('🌱 Insertion des types de Pokémon...');
        await PokemonType.bulkCreate(pokemonTypes);
        console.log('✅ Types de Pokémon insérés');

        console.log('🌱 Insertion des équipes...');
        await Team.bulkCreate(teams);
        console.log('✅ Équipes insérées');

        console.log('🌱 Insertion des Pokémon d\'équipe...');
        await TeamPokemon.bulkCreate(teamPokemons);
        console.log('✅ Pokémon d\'équipe insérés');

        console.log('✨ Base de données prête !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seeding :', error.message);
        process.exit(1);
    }
}

seedDatabase();
```

</details>

> [!WARNING]  
> Pour pouvoir exécuter ce script, il faudra avoir créé les models correspondant à `Type` et `PokemonType` ! On y revient juste en dessous, car ils vous serviront aussi pour la partie Pokémon de ce jalon.

### :small_orange_diamond: Créer les contrôleurs pour Team

Avant tout, on peut installer une dépendance supplémentaire pour faciliter l'affichage des codes HTTP, `http-status-codes`.

- Créez ensuite le fichier `team.controller.js` dans votre dossier `controllers`.
- Vous aurez besoin d'importer vos modèles depuis votre `index.js` d'associations et éventuellement la dépendance installée juste avant pour les codes HTTP.
- Créez maintenant les fonctions du contrôleur qui géreront les opérations GET : `getAll()`, `getById()` et `deleteById()` par exemple.
- Rappelez-vous qu'elles doivent être asynchrones, faire appel aux méthodes Sequelize adaptées et retourner du `json` 😉
- Pensez également à gérer les erreurs et à retourner le bon code HTTP.
- N'oubliez pas d'exporter vos méthodes pour pouvoir les utiliser !

> [!IMPORTANT]
> **Contrainte du jalon** : la suppression d'une équipe doit renvoyer **un message de confirmation**, et non une réponse vide. Plutôt qu'un simple `204 No Content`, votre `deleteById()` doit donc répondre avec un petit objet JSON, par exemple `{ message: "L'équipe ... a bien été supprimée" }`. Pensez à inclure une information utile dans ce message (le nom ou l'id de l'équipe supprimée).

### :small_orange_diamond: Créer les routes pour Team

Maintenant, définissons les routes qui permettront d'accéder aux fonctionnalités que nous venons de créer.

- Créez le fichier `routers/team.router.js`
- Importez dedans tout ce que vous avez créé dans votre contrôleur ainsi que le routeur depuis Express.
- Créez un nouveau routeur...
- ... et toutes les routes correspondant aux méthodes du contrôleur ! À cette étape, vous devriez donc en avoir trois : deux en `get`, une en `delete`.

Il faudra ensuite modifier votre fichier `index.js` principal à la racine de votre projet :

- pour inclure ce nouveau routeur (pour l'instant, votre API n'a qu'une route `/`)
- et dire à Express que vous renvoyez des réponses en `json`.

> [!IMPORTANT]  
> C'est le moment de tester vos routes nouvellement créées ! Complétez votre fichier de test HTTP et envoyez des requêtes pour voir ce que vous recevez !

<details>
<summary>Un coup de pouce pour les tests ? 💡
</summary>

```http
@baseUrl = http://localhost:3001

### Get all teams
# @name all
GET {{baseUrl}}/teams

### Save the last id to use it after
@id = {{all.response.body.0.id}}

### Get a team by ID
GET {{baseUrl}}/teams/{{id}}

### Delete a team
DELETE {{baseUrl}}/teams/{{id}}
```

</details>

#### Félicitations 👏

Vous avez maintenant implémenté les opérations GET et DELETE pour l'entité Team. Ces fonctionnalités permettent :

1. De récupérer la liste de toutes les équipes
2. De récupérer une équipe spécifique avec tous ses Pokémon
3. De supprimer une équipe, avec un message de confirmation

---

### :large_orange_diamond: Étape 5 : POST & PATCH pour Team

Dans cette partie, nous allons voir comment implémenter les méthodes POST et PATCH pour l'entité "team". Ces opérations permettent respectivement de créer une nouvelle équipe et de mettre à jour une équipe existante.

#### :small_orange_diamond: Mise à jour du Controller

- Commencez par ajouter les méthodes nécessaires dans le controller `TeamController` : `create()` et `update()`. Dans les deux cas, il faudra faire appel à la méthode dédiée de Sequelize via le model `Team` et lui passer le `body` de la requête.
- Gérez les erreurs de type duplication (contrainte UNIQUE non respectée) à la création, ou de ressource non trouvée à la mise à jour.

#### :small_orange_diamond: Mise à jour des Routes

- Ajoutez les deux routes correspondantes dans le fichier de routes `team.router.js`.
- L'une des deux sera une route avec un paramètre.
- Une route en `post`, une route en `patch` !

> [!TIP]
> Pensez à les tester via votre fichier de tests.http, en couvrant tous les cas !

> [!NOTE]
> Le jalon suivant (API sécurisée) ajoutera des règles de validation strictes sur les champs (longueur du nom, etc.). Pour l'instant, on se contente de vérifications simples (champ obligatoire), mais gardez en tête que `create()` et `update()` sont les méthodes que vous viendrez enrichir par la suite.

#### Félicitations 👏

Vous avez maintenant implémenté les méthodes POST et PATCH pour l'entité "team". Vous pouvez créer de nouvelles équipes et mettre à jour des équipes existantes via votre API. Bravo !

---

### :large_orange_diamond: Étape 6 : Liste et détails des Pokémon

Place maintenant à la partie Pokémon de ce jalon : les visiteurs doivent pouvoir consulter la liste des Pokémon, ainsi que le détail de l'un d'entre eux.

#### :small_orange_diamond: Compléter les modèles

Si vous ne l'avez pas encore fait à l'étape précédente (pour le seeding), il est temps de créer les modèles `Type` et `PokemonType`, sur le même principe que `Team`/`Pokemon`/`TeamPokemon` :

- `models/Type.js` : un modèle simple avec `name` et `color`.
- `models/PokemonType.js` : le modèle de la table de liaison entre `Pokemon` et `Type`.

Dans votre `models/index.js`, ajoutez les associations `belongsToMany` entre `Pokemon` et `Type` (via `PokemonType`), avec des alias clairs (par exemple `pokemons` côté `Type` et `types` côté `Pokemon`).

> [!TIP]
> Vous avez maintenant deux relations many-to-many qui passent par le modèle `Pokemon` (`Team` ↔ `Pokemon` et `Pokemon` ↔ `Type`). Vérifiez que chaque association a un alias unique sur le modèle concerné, pour ne pas générer de conflits de méthodes.

N'oubliez pas de lancer (ou relancer) votre script de seeding pour avoir les types et leurs associations en base 😉

#### :small_orange_diamond: Créer le contrôleur Pokémon

Sur le même modèle que pour `team.controller.js`, créez un fichier `pokemon.controller.js` avec :

- `getAll()` : renvoie la liste de tous les Pokémon. Vous pouvez choisir d'inclure ou non leurs types dans cette liste (pensez à la lisibilité de la réponse).
- `getById()` : renvoie le détail d'un Pokémon, en incluant cette fois ses types (rappelez-vous l'alias choisi dans vos associations !) afin de répondre à la user story "connaître ses caractéristiques".
- Gérez le cas où le Pokémon demandé n'existe pas (404).

#### :small_orange_diamond: Créer les routes Pokémon

- Créez le fichier `routers/pokemon.router.js`, sur le même schéma que `team.router.js`.
- Deux routes en `get` : la liste, et le détail par id.
- Montez ce nouveau routeur dans `index.js`, sur le préfixe `/pokemons`.

> [!IMPORTANT]
> Testez vos deux nouvelles routes via votre fichier `tests.http` : la liste complète, puis le détail d'un Pokémon en particulier (vérifiez que ses types apparaissent bien dans la réponse).

#### Félicitations 👏

Les visiteurs peuvent maintenant consulter la liste des Pokémon et le détail de chacun d'entre eux, types compris.

---

### :large_orange_diamond: Étape 7 : Ajouter/retirer un Pokémon d'une équipe — introduction de la couche Service

C'est l'étape la plus importante de ce jalon ! Il s'agit de permettre à un visiteur d'ajouter un Pokémon à une équipe, ou de l'en retirer — tout en respectant deux règles de gestion :

- une équipe ne peut pas contenir plus de **6 Pokémon** ;
- un même Pokémon ne peut pas être **deux fois** dans la même équipe.

> [!IMPORTANT]
> La roadmap est claire : ces règles **doivent être vérifiées dans une couche Service**, pas seulement dans le Controller. C'est l'occasion de mettre en place une architecture en couches plus propre :
>
> `Router` → `Controller` → `Service` → `Model`
>
> - Le **Router** ne fait que déclarer les routes et les associer aux bonnes méthodes du Controller.
> - Le **Controller** s'occupe uniquement de la couche HTTP : il lit la requête, appelle le Service, et formate la réponse (code HTTP + JSON).
> - Le **Service** contient la logique métier : c'est lui qui sait qu'une équipe ne peut pas dépasser 6 Pokémon, ou qu'un Pokémon ne peut pas être ajouté deux fois.
> - Le **Model** (Sequelize) reste la seule couche qui parle à la base de données.

#### :small_orange_diamond: Créer la couche Service

Créez un dossier `services/` (s'il n'existe pas déjà) et un fichier `team.service.js`. Vous y écrirez deux fonctions, par exemple `addPokemonToTeam(teamId, pokemonId)` et `removePokemonFromTeam(teamId, pokemonId)`.

Pour `addPokemonToTeam`, la fonction devra :

1. Récupérer l'équipe correspondant à `teamId` (en incluant ses Pokémon actuels), et le Pokémon correspondant à `pokemonId`.
2. Si l'un des deux n'existe pas, signaler une erreur "ressource non trouvée".
3. Vérifier que le Pokémon n'est **pas déjà** dans l'équipe (sinon, erreur).
4. Vérifier que l'équipe contient **moins de 6 Pokémon** (sinon, erreur "équipe complète").
5. Si tout est ok, ajouter le Pokémon à l'équipe via la méthode générée par votre association (par exemple `team.addPokemon(pokemon)`), puis renvoyer l'équipe à jour.

Pour `removePokemonFromTeam`, la fonction devra :

1. Récupérer l'équipe et le Pokémon.
2. Si l'un des deux n'existe pas, signaler une erreur "ressource non trouvée".
3. Vérifier que le Pokémon fait bien partie de cette équipe (sinon, erreur "non trouvé").
4. Retirer l'association via la méthode générée (par exemple `team.removePokemon(pokemon)`).

> [!NOTE]
> Pensez bien à la gestion globale des erreurs !

#### :small_orange_diamond: Adapter le contrôleur Team

Dans `team.controller.js`, ajoutez deux nouvelles méthodes (par exemple `addPokemon()` et `removePokemon()`) qui :

- récupèrent `teamId` (et `pokemonId`) depuis les paramètres/le corps de la requête ;
- appellent les fonctions correspondantes du Service ;
- transforment le résultat (ou l'erreur levée par le Service) en réponse HTTP avec le bon code de statut.

#### :small_orange_diamond: Ajouter les routes

Dans `team.router.js`, ajoutez deux routes imbriquées, en cohérence avec votre charte de nommage (étape 0) et les conventions RESTful :

- une route en `post` pour ajouter un Pokémon à une équipe (par exemple `/teams/:id/pokemons`, avec l'id du Pokémon dans le corps de la requête) ;
- une route en `delete` pour retirer un Pokémon d'une équipe (par exemple `/teams/:teamId/pokemons/:pokemonId`).

> [!IMPORTANT]
> Testez consciencieusement, y compris (et surtout !) les cas d'erreur :
>
> - ajouter un 7ᵉ Pokémon à une équipe qui en a déjà 6 ;
> - ajouter un Pokémon déjà présent dans l'équipe ;
> - retirer un Pokémon qui n'est pas dans l'équipe ;
> - utiliser un `teamId` ou un `pokemonId` qui n'existe pas.
>
> Chacun de ces cas doit renvoyer un code HTTP et un message d'erreur clairs, sans jamais planter le serveur.

#### Félicitations 👏

Votre API permet désormais de composer des équipes complètes : ajouter et retirer des Pokémon, avec des règles de gestion centralisées et testables dans une couche Service dédiée.

---

## Bilan du Jalon 1

À ce stade, votre API permet :

- le CRUD complet sur les équipes (`team`), avec un message de confirmation à la suppression ;
- la consultation de la liste et du détail des Pokémon (avec leurs types) ;
- l'ajout et le retrait d'un Pokémon dans une équipe, avec deux règles de gestion (6 Pokémon max, unicité) vérifiées dans une couche Service.

Vous avez également :

- posé une charte de nommage et tenté de vous y tenir 😉 ;
- mis en place une architecture en couches `Router` → `Controller` → `Service` → `Model`.

> [!NOTE]
> Le prochain jalon (**API sécurisée**) s'appuiera directement sur cette base pour ajouter l'authentification, la gestion des droits, et des validations strictes sur toutes les entrées utilisateur.

Bravo, et bonne continuation ! 🍀