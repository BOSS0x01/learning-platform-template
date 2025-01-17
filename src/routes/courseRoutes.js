// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Pour améliorer la lisibilité, faciliter la maintenance, et permettre une meilleure organisation du code en divisant les responsabilités.
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Grouper les routes par ressource (ex. utilisateurs, cours) et utiliser des conventions REST pour les noms d’actions.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.get('/stats', courseController.getCourseStats);

module.exports = router;