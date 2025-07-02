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