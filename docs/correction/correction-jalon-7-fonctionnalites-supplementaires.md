# Correction guidée O'Pokedex

## :seven: Jalons bonus

> [!NOTE]
> Ces deux bonus s'adressent aux apprenants qui ont terminé les jalons principaux et veulent aller plus loin. Pas de pas à pas détaillé ici : les grandes orientations et les points de vigilance sont là pour vous guider, mais c'est à vous de concevoir et d'implémenter la solution.

---

### :large_orange_diamond: Bonus 1 : Comparaison avancée de Pokémon

**Objectif** : permettre de comparer deux Pokémon côte à côte, avec leurs statistiques respectives.

#### Côté API

Créez une route dédiée (par exemple `GET /pokemons/compare?ids=25,1`) qui accepte deux identifiants de Pokémon et renvoie leurs données complètes (stats, types) dans une structure adaptée à la comparaison.

> [!TIP]
> Réfléchissez à la forme de la réponse : un tableau de deux Pokémon ? Un objet avec deux clés ? La structure que vous choisissez doit rendre la vie facile au front : pensez à ce dont vous aurez besoin pour afficher les stats en regard.

> [!IMPORTANT]
> Gérez les cas d'erreur : un ou deux ids manquants, un Pokémon inexistant, deux fois le même id...

#### Côté front (si vous avez fait le jalon optionnel)

Ajoutez une interface de comparaison : l'utilisateur sélectionne deux Pokémon (via deux listes déroulantes ou deux champs de recherche), et les stats s'affichent côte à côte.

Pour les graphiques comparatifs, plusieurs options s'offrent à vous selon votre niveau de confort :
- un tableau HTML simple avec mise en évidence visuelle du "gagnant" pour chaque stat ;
- une visualisation en barres avec du CSS pur (largeur proportionnelle à la valeur) ;
- une librairie dédiée si vous voulez aller plus loin (Chart.js, par exemple).

> [!TIP]
> Les 6 statistiques de chaque Pokémon (`hp`, `atk`, `def`, `atk_spe`, `def_spe`, `speed`) sont toutes sur la même échelle, ce qui simplifie la comparaison visuelle. Pensez à normaliser l'affichage par rapport au maximum possible (255) pour que les barres soient proportionnelles.

---

### :large_orange_diamond: Bonus 2 : Filtres avancés

**Objectif** : enrichir la recherche de Pokémon avec des critères supplémentaires (stats min/max, type, génération...).

#### Côté API

Faites évoluer votre route de recherche existante (ou créez-en une nouvelle) pour accepter plusieurs critères en `query params`, combinables entre eux :

- stats min/max (par exemple `?hp_min=80&speed_max=50`) ;
- filtrage par type (par exemple `?type=Feu`) ;
- filtrage par génération, si vous avez cette information en base.

> [!IMPORTANT]
> La difficulté principale est de construire une requête Sequelize **dynamique** : tous les paramètres sont optionnels et peuvent être combinés. Une approche courante est de construire progressivement un objet `where` (et un tableau `include`) en ne l'alimentant qu'avec les paramètres effectivement reçus.

> [!TIP]
> Pensez à valider les paramètres reçus avant de les utiliser dans la requête : une valeur `hp_min=abc` ne doit pas faire planter votre API. Réutilisez votre système de validation middleware du Jalon 2.

> [!NOTE]
> La contrainte de 3 caractères minimum et de 20 résultats maximum définie pour la recherche simple du Jalon 4 s'applique-t-elle encore ici ? Prenez une décision explicite et documentez-la : tous les filtres n'impliquent pas forcément une recherche textuelle.

#### Côté front (si vous avez fait le jalon optionnel)

Ajoutez un panneau de filtres à votre liste de Pokémon : sliders ou champs numériques pour les stats, liste déroulante pour les types. Les filtres s'appliquent au fur et à mesure, idéalement sans recharger toute la page à chaque changement.

> [!TIP]
> Pour éviter de multiplier les appels API à chaque frappe ou déplacement de slider, pensez à introduire un léger délai avant de déclencher la requête (technique du "debounce").

---

## Bilan

Bravo d'être arrivé jusqu'ici ! Ces deux bonus vous ont permis d'aller plus loin sur deux aspects importants d'une API professionnelle :

- la **composition de ressources** (agréger et comparer des données à la demande) ;
- la **flexibilité des requêtes** (filtres multi-critères dynamiques, validation des paramètres).

Ce sont des patterns que vous retrouverez dans quasiment tous les projets réels. 🏆