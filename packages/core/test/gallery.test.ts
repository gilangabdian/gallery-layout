import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createGallery } from '../src/gallery'

describe('createGallery', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  const sampleImages = [
    { src: 'photo1.jpg', alt: 'Photo 1', title: 'Caption 1' },
    { src: 'photo2.jpg', alt: 'Photo 2' },
  ]

  it('should render images correctly', () => {
    createGallery(container, { images: sampleImages })

    const track = container.querySelector('.gallery-layout__track')
    expect(track).not.toBeNull()

    const items = track?.querySelectorAll('.gallery-layout__item')
    expect(items?.length).toBe(2)

    const firstImg = items?.[0].querySelector('img')
    expect(firstImg?.src).toContain('photo1.jpg')
    expect(firstImg?.alt).toBe('Photo 1')
  })

  it('should render captions if enabled', () => {
    createGallery(container, { images: sampleImages, captions: true })

    const items = container.querySelectorAll('.gallery-layout__item')
    const firstCaption = items[0].querySelector('figcaption')
    const secondCaption = items[1].querySelector('figcaption')

    expect(firstCaption).not.toBeNull()
    expect(firstCaption?.textContent).toBe('Caption 1')

    // Should not render if title is missing
    expect(secondCaption).toBeNull()
  })

  it('should configure caption position correctly', () => {
    createGallery(container, {
      images: sampleImages,
      captions: true,
      captionPosition: 'top-center',
    })

    expect(container.dataset.captionPosition).toBe('top-center')

    const item = container.querySelector('.gallery-layout__item')
    const firstChild = item?.firstElementChild
    expect(firstChild?.tagName.toLowerCase()).toBe('figcaption')
  })

  it('should attach lightbox accessibility attributes', () => {
    createGallery(container, { images: sampleImages, lightbox: true })

    const img = container.querySelector('img')
    expect(img?.getAttribute('tabindex')).toBe('0')
    expect(img?.getAttribute('role')).toBe('button')
  })

  it('should configure pointer properly', () => {
    createGallery(container, { images: sampleImages, pointer: true })
    expect(container.dataset.pointer).toBe('true')
  })
})
