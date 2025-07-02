#!/bin/sh

# Healthcheck pour le front : vérifie que le serveur répond sur le port 3000

if curl -f http://localhost:3000 > /dev/null 2>&1; then
  exit 0
else
  exit 1
fi