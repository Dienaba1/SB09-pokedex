# Correction guidée O'Pokedex

## :five: Jalon optionnel 1 : front

> [!NOTE]
> L'objectif de ce jalon est de **consommer votre propre API** depuis un navigateur, en JavaScript vanilla. C'est avant tout une occasion de pratiquer le back, ne passez pas trop de temps sur les détails visuels, le CSS est déjà fourni !
>
> Le dossier `integration/` contient tout ce dont vous avez besoin pour démarrer : une page de départ (`starterPage.html`), un catalogue de composants prêts à l'emploi (`components.html`), les images des Pokémon (`assets/img/{id}.webp`) et la feuille de style (`assets/css/style.css`).

---

### :large_orange_diamond: Étape 1 : Prendre connaissance des éléments fournis

Avant d'écrire la moindre ligne, ouvrez `components.html` dans votre navigateur. Cette page liste tous les composants disponibles avec leur code HTML prêt à copier :

- **Carte Pokémon** : pour afficher la liste
- **Modale détail Pokémon** : stats, types, ajout à une équipe
- **Item équipe** : pour afficher la liste des équipes
- **Modale détail équipe** : composition de l'équipe, avec option de retrait
- **Modale ajout équipe** : formulaire de création

> [!TIP]
> Les images sont nommées par l'id du Pokémon : `assets/img/1.webp`, `assets/img/25.webp`, etc. Il suffit donc de connaître l'id d'un Pokémon pour afficher son image, sans appel réseau supplémentaire. Gardez ça en tête quand vous construirez vos cartes Pokémon.

---

### :large_orange_diamond: Étape 2 : Mettre en place le projet front

Placez votre front dans un dossier `client/` à la racine du projet (au même niveau que `api/`).

#### :small_orange_diamond: Gérer le CORS

Votre front va appeler votre API depuis un autre port (ou une autre origine). Express bloque ce type de requêtes par défaut. Installez le package `cors` côté API et activez-le dans `index.js`.

> [!TIP]
> En développement, vous pouvez autoriser toutes les origines. En production, pensez à restreindre au domaine de votre front, mais ce n'est pas la priorité ici.

#### :small_orange_diamond: Organiser votre code JS

Partez de `starterPage.html` comme point d'entrée. Pour garder le code lisible, pensez à séparer vos responsabilités dès le départ :

- les appels à l'API dans un fichier dédié (par exemple `api.js`) ;
- le rendu HTML (création de cartes, modales...) dans un autre (par exemple `render.js` ou `components.js`) ;
- la logique de navigation et d'interaction dans un `main.js` ou directement dans `app.js`.

> [!NOTE]
> Vous n'avez pas de framework ici, donc pas de système de composants automatique. L'organisation ci-dessus n'est qu'une suggestion : l'important est que votre code reste lisible et que vous sachiez où trouver quoi.

---

### :large_orange_diamond: Étape 3 : Afficher la liste des Pokémon

C'est le bon point de départ : un appel `GET /pokemons` et l'affichage des cartes fournies dans `components.html`.

Chaque carte doit afficher :

- l'image du Pokémon (en utilisant l'id pour construire le chemin `assets/img/{id}.webp`) ;
- son nom.

Au clic sur une carte, ouvrir la **modale de détail** avec ses statistiques et ses types (appel `GET /pokemons/:id`).

---

### :large_orange_diamond: Étape 4 : Afficher la liste des équipes

Affichez les équipes publiques (`GET /teams`), en utilisant le composant "Item équipe" de `components.html`. Pour chaque équipe, affichez les avatars des Pokémon qui la composent.

Au clic sur "Administrer", ouvrir la **modale de détail de l'équipe** avec la liste complète de ses Pokémon.

---

### :large_orange_diamond: Étape 5 : Authentification

Mettez en place les formulaires de connexion et d'inscription, et **persistez le token** reçu à la connexion (par exemple dans le `localStorage`) pour l'inclure dans le header `Authorization` de toutes les requêtes qui le nécessitent.

> [!IMPORTANT]
> Une fois connecté, le comportement de l'interface doit changer : la navigation doit proposer de se déconnecter, et les actions réservées aux utilisateurs (créer une équipe, gérer ses propres équipes...) doivent devenir accessibles.

> [!TIP]
> Au rechargement de la page, vérifiez si un token est présent dans le `localStorage` et, si oui, considérez l'utilisateur comme connecté sans lui redemander de se reconnecter.

---

### :large_orange_diamond: Étape 6 : Actions utilisateur connecté

Une fois l'authentification en place, branchez les fonctionnalités réservées aux utilisateurs connectés :

- **Créer une équipe** via la modale d'ajout fournie dans `components.html` ;
- **Ajouter un Pokémon à une équipe** depuis la modale de détail d'un Pokémon (le `<select>` liste les équipes de l'utilisateur) ;
- **Retirer un Pokémon d'une équipe** via l'icône poubelle dans la modale de détail d'une équipe ;
- **Supprimer une équipe**.

> [!TIP]
> Pour les actions qui modifient des données (`POST`, `PATCH`, `DELETE`), pensez à **actualiser l'affichage** après la réponse de l'API sans recharger toute la page : c'est là que le fait d'avoir isolé vos fonctions de rendu et d'appel API à l'étape 2 se révèle utile.

---

### :large_orange_diamond: (Bonus) Images depuis une API externe

Si vous souhaitez aller plus loin sur la partie images, vous pouvez remplacer les images locales par celles d'une API externe dédiée aux Pokémon (il en existe plusieurs, dont la très complète [PokéAPI](https://pokeapi.co/)). C'est une bonne occasion de pratiquer la consommation d'une API tierce et de lire de la documentation en anglais.

> [!NOTE]
> Les images locales fournies dans `assets/img/` couvrent les 151 premiers Pokémon et sont parfaitement suffisantes pour ce projet. Cette piste est facultative et ne doit pas vous faire perdre trop de temps.

---

## Bilan du jalon

À ce stade, votre projet dispose d'une interface utilisable dans un navigateur, branchée sur votre propre API. Vous avez pratiqué :

- la gestion du CORS entre un front et un back locaux ;
- la consommation d'une API REST depuis du JavaScript vanilla (`fetch`, `async`/`await`) ;
- la persistance d'un token JWT côté client et son utilisation dans les appels protégés.

Bravo, et bonne continuation ! 🍀