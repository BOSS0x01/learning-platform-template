// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
const express = require('express');
const config = require('./config/env'); // Application config
const { connect, closeConnections } = require('./config/db'); // Import database connection logic
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = config.port || 3000;

async function startServer() {
  try {
    // Initialize database connections
    console.log('Initializing database connections...');
    await connect();
    console.log('Database connections established.');

    // Configure middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mount routes
    app.use('/api/courses', courseRoutes);
    app.use('/api/students', studentRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  try {
    await closeConnections(); // Close database connections
    console.log('Server shutdown complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();