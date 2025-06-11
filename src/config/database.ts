import { ConnectionPool, config } from 'mssql';

const dbConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true, // For local dev
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const pool = new ConnectionPool(dbConfig);

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to MSSQL database');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

export { pool };
