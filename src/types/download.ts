export interface FileMeta {
  file_id: string;
  filename: string;
  size_bytes: number;
  content_type: string;
  created_at: string;
}

export interface PreviewMeta {
  preview_available: boolean;
  preview_type: 'video' | 'audio' | 'image' | 'pdf' | 'text' | 'unsupported';
  message?: string;
}