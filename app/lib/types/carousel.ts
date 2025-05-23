export interface Slide {
  id: string;
  text: string;
  imageUrl?: string;
  order: number;
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
  status: 'draft' | 'published';
  tags?: string[];
} 