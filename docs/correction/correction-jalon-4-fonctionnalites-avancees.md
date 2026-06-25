# Correction guidée O'Pokedex

## :four: Jalon fonctionnalités avancées : recherche et favoris

> [!NOTE]
> Ce jalon ajoute plusieurs fonctionnalités indépendantes les unes des autres (recherche, favoris, visibilité des équipes, score). Vous pouvez les traiter dans l'ordre qui vous convient. Le guidage est volontairement plus léger que pour les jalons précédents : vous avez maintenant l'architecture (`Router` → `Controller` → `Service` → `Model`) et les réflexes (validation, gestion d'erreurs, alias d'association) pour avancer en plus grande autonomie.

---

### :large_orange_diamond: Recherche de Pokémon

Ajoutez une route de recherche de Pokémon, par nom et/ou par type, en respectant les contraintes de la roadmap :

- insensible à la casse
- correspondance partielle
- minimum 3 caractères pour lancer une recherche
- maximum 20 résultats

> [!TIP]
> Côté Sequelize, l'opérateur `Op.iLike` (PostgreSQL) permet une recherche insensible à la casse avec correspondance partielle (`%terme%`). Pour filtrer par type, vous chercherez dans l'association `Pokemon` ↔ `Type` mise en place au Jalon 1. L'option `include` avec une condition `where` sur le modèle inclus peut vous y aider.

> [!IMPORTANT]
> Réfléchissez à l'endroit où vérifier la contrainte des 3 caractères minimum : est-ce une règle de validation (middleware), une règle métier (Service), ou les deux ? Et que doit renvoyer l'API si la contrainte n'est pas respectée (liste vide, erreur 400...) ? Documentez votre choix.

---

### :large_orange_diamond: Favoris

#### Modèle et association

Créez le modèle de liaison nécessaire pour représenter "un utilisateur a mis un Pokémon en favori" (sur le même principe que `TeamPokemon` au Jalon 1), avec l'association correspondante entre `User` et `Pokemon`.

#### Routes côté utilisateur connecté

- ajouter un Pokémon à ses favoris
- retirer un Pokémon de ses favoris
- lister ses propres favoris

> [!IMPORTANT]
> La contrainte de la roadmap "un utilisateur connecté ne peut ajouter qu'une seule fois un Pokémon en favori" est une règle métier : elle doit être vérifiée dans la couche Service, comme pour la limite des 6 Pokémons au Jalon 1.

#### Routes côté visiteur

- nombre total d'enregistrements en favori pour un Pokémon donné (à vous de choisir où l'exposer : sur le détail du Pokémon, sur une route dédiée...)
- *(bonus)* classement des Pokémons les plus ajoutés en favoris

> [!TIP]
> Pour compter les favoris par Pokémon, vous pouvez soit utiliser une fonction d'agrégation Sequelize (`COUNT` via `fn`/`col`, avec un `GROUP BY`), soit calculer ce compte différemment si vous trouvez une approche plus simple avec les outils que vous maîtrisez. Les deux sont valables : l'important est que le résultat soit correct et que le code reste lisible.

---

### :large_orange_diamond: Équipes publiques / privées

#### Modèle

Ajoutez à l'entité `Team` un champ représentant sa visibilité (public/privé).

#### Création et modification

- à la création d'une équipe, l'utilisateur connecté choisit sa visibilité (avec une valeur par défaut si non précisée)
- il peut modifier cette visibilité plus tard

#### Adapter `GET /teams`

Cette route existe depuis le Jalon 1. Elle doit maintenant tenir compte de qui fait la requête :

- un visiteur (non authentifié) ne voit que les équipes publiques
- un utilisateur connecté voit les équipes publiques et ses propres équipes privées mais pas les équipes privées des autres

> [!IMPORTANT]
> Contrairement aux routes protégées du Jalon 2, cette route doit rester accessible sans authentification, tout en se comportant différemment si un token est fourni. Réfléchissez à la différence entre un middleware qui bloque une requête sans token (Jalon 2), et un middleware qui décode le token s'il est présent, sans bloquer sinon. Vous aurez peut-être besoin d'un second middleware, plus permissif que `authenticate`.

> [!TIP]
> Pensez à vérifier `GET /teams/:id` également : que doit-il se passer si un visiteur (ou un autre utilisateur) demande le détail d'une équipe privée qui n'est pas la sienne ?

---

### :large_orange_diamond: Score des équipes

Affichez, pour chaque équipe listée par `GET /teams` (équipes publiques et équipes privées de l'utilisateur connecté), un score calculé à partir des statistiques des Pokémons qui la composent.

> [!NOTE]
> La roadmap laisse l'algorithme de calcul libre (somme, moyenne...). La seule exigence est que toutes les équipes soient scorées de la même manière. Choisissez une formule simple, et documentez-la pour qu'elle reste compréhensible et reproductible.

> [!TIP]
> Réfléchissez à la couche dans laquelle calculer ce score : est-ce le rôle du Controller, du Service, ou du Model (par exemple via une méthode d'instance ou un attribut virtuel Sequelize) ? Et faut-il recalculer le score à chaque requête, ou existe-t-il un cas où le stocker en base aurait du sens ? Il n'y a pas une unique bonne réponse, mais vous devez pouvoir justifier votre choix.

> [!CAUTION]
> Une équipe peut être vide (0 Pokémon). Assurez-vous que votre calcul de score ne plante pas dans ce cas (division par zéro pour une moyenne, par exemple).

---

## Bilan du jalon

À ce stade, votre API permet :

- de rechercher des Pokémons par nom et/ou par type, avec les contraintes de la roadmap
- à un utilisateur connecté de gérer ses Pokémons favoris, et à tous de consulter la popularité des Pokémons
- de rendre une équipe publique ou privée, avec une route `GET /teams` qui s'adapte selon l'authentification
- d'afficher un score calculé de façon homogène pour chaque équipe

> [!NOTE]
> Pensez à tester ces nouvelles routes au fur et à mesure, comme évoqué au jalon précédent, en particulier les règles métier (unicité d'un favori, visibilité des équipes selon le profil de l'utilisateur) qui se prêtent bien à des tests de Service sur le modèle de ceux déjà écrits.

Bravo, et bonne continuation ! 🍀