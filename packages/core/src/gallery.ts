import type { GalleryOptions } from './types'
import { openLightbox } from './lightbox'

export function createGallery(container: HTMLElement, options: GalleryOptions): void {
  container.innerHTML = ''

  // CLEANUP: Prevent DOM State Leak when options are toggled off during hot-reloads
  delete container.dataset.layout
  delete container.dataset.align
  delete container.dataset.size
  delete container.dataset.snap
  delete container.dataset.captionPosition
  delete container.dataset.pointer

  container.style.removeProperty('--gallery-custom-size')
  container.style.removeProperty('--gallery-gap')
  container.style.removeProperty('--gallery-aspect-ratio')
  container.style.removeProperty('--gallery-caption-size')
  container.style.removeProperty('--gallery-radius')
  container.style.removeProperty('--gallery-cols-desktop')
  container.style.removeProperty('--gallery-cols-tablet')
  container.style.removeProperty('--gallery-cols-mobile')

  container.classList.add('gallery-layout')

  const layout = options.layout ?? 'scroll'
  container.dataset.layout = layout

  if (options.align) {
    container.dataset.align = options.align
  }

  // 1. Apply Size Dataset for ALL Layouts
  const presetSizes = ['extra-small', 'small', 'medium', 'large', 'extra-large']
  if (options.size && presetSizes.includes(options.size)) {
    container.dataset.size = options.size
  } else if (options.size) {
    container.dataset.size = 'custom'
    container.style.setProperty('--gallery-custom-size', options.size)
  } else {
    container.dataset.size = 'medium'
  }

  // 2. Layout-specific processing
  if (layout === 'scroll') {
    const scrollOptions = options as Extract<GalleryOptions, { layout?: 'scroll' }>

    if (scrollOptions.snap === false) {
      container.dataset.snap = 'false'
    }
  } else if (layout === 'grid') {
    const gridOptions = options as Extract<GalleryOptions, { layout: 'grid' }>

    // Only set inline styles if the user explicitly defined columns.
    // If undefined, the CSS data-size mapping will handle the column count automatically!
    const finalCols = gridOptions.columns
    if (finalCols !== undefined) {
      if (typeof finalCols === 'number') {
        container.style.setProperty('--gallery-cols-desktop', finalCols.toString())
        container.style.setProperty('--gallery-cols-tablet', finalCols.toString())
        container.style.setProperty('--gallery-cols-mobile', finalCols.toString())
      } else if (finalCols) {
        if (finalCols.desktop)
          container.style.setProperty('--gallery-cols-desktop', finalCols.desktop.toString())
        if (finalCols.tablet)
          container.style.setProperty('--gallery-cols-tablet', finalCols.tablet.toString())
        if (finalCols.mobile)
          container.style.setProperty('--gallery-cols-mobile', finalCols.mobile.toString())
      }
    }
  }

  if (options.captions) {
    container.dataset.captionPosition = options.captionPosition ?? 'bottom-center'
  }

  if (options.pointer) {
    container.dataset.pointer = 'true'
  }

  if (options.gap) {
    container.style.setProperty('--gallery-gap', options.gap)
  }

  if (options.aspectRatio) {
    container.style.setProperty('--gallery-aspect-ratio', options.aspectRatio)
  }

  if (options.captionSize) {
    container.style.setProperty('--gallery-caption-size', options.captionSize)
  }

  if (options.radius === false) {
    container.style.setProperty('--gallery-radius', '0px')
  } else if (typeof options.radius === 'string') {
    container.style.setProperty('--gallery-radius', options.radius)
  }

  const track = document.createElement('div')
  track.className = 'gallery-layout__track'

  for (const image of options.images) {
    const item = document.createElement('figure')
    item.className = 'gallery-layout__item'

    const img = document.createElement('img')
    img.src = image.src
    img.alt = image.alt
    if (options.lazyLoad !== false) {
      img.loading = 'lazy'
    }

    if (options.lightbox) {
      img.setAttribute('tabindex', '0')
      img.setAttribute('role', 'button')
      img.addEventListener('click', () => {
        openLightbox(image, options)
      })
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openLightbox(image, options)
        }
      })
    }

    item.appendChild(img)

    if (options.captions && image.title) {
      const caption = document.createElement('figcaption')
      caption.textContent = image.title

      if (options.captionPosition?.startsWith('top')) {
        item.insertBefore(caption, img)
      } else {
        item.appendChild(caption)
      }
    }

    track.appendChild(item)
  }

  container.appendChild(track)
}
