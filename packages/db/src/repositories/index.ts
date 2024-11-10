import { Database } from 'sqlite';
import { EmailMetadata, PixelTrackingRecord } from '@mail/db/types';
import { DatabaseConnection } from '@mail/db/connection';
import { getLogger } from '@mail/db/lib/logger';

const logger = getLogger('pixel-tracking-repository');

export class PixelTrackingRepository {
  private db: Database | null = null;

  private async getConnection(): Promise<Database> {
    if (!this.db) {
      this.db = await DatabaseConnection.getInstance();
    }
    return this.db;
  }

  public async upsert(emailMetadata: EmailMetadata): Promise<string> {
    const db = await this.getConnection();
    const now = Date.now();

    try {
      const { to, subject, timestamp, pixelId } = emailMetadata;
      const toJson = JSON.stringify(to);

      await db.run(
        `INSERT INTO pixel_tracking (
        pixelId, subject, toJson, timestamp, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(pixelId) DO UPDATE SET
        subject = ?,
        toJson = ?,
        timestamp = ?,
        updatedAt = ?`,
        [
          // INSERT values
          pixelId,
          subject,
          toJson,
          timestamp,
          now,
          now,
          // UPDATE values
          subject,
          toJson,
          timestamp,
          now,
        ],
      );

      return pixelId;
    } catch (error) {
      logger.error('Failed to upsert pixel tracking record:', error);
      throw new Error('Failed to upsert pixel tracking record');
    }
  }

  public async insert(emailMetadata: EmailMetadata): Promise<string> {
    const db = await this.getConnection();
    const now = Date.now();

    try {
      const { to, subject, timestamp, pixelId } = emailMetadata;
      const toJson = JSON.stringify(to);

      await db.run(
        `INSERT INTO pixel_tracking (
          pixelId, subject, toJson, timestamp, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [pixelId, subject, toJson, timestamp, now, now],
      );

      return pixelId;
    } catch (error) {
      logger.error('Failed to insert pixel tracking record:', error);
      throw new Error('Failed to insert pixel tracking record');
    }
  }

  public async findByPixelId(
    pixelId: string,
  ): Promise<PixelTrackingRecord | null> {
    const db = await this.getConnection();

    try {
      const record = await db.get<PixelTrackingRecord>(
        'SELECT * FROM pixel_tracking WHERE pixelId = ?',
        [pixelId],
      );

      if (!record) return null;

      return {
        ...record,
        to: JSON.parse(record.toJson),
      };
    } catch (error) {
      logger.error('Failed to find pixel tracking record:', error);
      throw new Error('Failed to find pixel tracking record');
    }
  }

  public async findByTimeRange(
    startTime: number,
    endTime: number,
  ): Promise<PixelTrackingRecord[]> {
    const db = await this.getConnection();

    try {
      const records = await db.all<PixelTrackingRecord[]>(
        `SELECT * FROM pixel_tracking 
         WHERE timestamp BETWEEN ? AND ?
         ORDER BY timestamp DESC`,
        [startTime, endTime],
      );

      return records.map((record) => ({
        ...record,
        to: JSON.parse(record.toJson),
      }));
    } catch (error) {
      logger.error(
        'Failed to find pixel tracking records by time range:',
        error,
      );
      throw new Error('Failed to find pixel tracking records by time range');
    }
  }

  public async delete(pixelId: string): Promise<boolean> {
    const db = await this.getConnection();

    try {
      const result = await db.run(
        'DELETE FROM pixel_tracking WHERE pixelId = ?',
        [pixelId],
      );
      return result.changes > 0;
    } catch (error) {
      logger.error('Failed to delete pixel tracking record:', error);
      throw new Error('Failed to delete pixel tracking record');
    }
  }

  public async countViews(pixelId: string): Promise<number> {
    const db = await this.getConnection();

    try {
      const result = await db.get<{ count: number }>(
        `SELECT COUNT(pv.id) as count
         FROM pixel_tracking pt
         LEFT JOIN pixel_view pv ON pt.pixelId = pv.pixelId
         WHERE pt.pixelId = ?`,
        [pixelId],
      );

      return result?.count || 0;
    } catch (error) {
      logger.error('Failed to count pixel views:', error);
      throw new Error('Failed to count pixel views');
    }
  }

  public async insertView(pixelId: string): Promise<void> {
    const db = await this.getConnection();
    const now = Date.now();

    try {
      // First verify the pixel exists
      const pixelExists = await this.findByPixelId(pixelId);
      if (!pixelExists) {
        throw new Error('Pixel tracking record not found');
      }

      await db.run(
        `INSERT INTO pixel_view (
          pixelId, createdAt, updatedAt
        ) VALUES (?, ?, ?)`,
        [pixelId, now, now],
      );
    } catch (error) {
      logger.error('Failed to insert pixel view:', error);
      throw new Error('Failed to insert pixel view');
    }
  }
}
