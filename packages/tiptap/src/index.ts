import { Node, mergeAttributes } from '@tiptap/core'
import { createGallery, type GalleryOptions, type GalleryImage } from 'gallery-layout'

export interface GalleryExtensionOptions {
  defaultLayout: 'scroll' | 'grid'
  defaultSize: 'small' | 'medium' | 'large'
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    galleryLayout: {
      insertGallery: (images: GalleryImage[]) => ReturnType
      setGalleryLayout: (layout: 'scroll' | 'grid') => ReturnType
      setGallerySize: (size: 'small' | 'medium' | 'large') => ReturnType
    }
  }
}

export const GalleryExtension = Node.create<GalleryExtensionOptions>({
  name: 'galleryLayout',
  group: 'block',
  atom: true, // It is an atom block because it's managed by gallery-layout internally

  addOptions() {
    return {
      defaultLayout: 'scroll',
      defaultSize: 'medium',
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => JSON.parse(element.getAttribute('data-images') || '[]'),
        renderHTML: attributes => {
          return { 'data-images': JSON.stringify(attributes.images) }
        }
      },
      layout: {
        default: this.options.defaultLayout,
        parseHTML: element => element.getAttribute('data-layout'),
        renderHTML: attributes => {
          return { 'data-layout': attributes.layout }
        }
      },
      size: {
        default: this.options.defaultSize,
        parseHTML: element => element.getAttribute('data-size'),
        renderHTML: attributes => {
          return { 'data-size': attributes.size }
        }
      }
    }
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="gallery-layout"]' }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'gallery-layout' })]
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      // Create the main container for the node view
      const container = document.createElement('div')
      container.classList.add('tiptap-gallery-nodeview')
      container.style.position = 'relative'

      // We need a wrapper specifically for the gallery-layout to mount into
      const galleryWrapper = document.createElement('div')
      container.appendChild(galleryWrapper)

      const options: GalleryOptions = {
        images: node.attrs.images,
        layout: node.attrs.layout,
        size: node.attrs.size,
        // Ensure some defaults for the editor experience
        lightbox: false, // Maybe we don't want lightbox inside the editor
        pointer: false   // Disable pointer interactions that might conflict with editor selection
      }

      // Initialize the Vanilla JS gallery
      createGallery(galleryWrapper, options)

      // In a real advanced extension, you'd add a floating UI toolbar here to change layout/size.
      // For now, we rely on the editor commands provided below.

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) {
            return false
          }
          
          // If attributes changed, we re-render the gallery
          galleryWrapper.innerHTML = ''
          const newOptions: GalleryOptions = {
            images: updatedNode.attrs.images,
            layout: updatedNode.attrs.layout,
            size: updatedNode.attrs.size,
            lightbox: false,
            pointer: false
          }
          createGallery(galleryWrapper, newOptions)
          return true
        }
      }
    }
  },

  addCommands() {
    return {
      insertGallery: (images: GalleryImage[]) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { images }
        })
      },
      setGalleryLayout: (layout: 'scroll' | 'grid') => ({ commands }) => {
        return commands.updateAttributes(this.name, { layout })
      },
      setGallerySize: (size: 'small' | 'medium' | 'large') => ({ commands }) => {
        return commands.updateAttributes(this.name, { size })
      }
    }
  }
})
