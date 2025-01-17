// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : Utilisez des clés uniques avec des préfixes pour organiser les données. Appliquez un TTL pour gérer leur durée de vie et purger les données obsolètes.
// Question : Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Utilisez des préfixes, des clés uniques, des tailles appropriées, et définissez un TTL pour éviter une accumulation de données inutiles.

const { connectRedis, closeConnections, redisClient } = require('../config/db');


async function getCache(key) {
  try {
    
    const value = await redisClient.get(key);
    if (value) {
      return JSON.parse(value);  
    }
    return null; 
  } catch (err) {
    console.error('Error getting cache data:', err);
    throw new Error('Failed to retrieve cache data');
  }
}

async function cacheData(key, data, ttl = 3600) {  
  try {
    const value = JSON.stringify(data);  
    await redisClient.setEx(key, ttl, value); 
    console.log(`Cached data under key: ${key}`);
  } catch (err) {
    console.error('Error caching data:', err);
    throw new Error('Failed to cache data');
  }
}

// Fonction pour supprimer une clé du cache
async function deleteCache(key) {
  try {
    await redisClient.del(key);
    console.log(`Deleted cache key: ${key}`);
  } catch (err) {
    console.error('Error deleting cache key:', err);
    throw new Error('Failed to delete cache data');
  }
}

// Export des fonctions utilitaires
module.exports = {
  getCache,
  cacheData,
  deleteCache
};
