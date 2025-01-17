// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Pour centraliser la gestion des connexions et faciliter la maintenance.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse :  En utilisant des gestionnaires ou des hooks pour fermer après usage.

const { MongoClient } = require('mongodb');
const { createClient } = require('redis');

const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;


async function connectMongo() {
  config.validateEnv();
    try {
        const mongoUri = config.mongodb.uri;
        const dbName = config.mongodb.dbName;
        mongoClient = new MongoClient(mongoUri);

        await mongoClient.connect();
        console.log('MongoDB connected successfully');

        // Access the database
        const db = mongoClient.db(dbName);
        console.log(`Using database: ${db.databaseName}`);

        // Return the database object
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process in case of critical error
    }
}


/**
 * Connexion à Redis
 */
async function connectRedis() {
  config.validateEnv();
    try {
        const client = createClient({
            url: config.redis.uri // Directly using the Redis URI
        });

        client.on('error', err => console.error('Redis Client Error', err));

        await client.connect();
        console.log('Connected to Redis!');
        redisClient = client;

        return client;
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        throw err;
    }
}


async function closeConnections() {
    if (mongoClient) {
        await mongoClient.close();
        console.log('MongoDB connection closed.');
    }
    if (redisClient) {
        await redisClient.quit();
        console.log('Redis connection closed.');
    }
}


// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  db, 
  mongoClient,
  redisClient,
};