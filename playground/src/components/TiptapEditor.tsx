'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { GalleryExtension } from 'tiptap-extension-gallery-layout'
import 'gallery-layout/style.css' // Import the core css

const initialImages = [
  { src: "/photos/photo-1.png", alt: "Tokyo street in snowfall" },
  { src: "/photos/photo-2.png", alt: "Tokyo street" },
  { src: "/photos/photo-3.png", alt: "Building in Tokyo" }
]

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      GalleryExtension.configure({
        defaultLayout: 'scroll',
        defaultSize: 'medium'
      })
    ],
    content: `
      <h2>Tiptap Extension Demo</h2>
      <p>This editor uses the custom GalleryExtension! Click the button below to insert a gallery.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] border border-neutral-800 p-4 rounded-lg bg-neutral-900',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().insertGallery(initialImages).run()}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-sm rounded border border-neutral-700 transition-colors"
        >
          Insert Gallery
        </button>
        <button
          onClick={() => editor.chain().focus().setGalleryLayout('scroll').run()}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-sm rounded border border-neutral-700 transition-colors"
        >
          Set Layout: Scroll
        </button>
        <button
          onClick={() => editor.chain().focus().setGalleryLayout('grid').run()}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-sm rounded border border-neutral-700 transition-colors"
        >
          Set Layout: Grid
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
