# Correction guidée O'Pokedex

## :six: Jalon optionnel 2 : Docker

> [!NOTE]
> L'objectif de ce jalon est de **conteneuriser votre application** avec Docker, pour qu'elle puisse tourner de manière identique sur n'importe quelle machine, sans dépendre d'une installation locale de Node ou de PostgreSQL. Vous pouvez conteneuriser le back seul ou le front aussi, si vous l'avez fait.

---

### :large_orange_diamond: Étape 1 : Conteneuriser le back

#### :small_orange_diamond: Créer le `Dockerfile` de l'API

À la racine du dossier `api/`, créez un `Dockerfile`. Il doit :

1. partir d'une image Node officielle (choisissez une version LTS) ;
2. définir le dossier de travail dans le conteneur ;
3. copier `package.json` et `package-lock.json`, puis lancer `npm install` ;
4. copier le reste du code source ;
5. exposer le port utilisé par votre serveur Express ;
6. démarrer l'application.

> [!TIP]
> Copiez `package.json` et installez les dépendances **avant** de copier le reste du code. Ainsi, Docker met en cache la couche `npm install` et ne la rejoue pas à chaque modification de votre code source. Vos builds seront beaucoup plus rapides.

> [!IMPORTANT]
> En production (ou dans un conteneur), on n'installe pas les `devDependencies`. Pensez à utiliser `npm install --omit=dev`, ou à vérifier que vos outils de développement (nodemon, jest...) sont bien dans `devDependencies` et non dans `dependencies`.

#### :small_orange_diamond: Créer le `.dockerignore`

Comme le `.gitignore`, il empêche de copier des fichiers inutiles (ou sensibles) dans l'image. Ajoutez-y au minimum :

```
node_modules/
.env
```

> [!CAUTION]
> Le fichier `.env` ne doit **jamais** se retrouver dans une image Docker : il contient vos secrets (JWT, mots de passe de base de données...). On verra à l'étape suivante comment passer ces variables autrement.

---

### :large_orange_diamond: Étape 2 : Orchestrer avec `docker-compose`

Plutôt que de lancer les conteneurs un par un, `docker-compose` permet de décrire et démarrer l'ensemble de vos services en une seule commande.

Créez un fichier `docker-compose.yml` à la **racine du projet** (au même niveau que `api/` et `client/`). Il doit décrire au minimum deux services :

- **`db`** : un conteneur PostgreSQL (image officielle `postgres`), avec les variables d'environnement nécessaires (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) et un **volume** pour persister les données entre les redémarrages.
- **`api`** : votre back, construit à partir du `Dockerfile` créé à l'étape 1, avec les variables d'environnement de l'application passées via `environment` (ou un fichier `env_file`).

> [!IMPORTANT]
> Votre API a besoin que la base de données soit prête avant de démarrer. Utilisez l'option `depends_on` pour exprimer cette dépendance mais gardez en tête que `depends_on` attend seulement que le conteneur `db` soit démarré, pas que PostgreSQL soit prêt à accepter des connexions. Pour aller plus loin, vous pouvez explorer l'option `healthcheck`.

> [!TIP]
> Pour les variables d'environnement sensibles, deux approches courantes avec docker-compose :
> - les déclarer directement sous `environment:` (pratique, mais visible dans le fichier) ;
> - utiliser `env_file: .env` pour pointer vers votre fichier `.env` existant (plus propre, et cohérent avec ce que vous faites déjà en développement).
>
> Dans tous les cas, ne commitez jamais vos secrets dans votre dépôt !

<details>
<summary>Structure minimale d'un docker-compose.yml pour ce projet 💡</summary>

```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_USER: admin_pokedex
      POSTGRES_PASSWORD: pokedex
      POSTGRES_DB: pokedex
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./api
    ports:
      - "3001:3001"
    environment:
      PG_URL: postgres://admin_pokedex:pokedex@db:5432/pokedex
      JWT_SECRET: votre_secret
      PORT: 3001
    depends_on:
      - db

volumes:
  postgres_data:
```

> Notez que dans `PG_URL`, l'hôte n'est plus `localhost` mais **`db`** : c'est le nom du service défini dans `docker-compose.yml`. Docker crée automatiquement un réseau entre les services, et chaque service est accessible par son nom.

</details>

> [!IMPORTANT]
> C'est un point classique de confusion : à l'intérieur du réseau Docker, votre API ne joint plus PostgreSQL via `localhost` mais via le **nom du service** `db`. Pensez à adapter votre `PG_URL` en conséquence (soit directement dans `docker-compose.yml`, soit dans un `.env` dédié à Docker).

---

### :large_orange_diamond: Étape 3 : Lancer et tester

```bash
# Construire les images et démarrer les conteneurs
docker-compose up --build

# En arrière-plan
docker-compose up --build -d

# Voir les logs d'un service en particulier
docker-compose logs api

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (repart de zéro pour la BDD)
docker-compose down -v
```

> [!TIP]
> Au premier démarrage, votre base de données est vide, vos tables n'existent pas encore. Vous avez deux options :
> - lancer votre script de seeding manuellement depuis le conteneur (`docker-compose exec api node data/db-seed.js`) ;
> - ou ajouter une commande de démarrage dans votre `Dockerfile`/`docker-compose.yml` qui exécute le seeding automatiquement au lancement (attention à ne le faire qu'une seule fois !).

Vérifiez que votre API répond bien en testant vos routes depuis votre fichier `tests.http`  en remplaçant simplement `localhost` par `localhost` (le port est mappé, ça ne change pas de ce côté).

---

### :large_orange_diamond: Étape 4 (si vous avez fait le front) : Conteneuriser le front

#### :small_orange_diamond: Créer le `Dockerfile` du front

Le front est constitué de fichiers statiques (HTML, CSS, JS). L'approche la plus simple est de les servir via un serveur HTTP léger, comme **nginx** (image officielle très légère).

Créez un `Dockerfile` dans le dossier `client/` qui :

1. part de l'image `nginx:alpine` ;
2. copie vos fichiers statiques dans le dossier que nginx sert par défaut (`/usr/share/nginx/html`).

> [!TIP]
> Pas de `npm install` ici : votre front est en JavaScript vanilla, il n'y a pas de dépendances à installer ni de build à lancer. Le `Dockerfile` est donc très court.

#### :small_orange_diamond: Ajouter le front au `docker-compose.yml`

Ajoutez un troisième service `front` dans votre `docker-compose.yml`, construit depuis `./client`, avec un mapping de port (par exemple `8080:80`).

> [!IMPORTANT]
> Une fois le front dans un conteneur, il ne peut plus appeler votre API via `http://localhost:3001` : `localhost` fait référence à l'intérieur du conteneur nginx, pas à votre machine. Deux solutions courantes :
> - configurer l'URL de l'API comme une **variable** dans le front, et la passer au moment du build ou au démarrage (plus propre, mais demande un peu plus de configuration nginx) ;
> - utiliser le nom du service Docker (`http://api:3001`) si le front et le back sont sur le même réseau Docker, ce qui est le cas avec `docker-compose`.

---

## Bilan du jalon

À ce stade, votre application tourne dans des conteneurs Docker reproductibles :

- la base de données PostgreSQL dans un conteneur dédié, avec ses données persistées dans un volume ;
- l'API Express dans un conteneur séparé, configuré via des variables d'environnement ;
- *(bonus)* le front servi par nginx dans un troisième conteneur.

Le tout se lance en une seule commande (`docker-compose up --build`) depuis n'importe quelle machine ayant Docker installé, sans avoir besoin de Node ni de PostgreSQL en local.

Bravo pour avoir été jusqu'au bout ! 🎉