export interface Slide {
  id: string;
  text?: string;
  imageUrl?: string;
  caption?: string;
  order: number;
  croppedArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Carousel {
  id: string;
  userId: string;
  title: string;
  description?: string;
  slides: Slide[];
  createdAt: string | Date;
  updatedAt: string | Date;
  isPublished: boolean;
  status?: 'draft' | 'published';
  tags?: string[];
  type?: 'text-carousel' | 'image-carousel';
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'story';
} 