import type { GalleryImage, GalleryOptions } from './types'

export function openLightbox(image: GalleryImage, options: GalleryOptions): void {
  // Create overlay container
  const overlay = document.createElement('div')
  overlay.className = 'gallery-layout__lightbox'

  if (options.captions) {
    overlay.dataset.captionPosition = options.captionPosition ?? 'bottom-center'
  }

  // Create image element
  const imgElement = document.createElement('img')
  imgElement.src = image.src
  imgElement.alt = image.alt
  imgElement.className = 'gallery-layout__lightbox-img'

  // Create close button (accessible)
  const closeBtn = document.createElement('button')
  closeBtn.className = 'gallery-layout__lightbox-close'
  closeBtn.setAttribute('aria-label', 'Close lightbox')
  closeBtn.innerHTML = '&times;'

  // Create inner wrapper (similar to figure in gallery)
  const innerWrapper = document.createElement('figure')
  innerWrapper.className = 'gallery-layout__lightbox-inner'

  if (options.captions && image.title) {
    const captionElement = document.createElement('figcaption')
    captionElement.className = 'gallery-layout__lightbox-caption'
    captionElement.textContent = image.title

    if (options.captionPosition?.startsWith('top')) {
      innerWrapper.appendChild(captionElement)
      innerWrapper.appendChild(imgElement)
    } else {
      innerWrapper.appendChild(imgElement)
      innerWrapper.appendChild(captionElement)
    }
  } else {
    innerWrapper.appendChild(imgElement)
  }

  overlay.appendChild(innerWrapper)

  overlay.appendChild(closeBtn)
  document.body.appendChild(overlay)

  // Prevent background scrolling
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  // Focus management
  closeBtn.focus()

  // Close logic
  const closeLightbox = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay)
    }
    document.body.style.overflow = originalOverflow
    document.removeEventListener('keydown', onKeyDown)
  }

  // Event listeners
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closeLightbox()
  })
  overlay.addEventListener('click', () => {
    closeLightbox()
  })

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    }
  }
  document.addEventListener('keydown', onKeyDown)
}
