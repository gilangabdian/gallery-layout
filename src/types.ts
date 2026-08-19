export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}

export type GallerySize = "small" | "medium" | "large";

export interface GalleryOptions {
  images: GalleryImage[];
  size?: GallerySize;
  captions?: boolean;
  captionPosition?: "top" | "bottom" | "overlay";
  lightbox?: boolean;
  gap?: string;
}
