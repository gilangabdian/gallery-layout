import { describe, it, expect, vi } from 'vitest'
import { Editor } from '@tiptap/core'
import { GalleryExtension } from '../src/index'
import StarterKit from '@tiptap/starter-kit'

global.ResizeObserver = class ResizeObserver {
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
})
