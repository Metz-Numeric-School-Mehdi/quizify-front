FROM oven/bun:1 AS base

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (ou similaires)
COPY package*.json ./

# Installer les dépendances avec Bun
RUN bun install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Installer curl pour le healthcheck
RUN apt-get update && apt-get install -y curl

# Build le projet
RUN bun run build

# Copier le script de vérification de santé dans le conteneur
COPY healthcheck.sh /usr/local/bin/healthcheck.sh

# Rendre le script healthcheck exécutable
RUN chmod +x /usr/local/bin/healthcheck.sh

# Démarrer le serveur avec Bun
CMD ["bun", "run", ".output/server/index.mjs"]