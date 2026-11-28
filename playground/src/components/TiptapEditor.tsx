'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { GalleryExtension } from 'tiptap-extension-gallery-layout'
import { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  ImagePlus,
  Save,
  Edit3,
} from 'lucide-react'

interface ToolbarButtonProps {
  onClick: () => void
  isActive: boolean
  icon: React.ElementType
  label: string
}

const ToolbarButton = ({ onClick, isActive, icon: Icon, label }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2 rounded transition-colors ${
      isActive
        ? 'bg-neutral-700 text-white'
        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
    }`}
  >
    <Icon size={18} />
  </button>
)

export default function TiptapEditor() {
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      GalleryExtension.configure({
        onUpload: async (files: File[]) => {
          // Fake upload delay for demo purposes
          await new Promise((resolve) => setTimeout(resolve, 800))
          // Use ObjectURLs which are much lighter than Base64 (perfect for Playground)
          return files.map((file) => URL.createObjectURL(file))
        },
      }),
    ],
    content: `
      <h2>Cats like to Sleep</h2>
      <p>I don't know why cat is like sleeping, i think that is one thing that they do to enjoy their life, so here i take a photos about them while sleep</p>

      <div data-type="gallery-layout" data-layout="grid" data-size="small" data-aspect-ratio="1/1" data-captions="true" data-lightbox="true" data-images='[{"src":"/_next/image?url=%2Fphotos%2Fcat1.jpg&w=1200&q=75","alt":"Cat sleeping on white bed with paw over its face","title":"Hiding from the Morning Light"},{"src":"/_next/image?url=%2Fphotos%2Fcat2.jpg&w=1200&q=75","alt":"Grey kitten sleeping inside a wooden box","title":"Wooden Box Nap"},{"src":"/_next/image?url=%2Fphotos%2Fcat3.jpg&w=1200&q=75","alt":"Fluffy brown and white cat curled up sleeping on a sofa","title":"Cozy Sofa Curl"},{"src":"/_next/image?url=%2Fphotos%2Fcat4.jpg&w=1200&q=75","alt":"Fluffy white kitten sleeping peacefully on grey sheets","title":"Sweet Dreams, Little Cloud"},{"src":"/_next/image?url=%2Fphotos%2Fcat5.jpg&w=1200&q=75","alt":"Close-up of a brown and white tabby cat sleeping on bedding","title":"Peaceful Nap"},{"src":"/_next/image?url=%2Fphotos%2Fcat6.jpg&w=1200&q=75","alt":"Small tabby kitten sleeping with head resting on its paws","title":"Paws as a Pillow"},{"src":"/_next/image?url=%2Fphotos%2Fcat7.jpg&w=1200&q=75","alt":"Ginger cat sleeping belly-up on a dark blanket","title":"Belly-Up Afternoon Snooze"},{"src":"/_next/image?url=%2Fphotos%2Fcat8.jpg&w=1200&q=75","alt":"Tabby cat curled up sleeping on a wooden deck","title":"Quiet Deck Rest"},{"src":"/_next/image?url=%2Fphotos%2Fcat9.jpg&w=1200&q=75","alt":"Cat sleeping on a wooden windowsill with paw dangling","title":"Windowsill Siesta"},{"src":"/_next/image?url=%2Fphotos%2Fcat10.jpg&w=1200&q=75","alt":"Fluffy ginger cat sleeping on its back on the floor","title":"Lazy Floor Stretch"},{"src":"/_next/image?url=%2Fphotos%2Fcat11.jpg&w=1200&q=75","alt":"Ginger cat napping under a grey fringed blanket","title":"Tucked Under the Blanket"},{"src":"/_next/image?url=%2Fphotos%2Fcat12.jpg&w=1200&q=75","alt":"Calico cat sleeping under a white duvet","title":"Burrowed in the Duvet"}]'></div>

    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
      },
    },
    immediatelyRender: false,
    editable: false,
  })

  // Effect to sync editable state
  if (editor && editor.isEditable !== isEditing) {
    editor.setEditable(isEditing)
  }

  if (!editor) {
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const images = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
      title: file.name.split('.')[0], // Use filename as default title
    }))

    editor
      .chain()
      .focus()
      .insertGallery(images)
      .updateAttributes('galleryLayout', { captions: true })
      .run()

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {/* Editor Frame */}
      <div
        className={`rounded-xl transition-colors duration-300 ${
          isEditing
            ? 'border border-neutral-800 bg-neutral-900/50 sm:-mx-6'
            : 'border border-transparent bg-transparent'
        }`}
      >
        {/* Toolbar (Only visible when editing) */}
        {isEditing && (
          <div className="flex flex-wrap items-center gap-1 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-sm p-2 sticky top-[72px] z-40 rounded-t-xl">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={Bold}
              label="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={Italic}
              label="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              icon={UnderlineIcon}
              label="Underline"
            />

            <div className="w-[1px] h-6 bg-neutral-800 mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
              label="Heading 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
              label="Heading 2"
            />

            <div className="w-[1px] h-6 bg-neutral-800 mx-1" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 ml-1 bg-white hover:bg-neutral-200 text-black text-sm font-medium rounded transition-colors"
            >
              <ImagePlus size={16} />
              Add Gallery
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* The Editor Area */}
        <div className={`w-full py-4 ${isEditing ? 'px-6' : 'px-0'}`}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Action Toggle Button */}
      <div className="mt-8 flex justify-end">
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center justify-center gap-2 min-w-[148px] whitespace-nowrap px-5 py-2.5 bg-blue-600 hover:bg-blue-500 border border-transparent text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Save size={18} />
            Save Blog
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 min-w-[148px] whitespace-nowrap px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white rounded-full font-medium transition-colors"
          >
            <Edit3 size={18} />
            Edit Blog
          </button>
        )}
      </div>
    </div>
  )
}
