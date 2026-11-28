# Tiptap Extension Gallery Layout

<p align="center">
<img src="https://raw.githubusercontent.com/gilangabdian/gallery-layout/main/playground/public/icon.svg" alt="Gallery Layout Logo" width="180" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tiptap-extension-gallery-layout">
    <img src="https://img.shields.io/npm/v/tiptap-extension-gallery-layout?color=yellow" alt="NPM version">
  </a>
  <a href="https://www.npmjs.com/package/tiptap-extension-gallery-layout">
    <img src="https://img.shields.io/npm/dm/tiptap-extension-gallery-layout?color=orange" alt="NPM Downloads">
  </a>
</p>

Tiptap Extension Gallery Layout is a library for creating beautiful photo galleries inside <a href="https://tiptap.dev">Tiptap</a> rich text editor.


## Demo

For a live demo, please visit the [Gallery Layout Demo](https://gallery-layout-playground.vercel.app/)

## Installation

To use the Gallery within your Tiptap editor, you need to install the extension and several other libraries that are required for this project to work properly. You can install them by running the following command:

```bash
npm install tiptap-extension-gallery-layout gallery-layout @tiptap/core
```

> **Note:** `@tiptap/core` and `gallery-layout` are strictly required as Peer Dependencies for the extension to function properly

> **Compatibility:** This extension requires **Tiptap v2.0.0** or higher. It is not compatible with Tiptap v1.

## Usage

Tiptap extensions are for you if you use <a href="https://tiptap.dev">Tiptap rich text</a> in your project. I recommend using it if your project is already using <a href="https://tiptap.dev">Tiptap</a>, as there are several advantages to using it. You can check out those benefits [here](#built-in-interactive-toolbar)

### Quick Start

To use the Gallery within your Tiptap editor, simply add the `GalleryExtension` to your extensions list

> **Note:** This extension is built with pure Vanilla JavaScript, which means it is **100% framework-agnostic**. Whether you use Tiptap in React, Vue, Svelte, or Vanilla JS, the installation and command usage remain exactly the same

**Important:** You must also import the CSS from the core library for the gallery to render correctly!

#### Example (using React)

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// 1. Import the extension and the core CSS
import { GalleryExtension } from 'tiptap-extension-gallery-layout'
import 'gallery-layout/style.css'

export default function MyEditor() {
  // The way you initialize Tiptap depends on your framework
  const editor = useEditor({
    extensions: [
      StarterKit,
      // 2. Add it to your extensions array! Works the same in Vue/Svelte.
      GalleryExtension.configure({
        // Handle image uploads securely to avoid Base64 performance issues
        onUpload: async (files) => {
          // Example: Upload to your own server/S3 and return the URL array
          // const urls = await myServerUploadService(files);
          // return urls;

          // For prototyping, you can use ObjectURLs:
          return files.map((file) => URL.createObjectURL(file))
        },
      }),
    ],
    content: '<p>Write your amazing story here...</p>',
  })

  // 3. Command to insert a gallery programmatically (Identical across all frameworks)
  const insertMyGallery = () => {
    if (!editor) return

    const myImages = [
      { src: '/photo1.jpg', alt: 'Mountain', title: 'Everest' },
      { src: '/photo2.jpg', alt: 'River', title: 'Amazon' },
    ]

    editor.chain().focus().insertGallery(myImages).run()
  }

  return (
    <div>
      <button onClick={insertMyGallery}>Insert Gallery</button>
      <EditorContent editor={editor} />
    </div>
  )
}
```

### Built-in Interactive Toolbar

The best part about the Tiptap extension is its **built-in NodeView Toolbar**

Once a gallery is inserted, simply click on it inside the editor. A beautiful floating toolbar and settings panel will appear, allowing you and your users to:

- **Add Images**: Add new images to an existing gallery on the fly via the `+ Image` button. This feature includes a custom modal ensuring every new image has proper **Alt Text** for accessibility
  - _How Image Upload Works_: By default, if a user clicks `+ Image`, the library converts the selected files into **Base64** strings. However, Base64 is highly discouraged in production as it bloats database size and degrades editor performance.
  - _Best Practice (The `onUpload` API)_: To securely upload images to your own server (e.g., AWS S3, Cloudinary), you should provide an `onUpload` callback in the extension options. When provided, the library hands the files over to your function and waits for you to return the final image URLs!
- **Change Layouts**: Switch between `scroll` and `grid` layouts instantly
- **Adjust Sizes**: Pick from preset sizes (`extra-small`, `small`, `medium`, `large`, `extra-large`), or set a **Custom width**
- **Alignment**: Automatically appears when using Custom Width, allowing you to align the gallery container to the `left`, `center`, or `right` of the article
- **Edit Titles**: Add or change the title directly for each image
- **Toggle Features**: Turn captions, lightbox, and optional prev/next lightbox navigation on or off on the fly
- **Caption Position**: Choose from 12 different positions (e.g., `top-left`, `overlay-bottom-center`)
- **Caption Size**: Adjust the font size of the captions
- **Layout-Specific Options**:
  - **Snap Scroll**: (For `scroll` layout) Enable or disable smooth CSS scroll-snapping so images always perfectly align to the center/edge when swiping
  - **Columns**: (For `grid` layout) Force a specific number of columns instead of using the automatic responsive grid
- **Styling Overrides**: Set custom CSS aspect ratios (e.g. `16/9`), image gaps, and border radius
- **Hover Pointer**: Force the mouse cursor to a pointer when hovering over images to indicate clickability (useful if lightbox is on)
- **Delete Images**: Remove individual images easily

You don't need to build any custom UI to manage the gallery's appearance; it's completely handled by the extension

## API

If you use the Tiptap extension, you can pass default configurations when registering the extension. These act as the fallback values for all gallery nodes in your editor

| Option               | Type                                                               | Default     | Description                                                                              |
| -------------------- | ------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------- |
| `defaultLayout`      | `"scroll" \| "grid"`                                               | `"scroll"`  | The layout applied to newly inserted galleries                                           |
| `defaultSize`        | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"medium"`  | The size applied to newly inserted galleries                                             |
| `defaultAlign`       | `"left" \| "center" \| "right"`                                    | `"left"`    | Default alignment for the gallery container                                              |
| `defaultCaptions`    | `boolean`                                                          | `true`      | Default toggle state for captions                                                        |
| `defaultLightbox`           | `boolean`                                                          | `false`     | Default toggle state for the lightbox                                                    |
| `defaultLightboxNavigation` | `boolean`                                                          | `false`     | Default toggle state for prev/next lightbox navigation (applies when lightbox is enabled)|
| `defaultGap`         | `string`                                                           | `"16px"`    | Default CSS gap between images                                                           |
| `defaultRadius`      | `string`                                                           | `"4px"`     | Default CSS border-radius for images                                                     |
| `defaultCaptionSize` | `string`                                                           | `"14px"`    | Default CSS font size for captions                                                       |
| `defaultAspectRatio` | `string`                                                           | `"auto"`    | Default CSS aspect ratio                                                                 |
| `HTMLAttributes`     | `object`                                                           | `{}`        | Custom HTML attributes to add to the rendered node                                       |
| `onUpload`           | `(files: File[]) => Promise<string[]>`                             | `undefined` | Callback for handling image uploads. If provided, overrides the default Base64 fallback. |

## CSS Customization

Because this extension uses `gallery-layout/style.css`, you can customize overlay captions (any `captionPosition` starting with `overlay-`) directly in your app's CSS using custom properties on `:root`, `.gallery-layout`, or your editor wrapper:

```css
.gallery-layout {
  --gallery-overlay-bg: transparent;
  --gallery-overlay-text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}
```

For the full list of supported CSS variables, see the [`gallery-layout` documentation](https://www.npmjs.com/package/gallery-layout#css-customization).

## License

MIT
