import type { EmailMetadata } from '@mail/extension/types';

export interface PixelTrackingRecord extends EmailMetadata {
  id: number;
  createdAt: number;
  updatedAt: number;
  toJson: string; // Stored as JSON string since SQLite doesn't support arrays
}

export type EmailMetadata = EmailMetadata;
