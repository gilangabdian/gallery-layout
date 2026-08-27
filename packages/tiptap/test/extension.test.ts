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
})
