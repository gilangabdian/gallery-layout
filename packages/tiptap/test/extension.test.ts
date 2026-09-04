import { describe, it, expect, vi } from 'vitest'
import { Editor } from '@tiptap/core'
import { GalleryExtension } from '../src/index'
import StarterKit from '@tiptap/starter-kit'

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

describe('Tiptap Gallery Extension', () => {
  it('should initialize the editor with GalleryExtension', () => {
    // Create an editor instance with the extension
    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: '<p>Hello World</p>',
    })

    expect(editor).toBeDefined()
    expect(editor.getText()).toBe('Hello World')

    // Check if the extension is loaded
    expect(editor.extensionManager.extensions.some((e) => e.name === 'galleryLayout')).toBe(true)

    editor.destroy()
  })

  it('should support inserting a gallery node', () => {
    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: '<p>Initial content</p>',
    })

    const mockImages = [
      { src: 'https://example.com/1.jpg', alt: 'Test 1' },
      { src: 'https://example.com/2.jpg', alt: 'Test 2' },
    ]

    // Insert gallery programmatically
    editor.chain().focus().insertGallery(mockImages).run()

    // Serialize HTML to check if node exists
    const html = editor.getHTML()
    expect(html).toContain('data-type="gallery-layout"')

    editor.destroy()
  })

  it('should execute Tiptap commands to update layout and size', () => {
    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: '<p></p>',
    })

    const mockImages = [{ src: '1.jpg', alt: 'Test' }]
    editor.chain().focus().insertGallery(mockImages).run()

    // Default layout is 'scroll', let's change it to 'grid'
    editor.chain().setGalleryLayout('grid').run()

    // Check if the node attributes are updated
    let html = editor.getHTML()
    expect(html).toContain('data-layout="grid"')

    // Default size is 'medium', let's change it to 'large'
    editor.chain().setGallerySize('large').run()

    html = editor.getHTML()
    expect(html).toContain('data-size="large"')

    editor.destroy()
  })

  it('should parse HTML correctly into node attributes', () => {
    // Initial HTML with custom attributes
    const initialHTML = `
      <div data-type="gallery-layout" data-layout="grid" data-size="large" data-captions="false" data-caption-position="top-left" data-pointer="true" data-lightbox="true" data-images='[{"src":"img1.jpg","alt":"Image 1"}]'></div>
    `

    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: initialHTML,
    })

    // The editor should have parsed the HTML and stored it in the document JSON
    const json = editor.getJSON()
    const galleryNode = json.content?.find((n) => n.type === 'galleryLayout')

    expect(galleryNode).toBeDefined()
    expect(galleryNode?.attrs?.layout).toBe('grid')
    expect(galleryNode?.attrs?.size).toBe('large')
    expect(galleryNode?.attrs?.captions).toBe(false)
    expect(galleryNode?.attrs?.captionPosition).toBe('top-left')
    expect(galleryNode?.attrs?.pointer).toBe(true)
    expect(galleryNode?.attrs?.lightbox).toBe(true)
    expect(galleryNode?.attrs?.images).toEqual([{ src: 'img1.jpg', alt: 'Image 1' }])

    editor.destroy()
  })

  it('should have correct default option values', () => {
    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: '<p></p>',
    })

    const ext = editor.extensionManager.extensions.find((e) => e.name === 'galleryLayout')
    expect(ext).toBeDefined()
    expect(ext?.options.defaultLayout).toBe('scroll')
    expect(ext?.options.defaultSize).toBe('medium')
    expect(ext?.options.defaultCaptions).toBe(true)
    expect(ext?.options.defaultLightbox).toBe(false)
    expect(ext?.options.defaultGap).toBe('16px')
    expect(ext?.options.defaultRadius).toBe('4px')
    expect(ext?.options.defaultCaptionSize).toBe('14px')
    expect(ext?.options.defaultAspectRatio).toBe('auto')

    editor.destroy()
  })

  it('should allow custom defaults via configure()', () => {
    const editor = new Editor({
      extensions: [
        StarterKit,
        GalleryExtension.configure({
          defaultLayout: 'grid',
          defaultSize: 'large',
          defaultCaptions: false,
          defaultLightbox: true,
          defaultGap: '24px',
          defaultRadius: '12px',
        }),
      ],
      content: '<p></p>',
    })

    // Insert a gallery — it should use the custom defaults
    editor.chain().focus().insertGallery([{ src: '1.jpg', alt: 'Test' }]).run()

    const json = editor.getJSON()
    const galleryNode = json.content?.find((n) => n.type === 'galleryLayout')

    expect(galleryNode).toBeDefined()
    expect(galleryNode?.attrs?.layout).toBe('grid')
    expect(galleryNode?.attrs?.size).toBe('large')
    expect(galleryNode?.attrs?.captions).toBe(false)
    expect(galleryNode?.attrs?.lightbox).toBe(true)
    expect(galleryNode?.attrs?.gap).toBe('24px')
    expect(galleryNode?.attrs?.radius).toBe('12px')

    editor.destroy()
  })

  it('should parse gap, radius, aspectRatio, columns, snap, align from HTML', () => {
    const initialHTML = `
      <div data-type="gallery-layout" data-gap="24px" data-radius="12px" data-aspect-ratio="16/9" data-columns="3" data-snap="true" data-align="center" data-images='[{"src":"img1.jpg","alt":"Test"}]'></div>
    `

    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: initialHTML,
    })

    const json = editor.getJSON()
    const galleryNode = json.content?.find((n) => n.type === 'galleryLayout')

    expect(galleryNode).toBeDefined()
    expect(galleryNode?.attrs?.gap).toBe('24px')
    expect(galleryNode?.attrs?.radius).toBe('12px')
    expect(galleryNode?.attrs?.aspectRatio).toBe('16/9')
    expect(galleryNode?.attrs?.columns).toBe(3)
    expect(galleryNode?.attrs?.snap).toBe(true)
    expect(galleryNode?.attrs?.align).toBe('center')

    editor.destroy()
  })

  it('should render non-default attributes to HTML', () => {
    const editor = new Editor({
      extensions: [StarterKit, GalleryExtension],
      content: '<p></p>',
    })

    editor
      .chain()
      .focus()
      .insertGallery([{ src: '1.jpg', alt: 'Test' }])
      .run()

    // Update attributes to non-default values
    editor.chain().updateAttributes('galleryLayout', {
      gap: '32px',
      radius: '16px',
      aspectRatio: '4/3',
    }).run()

    const html = editor.getHTML()
    expect(html).toContain('data-gap="32px"')
    expect(html).toContain('data-radius="16px"')
    expect(html).toContain('data-aspect-ratio="4/3"')

    editor.destroy()
  })
})
