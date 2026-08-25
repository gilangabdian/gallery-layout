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

      // Only add UI if the editor is editable
      let toolbar: HTMLDivElement | null = null
      if (editor.isEditable) {
        // Inject styles for the toolbar
        const style = document.createElement('style')
        style.innerHTML = `
          .tiptap-gallery-nodeview .gallery-toolbar {
            position: absolute;
            top: 12px; right: 12px;
            z-index: 50;
            display: none;
            background: rgba(20, 20, 20, 0.8);
            padding: 6px;
            border-radius: 8px;
            gap: 6px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .ProseMirror-selectednode .gallery-toolbar {
            display: flex;
          }
          .gallery-toolbar button {
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 12px;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s;
          }
          .gallery-toolbar button:hover { 
            background: rgba(255, 255, 255, 0.1); 
            color: white;
          }
          .gallery-toolbar button.active { 
            background: white; 
            color: black; 
            font-weight: 500; 
          }
          .gallery-toolbar .divider {
            width: 1px;
            background: rgba(255, 255, 255, 0.2);
            margin: 4px;
          }
        `
        container.appendChild(style)

        // Create the toolbar container
        toolbar = document.createElement('div')
        toolbar.classList.add('gallery-toolbar')
        container.appendChild(toolbar)

        // Helper to create buttons
        const createButton = (label: string, isActive: boolean, onClick: () => void) => {
          const btn = document.createElement('button')
          btn.textContent = label
          if (isActive) btn.classList.add('active')
          btn.addEventListener('click', (e) => {
            e.preventDefault()
            onClick()
          })
          return btn
        }

        const renderToolbarButtons = () => {
          if (!toolbar) return
          toolbar.innerHTML = ''
          
          // Layout Buttons
          toolbar.appendChild(createButton('Scroll', node.attrs.layout === 'scroll', () => {
            if (typeof getPos === 'function') {
              editor.chain().focus().updateAttributes(this.name, { layout: 'scroll' }).run()
            }
          }))
          toolbar.appendChild(createButton('Grid', node.attrs.layout === 'grid', () => {
            if (typeof getPos === 'function') {
              editor.chain().focus().updateAttributes(this.name, { layout: 'grid' }).run()
            }
          }))

          // Divider
          const divider = document.createElement('div')
          divider.classList.add('divider')
          toolbar.appendChild(divider)

          // Size Buttons
          toolbar.appendChild(createButton('S', node.attrs.size === 'small', () => {
            if (typeof getPos === 'function') {
              editor.chain().focus().updateAttributes(this.name, { size: 'small' }).run()
            }
          }))
          toolbar.appendChild(createButton('M', node.attrs.size === 'medium', () => {
            if (typeof getPos === 'function') {
              editor.chain().focus().updateAttributes(this.name, { size: 'medium' }).run()
            }
          }))
          toolbar.appendChild(createButton('L', node.attrs.size === 'large', () => {
            if (typeof getPos === 'function') {
              editor.chain().focus().updateAttributes(this.name, { size: 'large' }).run()
            }
          }))
        }

        // Initial render
        renderToolbarButtons()
      }

      const options: GalleryOptions = {
        images: node.attrs.images,
        layout: node.attrs.layout,
        size: node.attrs.size,
        lightbox: false, 
        pointer: false   
      }

      createGallery(galleryWrapper, options)

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) {
            return false
          }
          
          // Re-render gallery if attributes change
          galleryWrapper.innerHTML = ''
          const newOptions: GalleryOptions = {
            images: updatedNode.attrs.images,
            layout: updatedNode.attrs.layout,
            size: updatedNode.attrs.size,
            lightbox: false,
            pointer: false
          }
          createGallery(galleryWrapper, newOptions)
          
          // Re-render toolbar buttons to update active states
          if (toolbar && editor.isEditable) {
            // Need to update the closure reference to the new node to correctly check attrs
            node = updatedNode
            // Clear entire toolbar to prevent divider duplication
            toolbar.innerHTML = ''
            
            const createBtn = (label: string, isActive: boolean, layoutOrSize: any, isSize: boolean) => {
              const btn = document.createElement('button')
              btn.textContent = label
              if (isActive) btn.classList.add('active')
              btn.addEventListener('click', (e) => {
                e.preventDefault()
                if (typeof getPos === 'function') {
                  if (isSize) {
                    editor.chain().focus().updateAttributes(this.name, { size: layoutOrSize }).run()
                  } else {
                    editor.chain().focus().updateAttributes(this.name, { layout: layoutOrSize }).run()
                  }
                }
              })
              return btn
            }

            toolbar.appendChild(createBtn('Scroll', updatedNode.attrs.layout === 'scroll', 'scroll', false))
            toolbar.appendChild(createBtn('Grid', updatedNode.attrs.layout === 'grid', 'grid', false))
            
            const divider = document.createElement('div')
            divider.classList.add('divider')
            toolbar.appendChild(divider)
            
            toolbar.appendChild(createBtn('S', updatedNode.attrs.size === 'small', 'small', true))
            toolbar.appendChild(createBtn('M', updatedNode.attrs.size === 'medium', 'medium', true))
            toolbar.appendChild(createBtn('L', updatedNode.attrs.size === 'large', 'large', true))
          }
          
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
