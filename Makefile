.PHONY: build up ssl help
.PHONY: build up

build:
	@echo "\033[1;34m[INFO]\033[0m Build de l'image Docker quizify-app:v1..."
	@docker build -t quizify-app:v1 .
	@echo "\033[1;32m[SUCCESS]\033[0m Build terminé !"

up:
	@$(MAKE) build
	@echo "\033[1;34m[INFO]\033[0m Démarrage des services Docker Compose..."
	@docker compose up -d
	@echo "\033[1;32m[SUCCESS]\033[0m Services démarrés en arrière-plan !"

down:
	@echo "\033[1;34m[INFO]\033[0m Arrêt des services Docker Compose..."
	@docker compose down
	@echo "\033[1;32m[SUCCESS]\033[0m Services arrêtés !"

down-v:
	@echo "\033[1;34m[INFO]\033[0m Arrêt des services Docker Compose et suppression des volumes..."
	@docker compose down -v
	@echo "\033[1;32m[SUCCESS]\033[0m Services et volumes arrêtés et supprimés !"

ssl:
	@echo "\033[1;34m[INFO]\033[0m Génération des clés SSL dans ./certs ..."
	@mkdir -p certs
	@openssl req -x509 -nodes -days 365 \
		-newkey rsa:2048 \
		-keyout certs/quizify.local.key \
		-out certs/quizify.local.crt \
		-subj "/C=FR/ST=Paris/L=Paris/O=Quizify/OU=Dev/CN=quizify.local"
	@echo "\033[1;32m[SUCCESS]\033[0m Clés SSL générées !"

help:
	@echo "\033[1;36mCommandes disponibles :\033[0m"
	@echo "  make build      : Build de l'image Docker quizify-app:v1"
	@echo "  make up         : Build et démarre les services Docker Compose"
	@echo "  make down       : Arrête les services Docker Compose"
	@echo "  make down-v     : Arrête les services et supprime les volumes Docker Compose"
	@echo "  make ssl        : Génère les clés SSL dans ./certs"
	@echo "  make help       : Affiche cette aide"