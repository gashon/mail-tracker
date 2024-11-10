export interface EmailMetadata {
  to: string[];
  subject: string;
  timestamp: number;
  pixelId: string;
}

export interface PixelConfig {
  url: string;
  id: string;
}
