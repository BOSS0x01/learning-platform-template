# Projet de fin de module NoSQL

### Reponses aux questions :

1. .env
   Question: Quelles sont les informations sensibles à ne jamais commiter ?
   Réponse : Clés API et les configurations des bases de données
   Question: Pourquoi utiliser des variables d'environnement ?
   Réponse : .env contient des informations sensibles, telles que les données de connexion, et n'est pas soumis à GitHub.
2. env.js
   Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
   Réponse : Pour garantir que l'application dispose des configurations nécessaires, évitant erreurs ou pannes imprévues.
   Question: Que se passe-t-il si une variable requise est manquante ?
   Réponse : L'application échoue au démarrage ou fonctionne de manière incorrecte, nécessitant un arrêt immédiat avec un message d'erreur clair.

3. db.js
   Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
   Réponse : Pour centraliser la gestion des connexions et faciliter la maintenance.
   Question : Comment gérer proprement la fermeture des connexions ?
   Réponse : En utilisant des gestionnaires ou des hooks pour fermer après usage.

4. mongoService.js
   Question: Pourquoi créer des services séparés ?
   Réponse: Créer des services séparés permet de centraliser la logique de traitement des données,
   de faciliter la réutilisation des fonctions
   et de rendre le code plus modulaire et clair.
