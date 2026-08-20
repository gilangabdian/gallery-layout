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
  captionPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "overlay";
  lightbox?: boolean;
  gap?: string;
  pointer?: boolean;
  snap?: boolean;
  aspectRatio?: string;
}
