# Installation

```bash
# Cloner le projet
git clone REPO_SSH_URL

# Se déplacer dans le projet
cd REPO_NAME

# Ouvrir le projet dans VSCode
code .

cd api
npm init -y

# Installer les dépendances nécessaire au back
npm install [A DEFINIR]

```

## Mise en place de la base de données

```bash
# Se connecter à son client Postgres
sudo -i -u postgres psql

# Créer un utilisateur de base de données
CREATE USER pokedex WITH LOGIN PASSWORD 'pokedex';

# Créer une base de données 
CREATE DATABASE pokedex WITH OWNER pokedex;

# Quitter psql
exit
```

## Mise en place de l'environnement de développement

N'oubliez pas de créer votre .env et un .env.example 😉
