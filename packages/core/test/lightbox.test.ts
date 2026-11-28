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
    openLightbox(sampleImage, {
      ...defaultOptions,
      captions: true,
      captionPosition: 'bottom-center',
    })

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

  it('should focus close button after opening', () => {
    openLightbox(sampleImage, defaultOptions)

    const closeBtn = document.querySelector('.gallery-layout__lightbox-close') as HTMLButtonElement
    expect(document.activeElement).toBe(closeBtn)
  })

  it('should not render caption when captions option is false', () => {
    openLightbox(sampleImage, { ...defaultOptions, captions: false })

    const caption = document.querySelector('.gallery-layout__lightbox-caption')
    expect(caption).toBeNull()
  })

  it('should not render caption when image has no title', () => {
    const imageWithoutTitle: GalleryImage = { src: 'photo.jpg', alt: 'No title photo' }
    openLightbox(imageWithoutTitle, { ...defaultOptions, captions: true })

    const caption = document.querySelector('.gallery-layout__lightbox-caption')
    expect(caption).toBeNull()
  })

  it('should forward custom overlay CSS variables from sourceContainer to lightbox', () => {
    const source = document.createElement('div')
    source.style.setProperty('--gallery-overlay-bg', 'transparent')
    source.style.setProperty('--gallery-overlay-color', '#f8fafc')
    source.style.setProperty('--gallery-overlay-text-shadow', '0 1px 4px rgba(0, 0, 0, 0.8)')
    document.body.appendChild(source)

    openLightbox(
      sampleImage,
      { ...defaultOptions, captions: true, captionPosition: 'overlay-bottom-center' },
      source
    )

    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(overlay.style.getPropertyValue('--gallery-overlay-bg')).toBe('transparent')
    expect(overlay.style.getPropertyValue('--gallery-overlay-color')).toBe('#f8fafc')
    expect(overlay.style.getPropertyValue('--gallery-overlay-text-shadow')).toBe(
      '0 1px 4px rgba(0, 0, 0, 0.8)'
    )
  })

  it('should not set inline overlay CSS variables on lightbox when sourceContainer has none', () => {
    const source = document.createElement('div')
    document.body.appendChild(source)

    openLightbox(
      sampleImage,
      { ...defaultOptions, captions: true, captionPosition: 'overlay-bottom-center' },
      source
    )

    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(overlay.style.getPropertyValue('--gallery-overlay-bg')).toBe('')
    expect(overlay.style.getPropertyValue('--gallery-overlay-color')).toBe('')
    expect(overlay.style.getPropertyValue('--gallery-overlay-text-shadow')).toBe('')
  })

  it('should not render prev/next buttons by default when lightbox is boolean true', () => {
    const images: GalleryImage[] = [
      { src: 'photo1.jpg', alt: 'Photo 1', title: 'First' },
      { src: 'photo2.jpg', alt: 'Photo 2', title: 'Second' },
    ]
    openLightbox(images[0], { ...defaultOptions, images, lightbox: true })

    expect(document.querySelector('.gallery-layout__lightbox-prev')).toBeNull()
    expect(document.querySelector('.gallery-layout__lightbox-next')).toBeNull()
  })

  it('should not render prev/next buttons when navigation is enabled but only 1 image exists', () => {
    openLightbox(sampleImage, {
      ...defaultOptions,
      images: [sampleImage],
      lightbox: { navigation: true },
    })

    expect(document.querySelector('.gallery-layout__lightbox-prev')).toBeNull()
    expect(document.querySelector('.gallery-layout__lightbox-next')).toBeNull()
  })

  it('should navigate prev/next with loop wrap-around via buttons and keyboard when enabled', () => {
    const images: GalleryImage[] = [
      { src: 'photo1.jpg', alt: 'Photo 1', title: 'First' },
      { src: 'photo2.jpg', alt: 'Photo 2' },
      { src: 'photo3.jpg', alt: 'Photo 3', title: 'Third' },
    ]

    openLightbox(
      images[0],
      { ...defaultOptions, images, captions: true, lightbox: { navigation: true } },
      undefined,
      0
    )

    const img = document.querySelector('.gallery-layout__lightbox-img') as HTMLImageElement
    const prevBtn = document.querySelector('.gallery-layout__lightbox-prev') as HTMLButtonElement
    const nextBtn = document.querySelector('.gallery-layout__lightbox-next') as HTMLButtonElement

    expect(prevBtn).not.toBeNull()
    expect(nextBtn).not.toBeNull()
    expect(img.src).toContain('photo1.jpg')
    expect(document.querySelector('.gallery-layout__lightbox-caption')?.textContent).toBe('First')

    // Next button -> second image (no title, caption should disappear)
    nextBtn.click()
    expect(img.src).toContain('photo2.jpg')
    expect(img.alt).toBe('Photo 2')
    expect(document.querySelector('.gallery-layout__lightbox-caption')).toBeNull()

    // ArrowRight -> third image
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(img.src).toContain('photo3.jpg')
    expect(document.querySelector('.gallery-layout__lightbox-caption')?.textContent).toBe('Third')

    // ArrowRight at end -> wraps around to first image
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(img.src).toContain('photo1.jpg')

    // Prev button at start -> wraps around to last image
    prevBtn.click()
    expect(img.src).toContain('photo3.jpg')

    // ArrowLeft -> second image
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(img.src).toContain('photo2.jpg')
  })

  it('should disable boundary nav buttons when loop is false', () => {
    const images: GalleryImage[] = [
      { src: 'photo1.jpg', alt: 'Photo 1' },
      { src: 'photo2.jpg', alt: 'Photo 2' },
    ]

    openLightbox(
      images[0],
      { ...defaultOptions, images, lightbox: { navigation: true, loop: false } },
      undefined,
      0
    )

    const prevBtn = document.querySelector('.gallery-layout__lightbox-prev') as HTMLButtonElement
    const nextBtn = document.querySelector('.gallery-layout__lightbox-next') as HTMLButtonElement

    expect(prevBtn.disabled).toBe(true)
    expect(nextBtn.disabled).toBe(false)

    nextBtn.click()
    expect(prevBtn.disabled).toBe(false)
    expect(nextBtn.disabled).toBe(true)
  })

  it('should navigate on horizontal touch swipe when navigation is enabled', () => {
    const images: GalleryImage[] = [
      { src: 'photo1.jpg', alt: 'Photo 1' },
      { src: 'photo2.jpg', alt: 'Photo 2' },
    ]

    openLightbox(
      images[0],
      { ...defaultOptions, images, lightbox: { navigation: true } },
      undefined,
      0
    )

    const overlay = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    const img = document.querySelector('.gallery-layout__lightbox-img') as HTMLImageElement

    // Swipe left (dx = -80) -> next image
    const startEvent = new Event('touchstart') as Event & {
      changedTouches: { clientX: number; clientY: number }[]
    }
    startEvent.changedTouches = [{ clientX: 200, clientY: 100 }]
    overlay.dispatchEvent(startEvent)

    const endEvent = new Event('touchend') as Event & {
      changedTouches: { clientX: number; clientY: number }[]
    }
    endEvent.changedTouches = [{ clientX: 120, clientY: 105 }]
    overlay.dispatchEvent(endEvent)

    expect(img.src).toContain('photo2.jpg')
  })

  it('should restore focus to the previously focused element on close', () => {
    const triggerBtn = document.createElement('button')
    document.body.appendChild(triggerBtn)
    triggerBtn.focus()
    expect(document.activeElement).toBe(triggerBtn)

    const close = openLightbox(sampleImage, defaultOptions)
    expect(document.activeElement).toBe(document.querySelector('.gallery-layout__lightbox-close'))

    close()
    expect(document.activeElement).toBe(triggerBtn)
  })
})
