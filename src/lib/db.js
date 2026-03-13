import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your .env file");
}

// This creates the connection to your Neon database in Frankfurt
const sql = neon(process.env.DATABASE_URL);

export default sql;