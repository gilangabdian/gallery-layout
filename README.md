# Gallery Layout
<p align="center">
<img src="./playground/public/icon.svg" alt="Gallery Layout Logo" width="180" />
</p>

Gallery Layout is a library for creating beautiful photo galleries. It is zero-dependency, lightweight, and framework-agnostic.

I purposely created the gallery layout to make it easier if you want to design a blog and on the blog you want a collection of beautiful images. It also supports projects that use <a href="https://tiptap.dev">Tiptap</a>.

## Demo
For a live demo, please visit the [Gallery Layout Demo](https://gallery-layout.vercel.app).

## Installation
Use the installation via the core library if you want to use it freely:
```bash
pnpm add gallery-layout
```
for core library usage see [Core Library Usage](#core-library-usage)

<br>

Use the installation via the Tiptap extension if you want to use it within the Tiptap library:
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
Tiptap extensions are for you if you use Tiptap rich text:

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


## API

## Contributing

## License
