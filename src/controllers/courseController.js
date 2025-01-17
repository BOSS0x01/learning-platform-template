// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    const { title, description, instructorId } = req.body;

    if (!title || !description || !instructorId) {
      return res.status(400).json({ message: 'Title, description, and instructorId are required.' });
    }

    // Check if the instructor exists in the database
    const instructor = await mongoService.findOneById(db.collection('users'), instructorId);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found.' });
    }

    // Create the course object
    const newCourse = {
      title,
      description,
      instructorId: new ObjectId(instructorId),
      createdAt: new Date(),
    };

    // Insert the course into the database
    const result = await db.collection('courses').insertOne(newCourse);

    if (!result.acknowledged) {
      return res.status(500).json({ message: 'Failed to create course.' });
    }

    // Cache the newly created course
    const cacheKey = `course:${result.insertedId}`;
    await redisService.cacheData(cacheKey, newCourse);

    res.status(201).json({ message: 'Course created successfully.', courseId: result.insertedId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function getCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Check Redis cache first
    const cachedCourse = await redisService.getCache(`course:${id}`);
    if (cachedCourse) {
      return res.status(200).json({ message: 'Course retrieved from cache.', course: cachedCourse });
    }

    // Fetch from MongoDB if not cached
    const course = await mongoService.findOneById(db.collection('courses'), id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Cache the course in Redis
    await redisService.cacheData(`course:${id}`, course);

    res.status(200).json({ message: 'Course retrieved.', course });
  } catch (error) {
    console.error('Error retrieving course:', error);
    res.status(500).json({ message: 'Failed to retrieve course.' });
  }
}

// Get course stats (e.g., total count)
async function getCourseStats(req, res) {
  try {
    const stats = await db.collection('courses').countDocuments();
    res.status(200).json({ message: 'Course stats retrieved.', totalCourses: stats });
  } catch (error) {
    console.error('Error retrieving course stats:', error);
    res.status(500).json({ message: 'Failed to retrieve course stats.' });
  }
}

// Export the controller functions
module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
};