# Feuille de route (roadmap)

Le développement de ce projet se découpe en plusieurs jalons. L'idée est d'aller aussi loin que possible mais garde à l'esprit qu'il vaut mieux "peu et bien" que "beaucoup et trop vite". Les jalons optionnels sont à faire dans l'ordre que tu veux.

Jalon 1 - MVP  
Jalon 2 - API sécurisée : authentification et validation  
Jalon 3 - API professionnelle : documentation et tests  
Jalon 4 - fonctionnalités avancées : recherche et favoris  
Jalon 5 (optionnel) : front et consommation d'API  
Jalon 6 (optionnel) : Docker  
Jalon 7 (optionnel) : fonctionnalités supplémentaires  

## Remarque importante : charte de nommage

Avant de commencer, établir une charte de nommage pour le projet et la respecter tout au long du développement. Cela inclut :

- Nommage des variables, fonctions, classes (camelCase, PascalCase, snake_case)
- Nommage des routes et endpoints (conventions RESTful)
- Nommage des branches Git
- Nommage des commits
- Nommage des tables et colonnes en base de données

Tu choisis la convention que tu veux adopter. L'important, c'est de s'y tenir.

---

## Jalon 1 - MVP (Minimum Viable Product)

**Objectif** : Construire les fondations de l'API avec le CRUD complet de l'entité `team` (équipe) et les fonctionnalités de base de gestion des équipes. Ainsi que la liste des Pokémons.

| En tant que | je souhaite pouvoir                        | afin de                               |
| ----------- | ------------------------------------------ | ------------------------------------- |
| visiteur    | consulter la liste des équipes             | voir ce qui existe                    |
| visiteur    | consulter les détails d'une équipe         | connaître sa composition              |
| visiteur    | créer une équipe                           | l'administrer                         |
| visiteur    | modifier le nom d'une équipe               | l'administrer                         |
| visiteur    | ajouter un Pokémon à une équipe            | l'administrer                         |  
| visiteur    | retirer un Pokémon d'une équipe            | l'administrer                         |
| visiteur    | supprimer une équipe                       | l'administrer                         |
| visiteur    | consulter la liste des Pokémons            | en choisir un                         |
| visiteur    | consulter les détails d'un Pokémon         | connaître ses caractéristiques        |
        

### Contraintes du Jalon 1

- **Limite des équipes** : Une équipe peut contenir 6 Pokémons au maximum
- **Unicité** : Un même Pokémon ne peut apparaître qu'une seule fois dans une équipe
- **Gestion de la limite** : Cette limite doit être vérifiée dans une couche Service, pas seulement au niveau du Controller
- **Messages de confirmation** : Renvoyer un message de confirmation lors de la suppression d'une équipe

---

## Jalon 2 - API sécurisée

**Objectif** : Ajouter l'authentification et les validations strictes.

### Authentification et autorisation

Mettre en place un système de connexion afin d'offrir à l'utilisateur la possibilité de rendre privé certaines informations. Une fois cette étape accomplie, la possibilité de créer et modifier des équipes pourra être réservée aux utilisateurs et interdite aux simples visiteurs.

| En tant que | je souhaite pouvoir                        | afin de                                  |
| ----------- | ------------------------------------------ | ---------------------------------------- |
| visiteur    | accéder à une page d'inscription           | me créer un compte utilisateur           |
| utilisateur | me connecter à l'application               | profiter des fonctionnalités des membres |
| utilisateur | administrer mes propres équipes            | les modifier                             |
| utilisateur | me déconnecter                             | fermer ma session  

### Validations obligatoires

Toutes les entrées utilisateur doivent être validées strictement :

**À la création/modification d'utilisateur** :
- `username` : entre 3 et 20 caractères, obligatoire, unique, pas de caractères spéciaux
- `password` : minimum 8 caractères, obligatoire, doit contenir majuscules, minuscules et chiffres

**À la connexion** :
- Messages d'erreur flous (par sécurité : "Email ou mot de passe incorrect" au lieu de préciser si l'email existe)
- Sensibilité à la casse pour le mot de passe

**À la création/modification d'équipe** :
- `nom` : obligatoire, entre 1 et 50 caractères, sensible à la casse
---


## Jalon 3 - API professionnelle : documentation et tests

### Documentation

Toute API se doit d'être documentée. A cet effet, vous avez à disposition un doc `endpoint.md` dans lequel on vous demande de documenter toutes vos routes.
Si vous êtes tentés par autre chose de plus avancé, vous pouvez explorer des outils dédiés : JSDoc ou Swagger

### Tests

Écrire des tests automatisés pour les scénarios suivants :

1. **Connexion : message d'erreur identique**
   - email inexistant : erreur "Email ou mot de passe incorrect"
   - mot de passe incorrect : même erreur, même message

2. **Inscription réussie : pas de mot de passe dans le retour**
   - on vérifie que les données renvoyées à la création du compte ne contiennent pas le mot de passe

3. **Limite des 6 Pokemons**
   - ajouter un 7e Pokemon à une équipe qui en a déjà 6 déclenche une erreur

4. **Unicité d'un Pokemon dans une équipe**
   - si le Pokemon qu'on veut ajouter est déjà dans l'équipe, cela déclenche une erreur

Tu peux bien sûr ajouter tous les tests que tu jugeras utile de faire


---

## Jalon 4 - fonctionnalités avancées : recherche et favoris

**Objectif** : Ajouter des fonctionnalités avancées rendant l'API plus réaliste et professionnelle, des favoris, un système de recherche et des scores par équipe.

### Recherche

Le visiteur doit pouvoir faire une recherche de Pokémon, suivant le nom mais aussi le type. 

| En tant que | je souhaite pouvoir              | afin de                                |
| ----------- | -------------------------------- | -------------------------------------- |
| visiteur    | rechercher un Pokémon par nom    | le retrouver facilement                |
| visiteur    | rechercher par type              | filtrer ma recherche                   |

**Contraintes**:
- La recherche doit être insensible à la casse.
- La recherche doit pouvoir fonctionner avec une correspondance partielle. 
- L'utilisateur doit entrer au moins trois caractères pour lancer une recherche.
- Une recherche renvoie maximum 20 résultats.

### Favoris

Donner la possibilité à l'utilisateur d'enregistrer en favoris un Pokémon. Les visiteurs peuvent voir le nombre d'enregistrement par Pokémon, ce qui permet de faire un classement des Pokémons les plus appréciés.

| En tant que | je souhaite pouvoir                 | afin de                                            |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| utilisateur | ajouter un Pokémon dans mes favoris               | le retrouver rapidement                |
| utilisateur | enlever un Pokémon de mes favoris    | changer d'avis                                     |
| utilisateur    | lister mes Pokémons favoris | les consulter                |
| visiteur    | voir combien de fois un Pokémon a été ajouté en favori par tous les utilisateurs    |  l'intérêt général de ce Pokémon           |
| Bonus : visiteur | trier les Pokémons par nombre d'ajout en favoris | voir les 10 Pokémons les plus populaires |

**Contrainte** :
- Un utilisateur connecté ne peut ajouter qu'une seule fois un Pokémon en favori


### Équipes publiques/privées

Lors de la création ou la modification d'une équipe, donner la possibilité à l'utilisateur de la rendre publique (visible par tous) ou privée (visible par lui seul).

| En tant que | je souhaite pouvoir                        | afin de                               |
| ----------- | ------------------------------------------ | ------------------------------------- |
| utilisateur | rendre mon équipe publique ou privée       | contrôler qui peut la voir             |
| visiteur    | consulter les équipes publiques   | les connaître        |
| utilisateur | voir que mes équipes privées ne sont visibles que par moi | protéger ma stratégie     |

**Contraintes** :
- Les équipes privées ne sont visibles que par leur propriétaire
- Les équipes publiques sont visibles par tous
- Seul un utilisateur connecté peut créer une équipe

### Score des équipes

Lors de l'affichage de la liste de toutes les équipes publiques (ou ses propres équipes privées), afficher un score pour chaque équipe pour donner une idée de sa puissance. Les critères de calcul et le calcul sont libres (total, moyenne...). Le principal est que toutes les équipes aient un score calculé de la même manière.

| En tant que | je souhaite pouvoir                   | afin de                            |
| ----------- | ------------------------------------- | ---------------------------------- |
| utilisateur | voir le score global de mon équipe    | évaluer sa puissance globale       |

**Contrainte** : 
- Le score doit être calculé automatiquement en fonction des stats des Pokémons composant l'équipe (algorithme à définir : somme, moyenne, etc.)

---

## Jalon 5 (optionnel) : front et consommation d'API externe

**Objectif** : Mise en place d'un front pour consommer l'API comme un utilisateur normal dans un navigateur.

### Front

Les clients API c'est bien gentil, mais on peut avoir besoin ou envie de visualiser ce que renvoie notre API dans un navigateur. Tu peux donc mettre en place le front qui correspond à ton API. Pour gagner du temps, tu pourras partir des éléments proposés dans le dossier `integration` ou partir de 0 si tu préfères. Inutile de passer beaucoup de temps à soigner les détails, l'objectif est toujours de pratiquer le back !


### Images

Les images des Pokémons sont disponibles dans le même dossier mais si tu le souhaites, tu peux aller les chercher dans une API externe. C'est une occasion de pratiquer. Il en existe beaucoup sur le thème des Pokémons, à toi de découvrir leur documentation et mettre en place celle qui te paraîtra la plus adaptée.

--- 

## Jalon 6 (optionnel) : Docker 

**Objectif** : on met en place des conteneurs docker pour notre application, backet front (si vous l'avez fait). 

On a tout dit, il reste à faire le grand saut !

--- 

## Jalon 7 (optionnel) : fonctionnalités supplémentaires

- **Comparaison avancée de Pokémons** : Comparer 2 Pokémons côte à côte avec graphiques comparatifs
- **Filtres avancés** : Recherche multi-critères (stats min/max, type, génération, etc.)


---

## Résumé des points clés à retenir

**Charte de nommage** : La définir et la respecter dès le départ  
**Validation stricte** : Toutes les entrées utilisateur doivent être validées  
**Service layer** : La logique métier (comme la limite de 6 Pokémons) doit être au niveau des services  
**Tests** : Couvrir les scénarios critiques  
**Git** : Committer régulièrement, avec des messages clairs respectant la charte de nommage

Bonne chance ! 🍀
