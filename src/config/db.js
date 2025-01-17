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
    try {
        const mongoUri = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME;
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
try {
        const client = createClient({
            username: process.env.REDIS_USERNAME, // e.g., 'default'
            password: process.env.REDIS_PASSWORD, // e.g., 'i7xK5cWG9EmORxZzoP7PX8xRx5LKhDVL'
            socket: {
                host: process.env.REDIS_HOST,      // e.g., 'redis-10486.c99.us-east-1-4.ec2.redns.redis-cloud.com'
                port: parseInt(process.env.REDIS_PORT, 10), // e.g., 10486
            }
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