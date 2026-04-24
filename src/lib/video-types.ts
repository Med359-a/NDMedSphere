export type VideoItem = {
  id: string;
  title: string;
  description: string;
  mediaType: "youtube" | "video" | "image";
  youtubeUrl?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
};

