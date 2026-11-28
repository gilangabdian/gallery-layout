import type { GalleryImage, GalleryOptions } from './types'

const LIGHTBOX_CSS_VARS = [
  '--gallery-overlay-bg',
  '--gallery-overlay-color',
  '--gallery-overlay-text-shadow',
] as const

export function openLightbox(
  image: GalleryImage,
  options: GalleryOptions,
  sourceContainer?: HTMLElement,
  initialIndex?: number
): () => void {
  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null

  const lightboxConfig =
    typeof options.lightbox === 'object' && options.lightbox !== null ? options.lightbox : null
  const navEnabled = lightboxConfig?.navigation === true
  const loopEnabled = lightboxConfig?.loop !== false

  const images = options.images.length > 0 ? options.images : [image]
  const resolvedIndex =
    typeof initialIndex === 'number' && initialIndex >= 0 && initialIndex < images.length
      ? initialIndex
      : Math.max(
          0,
          images.findIndex((item) => item === image || item.src === image.src)
        )
  let currentIndex = resolvedIndex

  // Create overlay container
  const overlay = document.createElement('div')
  overlay.className = 'gallery-layout__lightbox'

  if (sourceContainer) {
    const computed = getComputedStyle(sourceContainer)
    for (const prop of LIGHTBOX_CSS_VARS) {
      const value = computed.getPropertyValue(prop).trim()
      if (value) {
        overlay.style.setProperty(prop, value)
      }
    }
  }

  if (options.captions) {
    overlay.dataset.captionPosition = options.captionPosition ?? 'bottom-center'
  }

  // Create image element
  const imgElement = document.createElement('img')
  imgElement.className = 'gallery-layout__lightbox-img'

  // Create close button (accessible)
  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'gallery-layout__lightbox-close'
  closeBtn.setAttribute('aria-label', 'Close lightbox')
  closeBtn.innerHTML = '&times;'

  // Create inner wrapper (similar to figure in gallery)
  const innerWrapper = document.createElement('figure')
  innerWrapper.className = 'gallery-layout__lightbox-inner'

  const renderCurrentImage = () => {
    const activeImage = images[currentIndex] ?? image
    imgElement.src = activeImage.src
    imgElement.alt = activeImage.alt

    innerWrapper.innerHTML = ''
    if (options.captions && activeImage.title) {
      const captionElement = document.createElement('figcaption')
      captionElement.className = 'gallery-layout__lightbox-caption'
      captionElement.textContent = activeImage.title

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
  }

  renderCurrentImage()
  overlay.appendChild(innerWrapper)

  const canNavigate = navEnabled && images.length > 1
  let prevBtn: HTMLButtonElement | null = null
  let nextBtn: HTMLButtonElement | null = null

  const updateNavState = () => {
    if (!loopEnabled && prevBtn && nextBtn) {
      prevBtn.disabled = currentIndex === 0
      nextBtn.disabled = currentIndex === images.length - 1
    }
  }

  const navigate = (delta: number) => {
    if (!canNavigate) return
    if (loopEnabled) {
      currentIndex = (currentIndex + delta + images.length) % images.length
    } else {
      const nextIndex = currentIndex + delta
      if (nextIndex < 0 || nextIndex >= images.length) return
      currentIndex = nextIndex
    }
    renderCurrentImage()
    updateNavState()
  }

  if (canNavigate) {
    prevBtn = document.createElement('button')
    prevBtn.type = 'button'
    prevBtn.className = 'gallery-layout__lightbox-nav gallery-layout__lightbox-prev'
    prevBtn.setAttribute('aria-label', 'Previous image')
    prevBtn.innerHTML = '&#8249;'
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      navigate(-1)
    })

    nextBtn = document.createElement('button')
    nextBtn.type = 'button'
    nextBtn.className = 'gallery-layout__lightbox-nav gallery-layout__lightbox-next'
    nextBtn.setAttribute('aria-label', 'Next image')
    nextBtn.innerHTML = '&#8250;'
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      navigate(1)
    })

    updateNavState()
    overlay.appendChild(prevBtn)
    overlay.appendChild(nextBtn)
  }

  overlay.appendChild(closeBtn)
  document.body.appendChild(overlay)

  // Prevent background scrolling
  const originalOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  // Focus management
  closeBtn.focus()

  let closed = false

  // Close logic
  const closeLightbox = () => {
    if (closed) return
    closed = true
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay)
    }
    document.body.style.overflow = originalOverflow
    document.removeEventListener('keydown', onKeyDown)
    if (previouslyFocused && document.contains(previouslyFocused)) {
      previouslyFocused.focus()
    }
  }

  // Event listeners
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    closeLightbox()
  })
  overlay.addEventListener('click', () => {
    closeLightbox()
  })

  if (canNavigate) {
    let touchStartX = 0
    let touchStartY = 0
    overlay.addEventListener(
      'touchstart',
      (e) => {
        if (e.changedTouches.length > 0) {
          touchStartX = e.changedTouches[0].clientX
          touchStartY = e.changedTouches[0].clientY
        }
      },
      { passive: true }
    )
    overlay.addEventListener(
      'touchend',
      (e) => {
        if (e.changedTouches.length > 0) {
          const dx = e.changedTouches[0].clientX - touchStartX
          const dy = e.changedTouches[0].clientY - touchStartY
          if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) {
            navigate(dx < 0 ? 1 : -1)
          }
        }
      },
      { passive: true }
    )
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox()
    } else if (canNavigate && e.key === 'ArrowLeft') {
      e.preventDefault()
      navigate(-1)
    } else if (canNavigate && e.key === 'ArrowRight') {
      e.preventDefault()
      navigate(1)
    }
  }
  document.addEventListener('keydown', onKeyDown)

  return closeLightbox
}
