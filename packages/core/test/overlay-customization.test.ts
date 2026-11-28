import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createGallery } from '../src/gallery'
import type { BaseGalleryOptions } from '../src/types'

const stylesCss = readFileSync(resolve(__dirname, '../src/styles.css'), 'utf-8')

describe('Caption overlay CSS customization (feature tests)', () => {
  let styleEl: HTMLStyleElement
  let container: HTMLElement

  const sampleImages = [
    { src: 'photo1.jpg', alt: 'Photo 1', title: 'Overlay Caption 1' },
    { src: 'photo2.jpg', alt: 'Photo 2', title: 'Overlay Caption 2' },
  ]

  beforeEach(() => {
    styleEl = document.createElement('style')
    styleEl.textContent = stylesCss
    document.head.appendChild(styleEl)

    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.querySelectorAll('.gallery-layout__lightbox').forEach((el) => el.remove())
    document.body.style.overflow = ''
    document.documentElement.style.removeProperty('--gallery-overlay-bg')
    document.documentElement.style.removeProperty('--gallery-overlay-color')
    document.documentElement.style.removeProperty('--gallery-overlay-text-shadow')
    container.remove()
    styleEl.remove()
  })

  it('defines overlay CSS variables with fallbacks in styles.css without shadowing :root on .gallery-layout', () => {
    // Ensure .gallery-layout root block does not re-declare overlay defaults (which would block :root overrides)
    const rootBlockMatch = stylesCss.match(/\.gallery-layout\s*\{[^}]*\}/)
    expect(rootBlockMatch).not.toBeNull()
    expect(rootBlockMatch?.[0]).not.toContain('--gallery-overlay-bg')
    expect(rootBlockMatch?.[0]).not.toContain('--gallery-overlay-color')
    expect(rootBlockMatch?.[0]).not.toContain('--gallery-overlay-text-shadow')

    // Ensure both gallery overlay and lightbox overlay consume the CSS variables with defaults
    const galleryOverlayMatch = stylesCss.match(
      /\.gallery-layout\[data-caption-position\^='overlay'\]\s+\.gallery-layout__item\s+figcaption\s*\{[^}]*\}/
    )
    expect(galleryOverlayMatch).not.toBeNull()
    expect(galleryOverlayMatch?.[0]).toContain(
      'background: var(--gallery-overlay-bg, rgba(0, 0, 0, 0.6))'
    )
    expect(galleryOverlayMatch?.[0]).toContain('color: var(--gallery-overlay-color, white)')
    expect(galleryOverlayMatch?.[0]).toContain(
      'text-shadow: var(--gallery-overlay-text-shadow, none)'
    )

    const lightboxOverlayMatch = stylesCss.match(
      /\.gallery-layout__lightbox\[data-caption-position\^='overlay'\]\s+\.gallery-layout__lightbox-caption\s*\{[^}]*\}/
    )
    expect(lightboxOverlayMatch).not.toBeNull()
    expect(lightboxOverlayMatch?.[0]).toContain(
      'background: var(--gallery-overlay-bg, rgba(0, 0, 0, 0.6))'
    )
    expect(lightboxOverlayMatch?.[0]).toContain('color: var(--gallery-overlay-color, white)')
    expect(lightboxOverlayMatch?.[0]).toContain(
      'text-shadow: var(--gallery-overlay-text-shadow, none)'
    )
  })

  it('reveals overlay captions on keyboard focus-within and touch devices (hover: none)', () => {
    expect(stylesCss).toContain(
      ".gallery-layout[data-caption-position^='overlay'] .gallery-layout__item:focus-within figcaption"
    )
    expect(stylesCss).toMatch(
      /@media\s*\(hover:\s*none\)\s*\{\s*\.gallery-layout\[data-caption-position\^='overlay'\]\s+\.gallery-layout__item\s+figcaption\s*\{\s*opacity:\s*1;\s*\}\s*\}/
    )
  })

  it('inherits :root overlay CSS variables in both gallery and lightbox without being shadowed', () => {
    document.documentElement.style.setProperty('--gallery-overlay-bg', 'transparent')
    document.documentElement.style.setProperty('--gallery-overlay-color', '#f8fafc')
    document.documentElement.style.setProperty(
      '--gallery-overlay-text-shadow',
      '0 1px 4px rgba(0, 0, 0, 0.8)'
    )

    createGallery(container, {
      images: sampleImages,
      captions: true,
      captionPosition: 'overlay-bottom-center',
      lightbox: true,
    })

    const computedGallery = getComputedStyle(container)
    expect(computedGallery.getPropertyValue('--gallery-overlay-bg').trim()).toBe('transparent')
    expect(computedGallery.getPropertyValue('--gallery-overlay-color').trim()).toBe('#f8fafc')
    expect(computedGallery.getPropertyValue('--gallery-overlay-text-shadow').trim()).toBe(
      '0 1px 4px rgba(0, 0, 0, 0.8)'
    )

    // Open lightbox via click and verify values reach lightbox
    const img = container.querySelector('img') as HTMLImageElement
    img.click()

    const lightbox = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(lightbox).not.toBeNull()
    expect(lightbox.dataset.captionPosition).toBe('overlay-bottom-center')
    expect(lightbox.style.getPropertyValue('--gallery-overlay-bg')).toBe('transparent')
    expect(lightbox.style.getPropertyValue('--gallery-overlay-color')).toBe('#f8fafc')
    expect(lightbox.style.getPropertyValue('--gallery-overlay-text-shadow')).toBe(
      '0 1px 4px rgba(0, 0, 0, 0.8)'
    )
  })

  it('scopes custom overlay CSS variables per gallery container and forwards them on click & keyboard open', () => {
    const secondContainer = document.createElement('div')
    document.body.appendChild(secondContainer)

    container.style.setProperty('--gallery-overlay-bg', 'rgba(15, 23, 42, 0.75)')
    container.style.setProperty('--gallery-overlay-color', '#e2e8f0')

    createGallery(container, {
      images: sampleImages,
      captions: true,
      captionPosition: 'overlay-top-left',
      lightbox: true,
    })

    createGallery(secondContainer, {
      images: sampleImages,
      captions: true,
      captionPosition: 'overlay-top-left',
      lightbox: true,
    })

    // First gallery opened via keyboard Enter carries its scoped variables
    const firstImg = container.querySelector('img') as HTMLImageElement
    firstImg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    let lightbox = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(lightbox.style.getPropertyValue('--gallery-overlay-bg')).toBe('rgba(15, 23, 42, 0.75)')
    expect(lightbox.style.getPropertyValue('--gallery-overlay-color')).toBe('#e2e8f0')
    lightbox.remove()

    // Second untouched gallery has no inline overlay override on its lightbox
    const secondImg = secondContainer.querySelector('img') as HTMLImageElement
    secondImg.click()

    lightbox = document.querySelector('.gallery-layout__lightbox') as HTMLElement
    expect(lightbox.style.getPropertyValue('--gallery-overlay-bg')).toBe('')
    expect(lightbox.style.getPropertyValue('--gallery-overlay-color')).toBe('')

    secondContainer.remove()
  })

  it('supports all overlay-* caption positions with transparent overlay customization', () => {
    const overlayPositions: NonNullable<BaseGalleryOptions['captionPosition']>[] = [
      'overlay-top-left',
      'overlay-top-center',
      'overlay-top-right',
      'overlay-bottom-left',
      'overlay-bottom-center',
      'overlay-bottom-right',
    ]

    container.style.setProperty('--gallery-overlay-bg', 'transparent')

    for (const position of overlayPositions) {
      createGallery(container, {
        images: sampleImages,
        captions: true,
        captionPosition: position,
        lightbox: true,
      })

      expect(container.dataset.captionPosition).toBe(position)
      expect(container.querySelector('figcaption')?.textContent).toBe('Overlay Caption 1')

      const img = container.querySelector('img') as HTMLImageElement
      img.click()

      const lightbox = document.querySelector('.gallery-layout__lightbox') as HTMLElement
      expect(lightbox.dataset.captionPosition).toBe(position)
      expect(lightbox.style.getPropertyValue('--gallery-overlay-bg')).toBe('transparent')
      lightbox.remove()
    }
  })
})
