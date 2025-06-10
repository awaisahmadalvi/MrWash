import { pool } from '../config/database';

async function runMigration() {
  try {
    await pool.connect();

    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
      BEGIN
          CREATE TABLE Users (
              id INT IDENTITY(1,1) PRIMARY KEY,
              name NVARCHAR(100) NOT NULL,
              email NVARCHAR(100) NOT NULL UNIQUE,
              createdAt DATETIME DEFAULT GETDATE(),
              updatedAt DATETIME DEFAULT GETDATE()
          );
      END
    `;

    await pool.request().query(createTableQuery);
    console.log('Users table created successfully');

    // Optional: Seed initial data
    const seedDataQuery = `
      IF NOT EXISTS (SELECT 1 FROM Users)
      BEGIN
          INSERT INTO Users (name, email)
          VALUES 
              ('John Doe', 'john.doe@example.com'),
              ('Jane Smith', 'jane.smith@example.com'),
              ('Bob Johnson', 'bob.johnson@example.com');
      END
    `;

    await pool.request().query(seedDataQuery);
    console.log('Sample users inserted successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.close();
  }
}

runMigration();
