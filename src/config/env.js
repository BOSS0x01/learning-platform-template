// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Pour garantir que l'application dispose des configurations nécessaires, évitant erreurs ou pannes imprévues.
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : L'application échoue au démarrage ou fonctionne de manière incorrecte, nécessitant un arrêt immédiat avec un message d'erreur clair.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Variable d'environnement manquante : ${envVar}`);
    }
  });
}

module.exports = {
  validateEnv,
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};