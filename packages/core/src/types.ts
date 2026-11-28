export interface GalleryImage {
  src: string
  alt: string
  title?: string
}

export type GallerySize =
  'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | (string & {})

export interface GridResponsiveSettings {
  mobile?: number
  tablet?: number
  desktop?: number
}

export interface LightboxOptions {
  navigation?: boolean
  loop?: boolean
}

export interface BaseGalleryOptions {
  images: GalleryImage[]
  lightbox?: boolean | LightboxOptions
  gap?: string
  pointer?: boolean
  radius?: boolean | string
  captions?: boolean
  captionPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'overlay-top-left'
    | 'overlay-top-center'
    | 'overlay-top-right'
    | 'overlay-bottom-left'
    | 'overlay-bottom-center'
    | 'overlay-bottom-right'
  captionSize?: string
  lazyLoad?: boolean
  align?: 'left' | 'center' | 'right'
  onImageClick?: (image: GalleryImage, index: number) => void
}

export interface ScrollGalleryOptions extends BaseGalleryOptions {
  layout?: 'scroll'
  size?: GallerySize
  snap?: boolean
  aspectRatio?: string
}

export interface GridGalleryOptions extends BaseGalleryOptions {
  layout: 'grid'
  size?: GallerySize
  columns?: number | GridResponsiveSettings
  aspectRatio?: string
}

export type GalleryOptions = ScrollGalleryOptions | GridGalleryOptions

export interface GalleryInstance {
  destroy: () => void
}
