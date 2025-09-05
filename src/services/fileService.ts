import { FileMeta, PreviewMeta } from '@/types/download';

class FileService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/files`;

  async getFileMeta(fileId: string): Promise<FileMeta> {
    try {
      // In a real app, this would be a fetch call:
      // const response = await fetch(`${this.API_URL}/meta/${fileId}`);
      // if (!response.ok) throw new Error('File not found');
      // return await response.json();
      
      // Mock implementation
      await new Promise(res => setTimeout(res, 500));
      const mockMeta: Record<string, FileMeta> = {
        'video-id': { file_id: 'video-id', filename: 'DirectDriveX_Promo_Final.mp4', size_bytes: 28345678, content_type: 'video/mp4', created_at: new Date().toISOString() },
        'image-id': { file_id: 'image-id', filename: 'Company_Logo_Design.png', size_bytes: 125890, content_type: 'image/png', created_at: new Date().toISOString() },
        'audio-id': { file_id: 'audio-id', filename: 'Podcast_Episode_01.mp3', size_bytes: 45000000, content_type: 'audio/mpeg', created_at: new Date().toISOString() },
        'pdf-id': { file_id: 'pdf-id', filename: 'Q3_Financial_Report.pdf', size_bytes: 2345678, content_type: 'application/pdf', created_at: new Date().toISOString() },
        'text-id': { file_id: 'text-id', filename: 'release_notes.txt', size_bytes: 12345, content_type: 'text/plain', created_at: new Date().toISOString() },
        'unsupported-id': { file_id: 'unsupported-id', filename: 'Project_Archive.zip', size_bytes: 123456789, content_type: 'application/zip', created_at: new Date().toISOString() },
      };
      if (mockMeta[fileId]) return mockMeta[fileId];
      throw new Error('File not found');
    } catch (error) {
      console.error("Error fetching file metadata:", error);
      throw error;
    }
  }

  async getPreviewMeta(fileId: string): Promise<PreviewMeta> {
    try {
      // Mock implementation
      await new Promise(res => setTimeout(res, 300));
      const mockPreviewMeta: Record<string, PreviewMeta> = {
        'video-id': { preview_available: true, preview_type: 'video' },
        'image-id': { preview_available: true, preview_type: 'image' },
        'audio-id': { preview_available: true, preview_type: 'audio' },
        'pdf-id': { preview_available: true, preview_type: 'pdf' },
        'text-id': { preview_available: true, preview_type: 'text' },
        'unsupported-id': { preview_available: false, preview_type: 'unsupported', message: 'Preview is not available for .zip files.' },
      };
      if (mockPreviewMeta[fileId]) return mockPreviewMeta[fileId];
      return { preview_available: false, preview_type: 'unsupported', message: 'This file type cannot be previewed.' };
    } catch (error) {
      console.error("Error fetching preview metadata:", error);
      throw error;
    }
  }

  getDownloadUrl(fileId: string): string {
    return `${this.API_URL}/download/${fileId}`;
  }

  getPreviewStreamUrl(fileId: string): string {
    // Using a placeholder for mock previews
    const mockUrls: Record<string, string> = {
        'video-id': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'image-id': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
        'audio-id': 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
        'pdf-id': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        'text-id': 'data:text/plain;charset=utf-8,This%20is%20a%20sample%20text%20file%20for%20preview.',
    };
    return mockUrls[fileId] || '';
  }
}

export const fileService = new FileService();