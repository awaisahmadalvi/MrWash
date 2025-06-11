// server.ts
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { connectToDatabase, pool } from './config/database'; // Assuming 'database' is in 'config' folder now

const PORT = process.env.PORT || 3000;

// Use an async IIFE (Immediately Invoked Function Expression) or a main function
// to handle the async database connection before starting the server.
const startServer = async () => {
  try {
    // Await the database connection
    await connectToDatabase();
    console.log('Database connected successfully. Starting server...');

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle shutdown gracefully
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        try {
          await pool.close();
          console.log('Server closed. Database connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database pool during shutdown:', err);
          process.exit(1); // Exit with an error code if pool close fails
        }
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(async () => {
        try {
          await pool.close();
          console.log('Server closed. Database connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing database pool during shutdown:', err);
          process.exit(1); // Exit with an error code if pool close fails
        }
      });
    });
  } catch (error) {
    console.error(
      'Failed to connect to the database or start the server:',
      error
    );
    process.exit(1); // Exit if database connection fails
  }
};

startServer(); // Call the async function to start the process
