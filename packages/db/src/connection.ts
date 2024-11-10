import dotenv from 'dotenv';
dotenv.config();

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { getLogger } from '@mail/db/lib/logger';

const logger = getLogger('database-connection');

console.log('GOT ENV', process.env.DATABASE_PATH);

export class DatabaseConnection {
  private static instance: Database | null = null;
  private static readonly DATABASE_PATH =
    process.env.DATABASE_PATH || ':memory:';

  private constructor() {}

  public static async getInstance(): Promise<Database> {
    if (!DatabaseConnection.instance) {
      try {
        DatabaseConnection.instance = await open({
          filename: DatabaseConnection.DATABASE_PATH,
          driver: sqlite3.Database,
        });

        await DatabaseConnection.initializeTables();
        logger.info('Database connection established successfully');
      } catch (error) {
        logger.error('Failed to establish database connection:', error);
        throw new Error('Database connection failed');
      }
    }
    return DatabaseConnection.instance;
  }

  private static async initializeTables(): Promise<void> {
    const db = DatabaseConnection.instance;
    if (!db) throw new Error('Database instance not initialized');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS pixel_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pixelId TEXT NOT NULL UNIQUE,
        subject TEXT NOT NULL,
        toJson TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pixel_view (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pixelId TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        FOREIGN KEY (pixelId) REFERENCES pixel_tracking(pixelId)
      );
      
      CREATE INDEX IF NOT EXISTS idx_pixel_tracking_pixelId ON pixel_tracking(pixelId);
      CREATE INDEX IF NOT EXISTS idx_pixel_tracking_timestamp ON pixel_tracking(timestamp);

      CREATE INDEX IF NOT EXISTS idx_pixel_view_pixelId ON pixel_view(pixelId);
      CREATE INDEX IF NOT EXISTS idx_pixel_view_createdAt ON pixel_view(createdAt);
      CREATE INDEX IF NOT EXISTS idx_pixel_view_updatedAt ON pixel_view(updatedAt);
    `);
  }
}
