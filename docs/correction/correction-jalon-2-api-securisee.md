# Correction guidée O'Pokedex

## :two: Jalon 2 : API sécurisée

> [!NOTE]
> Ce jalon s'appuie directement sur le travail du Jalon 1 : vous devez déjà avoir le CRUD `team`, la liste/détail des Pokémon, et la couche `services/` mise en place pour l'ajout/retrait de Pokémon dans une équipe.<br>
> On va maintenant ajouter une nouvelle entité `user`, l'authentification, et des règles de droits sur les équipes.

> [!TIP]
> Vous aurez besoin de deux nouvelles dépendances pour ce jalon :
>
> - [`argon2`](https://www.npmjs.com/package/argon2) pour hasher les mots de passe
> - [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) pour générer et vérifier des tokens
>
> Pensez aussi à ajouter une variable `JWT_SECRET` (et éventuellement `JWT_EXPIRES_IN`) à votre `.env` et `.env.example`. Pour générer un secret, vous pouvez par exemple lancer dans un terminal node : `require('crypto').randomBytes(64).toString('hex')`.

---

### :large_orange_diamond: Étape 1 : Modèle `User` et association avec `Team`

#### :small_orange_diamond: Créer le modèle `User`

Sur le modèle des fichiers déjà créés au Jalon 1, créez `models/User.js` avec au minimum les champs suivants :

- `email` : unique
- `username` : unique
- `password` : ce sera le mot de passe hashé, jamais le mot de passe en clair

> [!WARNING]
> Une donnée comme le mot de passe ne doit jamais être renvoyée dans une réponse JSON, même hashée. Pensez à exclure ce champ de vos réponses (par exemple via `defaultScope: { attributes: { exclude: ['password'] } }` dans la définition du modèle, ou en filtrant manuellement dans le contrôleur).

#### :small_orange_diamond: Associer `User` et `Team`

Une équipe doit maintenant avoir un propriétaire. Dans `models/index.js`, ajoutez l'association entre `User` et `Team` :

- un `User` peut posséder plusieurs `Team` (`hasMany`)
- une `Team` appartient à un `User` (`belongsTo`)

> [!TIP]
> Choisissez un alias parlant pour cette association (par exemple `owner` côté `Team`), en cohérence avec votre charte de nommage du Jalon 1.

#### :small_orange_diamond: Mettre à jour la base de données

Cette nouvelle association ajoute une colonne de clé étrangère sur la table `team`. Relancez votre script de synchronisation/seeding (`db:reset` ou équivalent) pour que la structure soit à jour.

> [!IMPORTANT]
> Profitez-en pour ajouter quelques utilisateurs de test dans votre script de seeding, et associez certaines équipes existantes à ces utilisateurs. Cela vous fera gagner du temps pour les tests des étapes suivantes !

---

### :large_orange_diamond: Étape 2 : Inscription

Place à la première user story : un visiteur doit pouvoir créer un compte.

#### :small_orange_diamond: Valider les données d'inscription

Rappel des règles de validation imposées par la roadmap pour `email`, `username` et `password` :

- `email` : format valide selon une regex standard, obligatoire, unique
- `username` : entre 3 et 20 caractères, obligatoire, unique, pas de caractères spéciaux
- `password` : minimum 8 caractères, obligatoire, doit contenir majuscules, minuscules et chiffres

Créez un fichier de validation (par exemple `middlewares/user.middleware.js`), sur le même principe que `team.middleware.js` du Jalon 1 (un schéma de validation + une fonction middleware qui l'applique au `body` de la requête).

> [!TIP]
> Pour la regex de l'email et celle du mot de passe (majuscule + minuscule + chiffre + 8 caractères mini), n'hésitez pas à demander à une IA de vous générer ces deux expressions régulières avec des exemples de chaînes valides/invalides, pour ensuite les tester et les intégrer à votre schéma de validation.

> [!NOTE]
> L'unicité de l'email et du username sera de toute façon vérifiée par votre base de données (contrainte `unique` sur le modèle). La validation en amont (Joi ou équivalent) sert surtout à renvoyer un message d'erreur clair **avant** de solliciter la BDD, mais gardez la gestion de l'erreur de duplication côté service/contrôleur en filet de sécurité.

#### :small_orange_diamond: Créer le service d'inscription

Créez `services/user.service.js` avec une fonction (par exemple `registerUser(userData)`) qui :

1. Hash le mot de passe reçu avec `argon2` (attention, c'est une opération asynchrone !).
2. Crée l'utilisateur en base avec le mot de passe hashé.
3. Gère le cas où l'email ou le username existe déjà (erreur de duplication Sequelize), en levant une erreur adaptée — réutilisez le système d'erreurs personnalisées mis en place au Jalon 1.
4. Retourne l'utilisateur créé, **sans son mot de passe**.

#### :small_orange_diamond: Créer le contrôleur et la route

- Créez `controllers/user.controller.js` avec une méthode `register()` qui appelle le service et renvoie une réponse `201` avec l'utilisateur créé (toujours sans mot de passe !).
- Créez un routeur (par exemple `routers/auth.router.js`) avec une route `POST /auth/register`, branchée dans `index.js`.

> [!IMPORTANT]
> Testez votre route avec votre fichier `tests.http` :
>
> - une inscription valide ;
> - un email déjà existant ;
> - un username déjà existant ;
> - un mot de passe ne respectant pas les critères ;
> - un email mal formé.
>
> Chaque cas doit renvoyer le bon code HTTP et un message d'erreur exploitable.

---

### :large_orange_diamond: Étape 3 : Connexion

#### :small_orange_diamond: Valider les données de connexion

Toujours dans `middlewares/user.middleware.js` (ou un fichier dédié `auth.middleware.js` si vous préférez séparer), ajoutez un schéma de validation pour la connexion : `email` et `password` sont simplement requis (pas besoin de revalider leur format ici, ce n'est pas leur rôle).

#### :small_orange_diamond: Créer le service de connexion

Créez `services/auth.service.js` avec une fonction (par exemple `login(email, password)`) qui :

1. Recherche l'utilisateur par email.
2. Compare le mot de passe reçu avec le mot de passe hashé en base, via `argon2.verify()`.
3. Si l'utilisateur n'existe pas, ou si le mot de passe ne correspond pas, lève la même erreur avec le même message flou : `"Email ou mot de passe incorrect"`.
4. Si tout est bon, génère un JWT (`jsonwebtoken`) contenant les informations utiles (par exemple `id` et `username` de l'utilisateur), signé avec votre `JWT_SECRET`, et le retourne.

> [!CAUTION]
> Le point 3 est une exigence de sécurité explicite de la roadmap : ne donnez jamais d'indice permettant de savoir si c'est l'email qui n'existe pas ou le mot de passe qui est faux. Le message d'erreur doit être strictement identique dans les deux cas.


#### :small_orange_diamond: Créer le contrôleur et la route

- Dans `controllers/user.controller.js` (ou `auth.controller.js`), ajoutez une méthode `login()` qui appelle le service et renvoie le token généré.
- Ajoutez la route `POST /auth/login` dans votre routeur.

<details>
<summary>Un coup de pouce pour tester l'enchaînement inscription → connexion ? 💡</summary>

```http
### Register
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "sacha@pokemon.com",
  "username": "sacha",
  "password": "Pikachu123"
}

### Login
# @name login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "sacha@pokemon.com",
  "password": "Pikachu123"
}

### Save the token to reuse it in the next requests
@token = {{login.response.body.token}}
```

</details>

> [!IMPORTANT]
> Testez aussi les cas d'erreur : email inexistant, et mot de passe incorrect. Vérifiez bien que le message renvoyé est identique dans les deux cas !

---

### :large_orange_diamond: Étape 4 : Déconnexion

Avec une authentification par token JWT, l'API est **stateless** : le serveur ne garde pas de trace des sessions. "Se déconnecter" consiste donc, côté client, à simplement supprimer le token stocké.


### :large_orange_diamond: Étape 5 : Créer le middleware d'authentification

Créez `middlewares/auth.middleware.js` avec une fonction (par exemple `authenticate`) qui :

1. Récupère le header `Authorization` de la requête.
2. Vérifie qu'il est bien présent et au format `Bearer <token>`. Sinon, renvoie une erreur `401`.
3. Vérifie le token avec `jsonwebtoken` et votre `JWT_SECRET`. Si le token est invalide ou expiré, renvoie une erreur `401`.
4. Si tout est bon, attache les informations décodées du token à la requête (par exemple `req.user`), puis appelle `next()`.

> [!TIP]
> Ce middleware ne sera utile que sur les routes qui le déclarent explicitement (vous le passerez en argument supplémentaire de vos routes, entre le chemin et le contrôleur). Pour le moment, aucune route ne l'utilise : on s'en sert dans l'étape suivante.

<details>
<summary>Comment tester rapidement mon middleware avant de l'utiliser pour de vrai ? 💡</summary>

Vous pouvez temporairement créer une route de test (par exemple `GET /me`), protégée par votre middleware `authenticate`, qui renvoie simplement `req.user`. Envoyez la requête avec et sans le header `Authorization: Bearer {{token}}` pour vérifier les deux comportements (`200` avec les infos, `401` sans, ou avec un token invalide).

Une fois que ça fonctionne, vous pourrez supprimer cette route de test (ou la garder, elle peut être utile !).

</details>

---

### :large_orange_diamond: Étape 6 : Permissions sur les équipes

C'est l'étape qui referme la boucle de ce jalon : la création et la modification des équipes deviennent réservées aux utilisateurs connectés, et chacun ne peut administrer que **ses propres** équipes.

#### :small_orange_diamond: Protéger les routes d'écriture

Dans `routers/team.router.js`, ajoutez le middleware `authenticate` (créé à l'étape précédente) sur toutes les routes qui modifient une équipe ou sa composition :

- `POST /teams` (création)
- `PATCH /teams/:id` (modification)
- `DELETE /teams/:id` (suppression)
- les deux routes d'ajout/retrait de Pokémon créées au Jalon 1

> [!NOTE]
> Les routes de consultation (`GET /teams` et `GET /teams/:id`) restent accessibles aux visiteurs, conformément à la roadmap.

#### :small_orange_diamond: Associer une équipe à son créateur

Lors de la création d'une équipe (`POST /teams`), l'identifiant de l'utilisateur connecté (récupéré grâce à `req.user`, posé par le middleware `authenticate`) doit être enregistré comme propriétaire de l'équipe.

> [!TIP]
> Ne faites pas confiance à un éventuel `userId` envoyé dans le `body` de la requête : utilisez uniquement celui du token, c'est la seule source fiable de l'identité de l'utilisateur connecté.

#### :small_orange_diamond: Vérifier la propriété dans la couche Service

Reprenez votre `team.service.js` du Jalon 1, et ajoutez la vérification de propriété pour les actions de modification (`update`, `delete`, ajout/retrait de Pokémon) :

1. Récupérer l'équipe concernée.
2. Comparer son propriétaire (`team.userId` ou équivalent selon votre alias) avec `req.user.id`.
3. Si ça ne correspond pas, renvoyer une erreur **403 (Forbidden)**, différente d'un **401 (Unauthorized)** qui signifie "vous n'êtes pas authentifié", alors qu'ici l'utilisateur est authentifié mais n'a pas le droit d'agir sur cette ressource précise.

> [!IMPORTANT]
> C'est exactement le même principe que pour la limite de 6 Pokémon au Jalon 1 : la règle de gestion ("on ne peut administrer que ses propres équipes") vit dans le Service, pas dans le Controller.

#### :small_orange_diamond: Valider le nom de l'équipe

Pendant que vous y êtes, complétez (ou créez) le schéma de validation pour la création/modification d'équipe, en appliquant la dernière règle de la roadmap :

- `nom` : obligatoire, entre 1 et 50 caractères, sensible à la casse.

> [!TIP]
> "Sensible à la casse" signifie ici qu'il ne faut pas normaliser le nom (par exemple en minuscules) avant de le stocker ou de vérifier son unicité : `"Team Rocket"` et `"team rocket"` doivent pouvoir être considérés comme deux noms différents.

> [!IMPORTANT]
> Reprenez l'intégralité de vos tests du Jalon 1 sur les équipes (création, modification, suppression, ajout/retrait de Pokémon) et rejouez-les :
>
> - sans token → `401`
> - avec le token d'un autre utilisateur que le propriétaire → `403`
> - avec le token du propriétaire → `200`/`201`/etc., comme avant
> - avec un nom d'équipe vide ou de plus de 50 caractères → `400`

---

## Bilan du Jalon 2

À ce stade, votre API permet :

- de créer un compte (`POST /auth/register`) et de se connecter (`POST /auth/login`) avec un système de validation strict ;
- de sécuriser les routes sensibles grâce à un middleware d'authentification basé sur JWT ;
- de réserver la création/modification des équipes aux utilisateurs connectés, et de limiter chaque utilisateur à ses propres équipes via la couche Service.

> [!NOTE]
> Le prochain jalon **API professionnelle** va vous servir à documenter tout ce que vous venez de construire et à écrire des tests automatisés.

Bravo, et bonne continuation ! 🍀