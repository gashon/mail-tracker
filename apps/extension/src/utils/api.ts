import type { EmailMetadata, PixelConfig } from '@mail/extension/types';

export class AnalyticsClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createPixel(metadata: EmailMetadata): Promise<PixelConfig> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pixels`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`Failed to create pixel: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        url: `${this.baseUrl}/api/pixels/${data.pixelId}`,
        id: data.pixelId,
      };
    } catch (error) {
      console.error('Error creating pixel:', error);
      throw error;
    }
  }
}
