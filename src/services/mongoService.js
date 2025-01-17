// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet de centraliser la logique de traitement des données,
// de faciliter la réutilisation des fonctions
// et de rendre le code plus modulaire et clair. 



const { MongoClient, ObjectId } = require('mongodb');

async function getDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db(process.env.MONGODB_DB_NAME); // Connexion à la base de données
}

async function findOneById(collection, id) {
  try {
    const db = await getDb();
    const document = await db.collection(collection).findOne({ _id: new ObjectId(id) });
    return document;
  } catch (err) {
    console.error('Erreur lors de la recherche par ID:', err);
    throw new Error('Erreur lors de la recherche');
  }
}

async function insertOne(collection, document) {
  try {
    const db = await getDb();
    const result = await db.collection(collection).insertOne(document);
    return result;
  } catch (err) {
    console.error('Erreur lors de l\'ajout du document:', err);
    throw new Error('Erreur lors de l\'ajout');
  }
}

async function updateOneById(collection, id, updateFields) {
  try {
    const db = await getDb();
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return result;
  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    throw new Error('Erreur lors de la mise à jour');
  }
}

async function deleteOneById(collection, id) {
  try {
    const db = await getDb();
    const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    throw new Error('Erreur lors de la suppression');
  }
}

// Exportation des fonctions
module.exports = {
  findOneById,
  insertOne,
  updateOneById,
  deleteOneById
};