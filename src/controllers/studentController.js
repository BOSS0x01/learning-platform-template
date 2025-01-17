const { ObjectId } = require('mongodb');
const db = require('../config/db'); 
const redisService = require('../services/redisService');

// Create a new student
async function createStudent(req, res) {
  try {
    const student = req.body;
    const result = await db.collection('students').insertOne(student);

    // Clear the cache of all students since a new one was added
    await redisService.deleteCache('students');

    res.status(201).json({ message: 'Student created successfully', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error });
  }
}

// Get all students (with Redis caching)
async function getStudents(req, res) {
  try {
    // Check if data is cached in Redis
    const cachedStudents = await redisService.getCache('students');
    if (cachedStudents) {
      return res.status(200).json({ data: cachedStudents, fromCache: true });
    }

    // If not cached, fetch from the database
    const students = await db.collection('students').find().toArray();
    
    // Cache the result in Redis
    await redisService.cacheData('students', students);

    res.status(200).json({ data: students, fromCache: false });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
}

// Get student by ID (with Redis caching)
async function getStudentById(req, res) {
  try {
    const id = req.params.id;

    // Check if data is cached in Redis
    const cachedStudent = await redisService.getCache(`student:${id}`);
    if (cachedStudent) {
      return res.status(200).json({ data: cachedStudent, fromCache: true });
    }

    // If not cached, fetch from the database
    const student = await db.collection('students').findOne({ _id: new ObjectId(id) });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Cache the result in Redis
    await redisService.cacheData(`student:${id}`, student);

    res.status(200).json({ data: student, fromCache: false });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
  }
}

// Update student by ID
async function updateStudent(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;

    // Update student in the database
    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Clear the cached student data from Redis
    await redisService.deleteCache(`student:${id}`);
    // Optionally, clear the cached list of all students
    await redisService.deleteCache('students');

    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
}

// Delete student by ID
async function deleteStudent(req, res) {
  try {
    const id = req.params.id;

    // Delete student from the database
    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Clear the cached student data from Redis
    await redisService.deleteCache(`student:${id}`);
    // Also clear the cached list of students
    await redisService.deleteCache('students');

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
}

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
