# Correction guidée O'Pokedex

## :three: Jalon 3 : API professionnelle

> [!NOTE]
> L'objectif de ce jalon est de documenter votre API et de mettre en place l'écriture de tests automatisés avec [Jest](https://jestjs.io/fr/), que vous avez croisé en formation. On va se concentrer sur quatre scénarios précis, tous situés dans la couche **Service** mise en place au Jalon 1 et au Jalon 2. C'est là que vivent les règles de gestion qu'on veut "verrouiller" avec des tests.

---

### :large_orange_diamond: Étape 1 : Documentation des routes

Avant d'écrire vos tests, prenez le temps de compléter le fichier endpoints.md fourni avec l'énoncé. Pour chaque route créée aux Jalons 1 et 2, renseignez :

- le verbe HTTP et le chemin
- ce qu'attend la route en entrée (Request : body, paramètre de chemin...) ou - si rien
- ce qu'elle renvoie (Response) et le code HTTP correspondant
- une courte description
- les notes utiles : règles de validation, contraintes métier, authentification requise...


>[!NOTE]
>Si vous êtes à l'aise et souhaitez aller plus loin, vous pouvez explorer des outils dédiés comme Swagger ou JSDoc mais le fichier endpoints.md reste la base attendue.



### :large_orange_diamond: Étape 2 : Mettre en place l'environnement de tests automatisés

#### :small_orange_diamond: Installer Jest

Si ce n'est pas déjà fait, installez Jest et ajoutez un script `test` dans votre `package.json`.

> [!TIP]
> Votre projet est en `"type": "module"` (imports ES6). Vérifiez dans la documentation de Jest comment activer le support ES6 (souvent via une option de ligne de commande ou une variable d'environnement à ajouter à votre script `test`), sinon vos `import` risquent de ne pas être reconnus.

#### :small_orange_diamond: Préparer une base de données de test

> [!CAUTION]
> Vos tests vont créer, modifier et supprimer des données. **Ne lancez jamais vos tests sur votre base de développement** : vous risquez de perdre vos données de seeding ou d'avoir des tests qui échouent à cause de données laissées par un test précédent.

Mettez en place une base de données dédiée aux tests (par exemple `pokedex_test`), avec ses propres informations de connexion (un fichier `.env.test`, ou une variable d'environnement différente selon `NODE_ENV`).

#### :small_orange_diamond: Réinitialiser la base avant les tests

Avant de lancer votre suite de tests (ou avant chaque fichier de test), réinitialisez la base de données à un état connu. Vous pouvez réutiliser votre script de seeding du Jalon 1 (`sync({ force: true })` + `bulkCreate`) dans un hook `beforeAll`.

> [!TIP]
> Pour les scénarios 3 et 4 ci-dessous, vous aurez besoin d'une équipe dont vous connaissez précisément la composition (par exemple une équipe avec exactement 6 Pokemon). Pensez à l'ajouter à votre jeu de données de seeding "de test".

---

### :large_orange_diamond: Étape 3 : Connexion (:warning: message d'erreur identique)

On appelle ici directement la fonction de votre Service de connexion (par exemple `login()` dans `auth.service.js`), comme le ferait votre contrôleur sans passer par une route HTTP.

Écrivez deux tests :

1. Email inexistant : la fonction lève une erreur avec le message `"Email ou mot de passe incorrect"`.
2. Mot de passe incorrect (avec un email existant) : la fonction lève la même erreur, avec le même message.

> [!TIP]
> Pour vérifier qu'une fonction asynchrone lève bien une erreur avec Jest, on utilise la syntaxe `await expect(maFonction(...)).rejects.toThrow("...")`.

> [!IMPORTANT]
> Le but de ces deux tests est de vérifier que le message est identique dans les deux cas. C'est précisément la règle de sécurité que vous avez implémentée au Jalon 2 : un test automatisé garantit qu'elle ne sera pas cassée par une future modification.

<details>
<summary>Un exemple pour démarrer ? 💡</summary>

```javascript
import { login } from '../services/auth.service.js';

describe('login', () => {

  it("lève une erreur si l'email n'existe pas", async () => {
    await expect(login('inexistant@pokemon.com', 'Pikachu123'))
      .rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('lève la même erreur si le mot de passe est incorrect', async () => {
    await expect(login('sacha@pokemon.com', 'mauvais_mdp'))
      .rejects.toThrow('Email ou mot de passe incorrect');
  });

});
```

</details>

---

### :large_orange_diamond: Étape 4 : Inscription réussie (:warning: pas de mot de passe dans le retour)

Appelez votre fonction d'inscription (par exemple `registerUser()` dans `user.service.js`) avec des données valides, et vérifiez que l'objet retourné ne contient pas le mot de passe, même hashé.

> [!TIP]
> `expect(user.password).toBeUndefined()` est la vérification la plus directe. Si votre fonction retourne un objet Sequelize plutôt qu'un objet JS simple, pensez éventuellement à le convertir (`.toJSON()` ou `.get({ plain: true })`) avant de faire cette vérification.

> [!CAUTION]
> Comme ce test crée réellement un utilisateur en base, choisissez un email/username qui n'existe pas déjà dans votre jeu de seeding de test (ou nettoyez après le test), pour ne pas entrer en conflit avec d'autres tests qui s'exécuteraient ensuite.

---

### :large_orange_diamond: Étape 5 : Limite des 6 Pokemons

Appelez votre fonction d'ajout de Pokemon à une équipe (par exemple `addPokemonToTeam()` dans `team.service.js`) sur une équipe qui contient déjà 6 Pokemons, et vérifiez qu'une erreur est levée.

> [!IMPORTANT]
> Pour ce test, partez d'une équipe dont vous savez avant le test qu'elle contient exactement 6 Pokemons (préparée dans votre seeding de test à l'étape 2). Le test n'a pas besoin de remplir l'équipe lui-même : il vérifie juste que le 7ᵉ ajout échoue.

```javascript
import { addPokemonToTeam } from '../services/team.service.js';

it('refuse d\'ajouter un 7e Pokemon à une équipe pleine', async () => {
  await expect(addPokemonToTeam(idEquipePleine, idAutrePokemon))
    .rejects.toThrow(); // ou .toThrow("message précis") si vous voulez être plus strict
});
```

---

### :large_orange_diamond: Étape 6 : Unicité d'un Pokemon dans une équipe

Même principe que l'étape 5, mais cette fois on tente d'ajouter un Pokemon déjà présent dans l'équipe, et on vérifie qu'une erreur est levée.

> [!TIP]
> Vous pouvez réutiliser la même équipe que pour l'étape 5 (ou une autre, moins remplie) : l'important est de connaître à l'avance un Pokemon qui s'y trouve déjà, pour tenter de l'ajouter une seconde fois.

---

## Pour aller plus loin (facultatif)

Si vous voulez continuer à vous entraîner avec Jest, vous pouvez par exemple ajouter :

- un test de succès pour l'ajout d'un Pokemon (équipe non pleine, Pokemon pas encore présent → l'ajout réussit et l'équipe contient un Pokemon de plus) ;
- un test de retrait d'un Pokemon d'une équipe.

---

## Bilan du jalon

À ce stade, une petite suite de tests automatisés couvre les règles de gestion les plus sensibles de votre application :

- la confidentialité du mot de passe à l'inscription ;
- la non-divulgation d'information à la connexion (email inexistant vs mot de passe incorrect) ;
- les deux règles de composition d'équipe (limite de 6, unicité).

Cette suite peut être relancée à tout moment pour s'assurer que ces règles n'ont pas été cassées par une évolution.

Bravo, et bonne continuation ! 🍀