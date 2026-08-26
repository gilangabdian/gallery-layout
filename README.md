# Gallery Layout
<p align="center">
<img src="./playground/public/icon.svg" alt="Gallery Layout Logo" width="180" />
</p>

Gallery Layout is a library for creating beautiful photo galleries. It is zero-dependency, lightweight, and framework-agnostic.

I got the inspiration for this project from reading <a href="https://antfu.me/posts/hello-tokyo">antfu's blog</a>. It featured a beautiful gallery layout, so I wanted to create a project that people could use without having to build it from scratch. Currently, there are only 2 layout styles, each with its own settings, namely scroll layout and grid layout. It also supports projects that use <a href="https://tiptap.dev">Tiptap</a>.

## Demo
For a live demo, please visit the [Gallery Layout Demo](https://gallery-layout.vercel.app).

## Installation
Use the installation via the core library if you want to use it freely:
```bash
pnpm add gallery-layout
```
for core library usage see [Core Library Usage](#core-library-usage)

<br>

Use the installation via the Tiptap extension if you want to use it within the <a href="https://tiptap.dev">Tiptap</a> library:
```bash
pnpm add tiptap-extension-gallery-layout
```
for tiptap extension usage, see [Tiptap Extension Usage](#tiptap-extension-usage)

## Core Library Usage
This core library is suitable for you if you don't use Tiptap's rich text features and want to use it with Vanilla Javascript or with your preferred framework:

### Vanilla Javascript

To use the core library, you need a container element, and then you just pass your images to the `createGallery` function.

**Important:** Don't forget to import the CSS file!

```html
<!-- index.html -->
<div id="my-gallery"></div>
```

```javascript
// main.js
import { createGallery } from 'gallery-layout';
import 'gallery-layout/style.css'; // Required for styling!

const container = document.getElementById('my-gallery');

const images = [
  { src: '/photo1.jpg', alt: 'Beautiful scenery', title: 'Kyoto Trip' },
  { src: '/photo2.jpg', alt: 'City night', title: 'Tokyo Vibes' },
];

createGallery(container, {
  layout: 'grid', // 'grid' or 'scroll'
  size: 'medium', // 'small', 'medium', 'large'
  images: images,
  captions: true, // Show titles under images
  lightbox: true  // Enable click to zoom
});
```

### React & Next.js

Using it in React requires a `useRef` and a `useEffect` since this library interacts directly with the DOM.

```tsx
import { useEffect, useRef } from 'react';
import { createGallery } from 'gallery-layout';
import 'gallery-layout/style.css';

export default function MyGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    createGallery(containerRef.current, {
      layout: 'scroll',
      size: 'large',
      images: [
        { src: '/photo1.jpg', alt: 'Photo 1', title:'title one' },
        { src: '/photo2.jpg', alt: 'Photo 2', title:'title two' },
      ],
    });
  }, []);

  return <div ref={containerRef}></div>;
}
```

### Vue

Using it in Vue requires a template `ref` and the `onMounted` lifecycle hook.

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { createGallery } from 'gallery-layout';
import 'gallery-layout/style.css';

const galleryContainer = ref(null);

onMounted(() => {
  if (galleryContainer.value) {
    createGallery(galleryContainer.value, {
      layout: 'scroll',
      size: 'large',
      images: [
        { src: '/photo1.jpg', alt: 'Photo 1', title:'title one' },
        { src: '/photo2.jpg', alt: 'Photo 2', title:'title two' },
      ],
    });
  }
});
</script>

<template>
  <div ref="galleryContainer"></div>
</template>
```

### Svelte

Using it in Svelte requires the `bind:this` directive and the `onMount` lifecycle hook.

```svelte
<script>
  import { onMount } from 'svelte';
  import { createGallery } from 'gallery-layout';
  import 'gallery-layout/style.css';

  let galleryContainer;

  onMount(() => {
    if (galleryContainer) {
      createGallery(galleryContainer, {
        layout: 'scroll',
        size: 'large',
        images: [
          { src: '/photo1.jpg', alt: 'Photo 1', title:'title one' },
          { src: '/photo2.jpg', alt: 'Photo 2', title:'title two' },
        ],
      });
    }
  });
</script>

<div bind:this={galleryContainer}></div>
```


## Tiptap Extension Usage
Tiptap extensions are for you if you use <a href="https://tiptap.dev">Tiptap rich text</a>. You don't actually have to use the Tiptap rich text extension, but I recommend it if your project is already using <a href="https://tiptap.dev">Tiptap</a>, as there are several advantages to doing so—you can check out those benefits [here](#built-in-interactive-toolbar):

### Quick Start

To use the Gallery within your Tiptap editor, simply add the `GalleryExtension` to your extensions list.

> **Note:** This extension is built with pure Vanilla JavaScript, which means it is **100% framework-agnostic**. Whether you use Tiptap in React, Vue, Svelte, or Vanilla JS, the installation and command usage remain exactly the same!

**Important:** You must also import the CSS from the core library for the gallery to render correctly!

#### Example (using React)

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// 1. Import the extension and the core CSS
import { GalleryExtension } from 'tiptap-extension-gallery-layout';
import 'gallery-layout/style.css';

export default function MyEditor() {
  // The way you initialize Tiptap depends on your framework
  const editor = useEditor({
    extensions: [
      StarterKit,
      GalleryExtension, // 2. Add it to your extensions array! Works the same in Vue/Svelte.
    ],
    content: '<p>Write your amazing story here...</p>',
  });

  // 3. Command to insert a gallery programmatically (Identical across all frameworks)
  const insertMyGallery = () => {
    if (!editor) return;

    const myImages = [
      { src: '/photo1.jpg', alt: 'Mountain', title: 'Everest' },
      { src: '/photo2.jpg', alt: 'River', title: 'Amazon' }
    ];

    editor.chain().focus().insertGallery(myImages).run();
  };

  return (
    <div>
      <button onClick={insertMyGallery}>Insert Gallery</button>
      <EditorContent editor={editor} />
    </div>
  );
}
```

### Built-in Interactive Toolbar
The best part about the Tiptap extension is its **built-in NodeView Toolbar**.

Once a gallery is inserted, simply click on it inside the editor. A beautiful floating toolbar and settings panel will appear, allowing you and your users to:
- **Change Layouts**: Switch between `scroll` and `grid` layouts instantly.
- **Adjust Sizes**: Pick from preset sizes (`extra-small`, `small`, `medium`, `large`, `extra-large`), or set a **Custom width**.
- **Alignment**: Automatically appears when using Custom Width, allowing you to align the gallery container to the `left`, `center`, or `right` of the article.
- **Edit Titles**: Add or change the title directly for each image.
- **Toggle Features**: Turn captions and the lightbox on or off on the fly.
- **Caption Position**: Choose from 12 different positions (e.g., `top-left`, `overlay-bottom-center`).
- **Caption Size**: Adjust the font size of the captions.
- **Layout-Specific Options**:
  - **Snap Scroll**: (For `scroll` layout) Enable or disable smooth CSS scroll-snapping so images always perfectly align to the center/edge when swiping.
  - **Columns**: (For `grid` layout) Force a specific number of columns instead of using the automatic responsive grid.
- **Styling Overrides**: Set custom CSS aspect ratios (e.g. `16/9`), image gaps, and border radius.
- **Hover Pointer**: Force the mouse cursor to a pointer when hovering over images to indicate clickability (useful if lightbox is on).
- **Delete Images**: Remove individual images easily.

You don't need to build any custom UI to manage the gallery's appearance; it's completely handled by the extension.


## API

### 1. `GalleryImage` (Array of Images)
Every image object passed to the gallery must follow this structure:

| Property | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | - | **Yes** | URL of the image. |
| `alt` | `string` | - | **Yes** | Accessibility description for screen readers. |
| `title` | `string` | `undefined` | No | Text displayed as the caption (if `captions: true`). |

### 2. `GalleryOptions` (Core Configuration)
The `createGallery(container, options)` function accepts the following options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `images` | `GalleryImage[]` | - | **(Required)** Array of image objects to display. |
| `layout` | `"scroll" \| "grid"` | `"scroll"` | The core arrangement behavior of the gallery. |
| `size` | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| string` | `"medium"` | Visual size scale of the gallery. |
| `captions` | `boolean` | `false` | If `true`, renders the image `title` as a visible caption. |
| `captionPosition` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right" \| "overlay-top-left" \| "overlay-top-center" \| "overlay-top-right" \| "overlay-bottom-left" \| "overlay-bottom-center" \| "overlay-bottom-right"` | `"bottom-center"` | Position of the caption relative to the image. |
| `lightbox` | `boolean` | `false` | Enables a built-in click-to-zoom fullscreen lightbox. |
| `lazyLoad` | `boolean` | `true` | Automatically adds `loading="lazy"` to all images. |
| `align` | `"left" \| "center" \| "right"` | `undefined` | Alignment of the entire gallery container. |
| `snap` | `boolean` | `true` | Enables CSS scroll-snapping (only applies to `scroll` layout). |
| `gap` | `string` | `undefined` | Custom CSS gap overrides (e.g. `16px`). |
| `radius` | `boolean \| string` | `undefined` | Custom CSS border-radius overrides. |
| `aspectRatio` | `string` | `undefined` | Custom aspect ratio overrides (e.g. `16/9`). |
| `columns` | `number \| object` | `undefined` | Fixed column count overrides (only applies to `grid` layout). |
| `pointer` | `boolean` | `false` | Forces a pointer cursor over images. |

### 3. Tiptap Extension Options
If you use the Tiptap extension, you can pass default configurations when registering the extension. These act as the fallback values for all gallery nodes in your editor.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultLayout` | `"scroll" \| "grid"` | `"scroll"` | The layout applied to newly inserted galleries. |
| `defaultSize` | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large"` | `"medium"` | The size applied to newly inserted galleries. |
| `defaultAlign` | `"left" \| "center" \| "right"` | `"left"` | Default alignment for the gallery container. |
| `defaultCaptions` | `boolean` | `true` | Default toggle state for captions. |
| `defaultLightbox` | `boolean` | `false` | Default toggle state for the lightbox. |
| `defaultGap` | `string` | `"16px"` | Default CSS gap between images. |
| `defaultRadius` | `string` | `"4px"` | Default CSS border-radius for images. |
| `defaultCaptionSize` | `string` | `"14px"` | Default CSS font size for captions. |
| `defaultAspectRatio` | `string` | `"auto"` | Default CSS aspect ratio. |
| `HTMLAttributes` | `object` | `{}` | Custom HTML attributes to add to the rendered node. |
| `onUpload` | `(files: File[]) => Promise<string[]>` | `undefined` | Callback for handling image uploads. If provided, overrides the default Base64 fallback. |


## Contributing

## License
