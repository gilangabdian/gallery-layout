import { describe, it, expect, beforeEach } from 'vitest'
import { openLightbox } from '../src/lightbox'
import type { GalleryImage, GalleryOptions } from '../src/types'

describe('openLightbox', () => {
  const sampleImage: GalleryImage = {
    src: 'photo1.jpg',
    alt: 'A beautiful photo',
    title: 'Photo Title',
  }

  const defaultOptions: GalleryOptions = {
    images: [],
    layout: 'scroll',
    size: 'medium',
    lightbox: true,
  }

  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('should render lightbox overlay, image, and close button', () => {
    openLightbox(sampleImage, defaultOptions)

    const overlay = document.querySelector('.gallery-layout__lightbox')
    expect(overlay).not.toBeNull()

    const img = overlay?.querySelector('.gallery-layout__lightbox-img') as HTMLImageElement
    expect(img).not.toBeNull()
    expect(img.src).toContain('photo1.jpg')
    expect(img.alt).toBe('A beautiful photo')

    const closeBtn = overlay?.querySelector('.gallery-layout__lightbox-close')
    expect(closeBtn).not.toBeNull()
    expect(closeBtn?.getAttribute('aria-label')).toBe('Close lightbox')
  })

  it('should render captions if enabled and position them correctly', () => {
    openLightbox(sampleImage, { ...defaultOptions, captions: true, captionPosition: 'top-left' })

    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(overlay.dataset.captionPosition).toBe('top-left')

    const caption = overlay.querySelector('.gallery-layout__lightbox-caption')
    expect(caption).not.toBeNull()
    expect(caption?.textContent).toBe('Photo Title')

    const innerWrapper = overlay.querySelector('.gallery-layout__lightbox-inner')
    // top position should render caption before image
    expect(innerWrapper?.firstElementChild?.tagName.toLowerCase()).toBe('figcaption')
    expect(innerWrapper?.lastElementChild?.tagName.toLowerCase()).toBe('img')
  })

  it('should render caption below image for bottom positions', () => {
    openLightbox(sampleImage, { ...defaultOptions, captions: true, captionPosition: 'bottom-center' })

    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    const innerWrapper = overlay.querySelector('.gallery-layout__lightbox-inner')
    
    // bottom position should render image before caption
    expect(innerWrapper?.firstElementChild?.tagName.toLowerCase()).toBe('img')
    expect(innerWrapper?.lastElementChild?.tagName.toLowerCase()).toBe('figcaption')
  })

  it('should lock document body scroll when opened', () => {
    // Set initial overflow
    document.body.style.overflow = 'auto'

    openLightbox(sampleImage, defaultOptions)
    
    // Should be locked
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore scroll and remove overlay when close button is clicked', () => {
    document.body.style.overflow = 'auto'
    
    openLightbox(sampleImage, defaultOptions)
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.querySelector('.gallery-layout__lightbox')).not.toBeNull()

    const closeBtn = document.querySelector('.gallery-layout__lightbox-close') as HTMLButtonElement
    closeBtn.click()

    // Restored state
    expect(document.body.style.overflow).toBe('auto')
    expect(document.querySelector('.gallery-layout__lightbox')).toBeNull()
  })

  it('should restore scroll and remove overlay when overlay background is clicked', () => {
    document.body.style.overflow = 'auto'
    
    openLightbox(sampleImage, defaultOptions)
    
    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLDivElement
    overlay.click()

    expect(document.body.style.overflow).toBe('auto')
    expect(document.querySelector('.gallery-layout__lightbox')).toBeNull()
  })

  it('should close when Escape key is pressed', () => {
    openLightbox(sampleImage, defaultOptions)
    expect(document.querySelector('.gallery-layout__lightbox')).not.toBeNull()

    // Dispatch Escape keydown
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)

    expect(document.querySelector('.gallery-layout__lightbox')).toBeNull()
  })

  it('should not close when other keys are pressed', () => {
    openLightbox(sampleImage, defaultOptions)
    expect(document.querySelector('.gallery-layout__lightbox')).not.toBeNull()

    // Dispatch Enter keydown
    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(event)

    // Should still be open
    expect(document.querySelector('.gallery-layout__lightbox')).not.toBeNull()
  })
})
