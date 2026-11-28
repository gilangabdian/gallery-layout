# Gallery Layout

<p align="center">
<img src="https://raw.githubusercontent.com/gilangabdian/gallery-layout/main/playground/public/icon.svg" alt="Gallery Layout Logo" width="180" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/gallery-layout">
    <img src="https://img.shields.io/npm/v/gallery-layout?color=yellow" alt="NPM version">
  </a>
  <a href="https://www.npmjs.com/package/gallery-layout">
    <img src="https://img.shields.io/npm/dm/gallery-layout?color=orange" alt="NPM Downloads">
  </a>
</p>

Gallery Layout is a library for creating beautiful photo galleries. It is zero-dependency, lightweight, and framework-agnostic.


## Demo

For a live demo, please visit the [Gallery Layout Demo](https://gallery-layout-playground.vercel.app/)

## Installation

```bash
npm install gallery-layout
```

## Usage

This library is suitable for you if you want to use it with Vanilla Javascript or with your preferred framework:

### Vanilla Javascript

To use the library, you need a container element, and then you just pass your images to the `createGallery` function

**Important:** Don't forget to import the CSS file!

```html
<!-- index.html -->
<div id="my-gallery"></div>
```

```javascript
// main.js
import { createGallery } from 'gallery-layout'
import 'gallery-layout/style.css' // Required for styling!

const container = document.getElementById('my-gallery')

const images = [
  { src: '/photo1.jpg', alt: 'Beautiful scenery', title: 'Kyoto Trip' },
  { src: '/photo2.jpg', alt: 'City night', title: 'Tokyo Vibes' },
]

createGallery(container, {
  layout: 'grid', // 'grid' or 'scroll'
  size: 'medium', // 'small', 'medium', 'large'
  images: images,
  captions: true, // Show titles under images
  lightbox: true, // Enable click to zoom
})
```

### React & Next.js

Using it in React requires a `useRef` and a `useEffect` since this library interacts directly with the DOM

```tsx
import { useEffect, useRef } from 'react'
import { createGallery } from 'gallery-layout'
import 'gallery-layout/style.css'

export default function MyGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    createGallery(containerRef.current, {
      layout: 'scroll',
      size: 'large',
      images: [
        { src: '/photo1.jpg', alt: 'Photo 1', title: 'title one' },
        { src: '/photo2.jpg', alt: 'Photo 2', title: 'title two' },
      ],
    })
  }, [])

  return <div ref={containerRef}></div>
}
```

### Vue

Using it in Vue requires a template `ref` and the `onMounted` lifecycle hook

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { createGallery } from 'gallery-layout'
import 'gallery-layout/style.css'

const galleryContainer = ref(null)

onMounted(() => {
  if (galleryContainer.value) {
    createGallery(galleryContainer.value, {
      layout: 'scroll',
      size: 'large',
      images: [
        { src: '/photo1.jpg', alt: 'Photo 1', title: 'title one' },
        { src: '/photo2.jpg', alt: 'Photo 2', title: 'title two' },
      ],
    })
  }
})
</script>

<template>
  <div ref="galleryContainer"></div>
</template>
```

### Svelte

Using it in Svelte requires the `bind:this` directive and the `onMount` lifecycle hook

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

## API

### 1. `GalleryImage` (Array of Images)

Every image object passed to the gallery must follow this structure:

| Property | Type     | Default     | Required | Description                                         |
| -------- | -------- | ----------- | -------- | --------------------------------------------------- |
| `src`    | `string` | -           | **Yes**  | URL of the image                                    |
| `alt`    | `string` | -           | **Yes**  | Accessibility description for screen readers        |
| `title`  | `string` | `undefined` | No       | Text displayed as the caption (if `captions: true`) |

### 2. `GalleryOptions` (Core Configuration)

The `createGallery(container, options)` function accepts the following options:

| Option            | Type                                                                                                                                                                                                                                                 | Default           | Description                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------- |
| `images`          | `GalleryImage[]`                                                                                                                                                                                                                                     | -                 | **(Required)** Array of image objects to display              |
| `layout`          | `"scroll" \| "grid"`                                                                                                                                                                                                                                 | `"scroll"`        | The core arrangement behavior of the gallery                  |
| `size`            | `"extra-small" \| "small" \| "medium" \| "large" \| "extra-large" \| string`                                                                                                                                                                         | `"medium"`        | Visual size scale of the gallery                              |
| `captions`        | `boolean`                                                                                                                                                                                                                                            | `false`           | If `true`, renders the image `title` as a visible caption     |
| `captionPosition` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right" \| "overlay-top-left" \| "overlay-top-center" \| "overlay-top-right" \| "overlay-bottom-left" \| "overlay-bottom-center" \| "overlay-bottom-right"` | `"bottom-center"` | Position of the caption relative to the image                 |
| `captionSize`     | `string`                                                                                                                                                                                                                                             | `undefined`       | Custom CSS font size for captions (e.g. `14px`, `0.9rem`)     |
| `lightbox`        | `boolean`                                                                                                                                                                                                                                            | `false`           | Enables a built-in click-to-zoom fullscreen lightbox          |
| `lazyLoad`        | `boolean`                                                                                                                                                                                                                                            | `true`            | Automatically adds `loading="lazy"` to all images             |
| `align`           | `"left" \| "center" \| "right"`                                                                                                                                                                                                                      | `undefined`       | Alignment of the entire gallery container                     |
| `snap`            | `boolean`                                                                                                                                                                                                                                            | `true`            | Enables CSS scroll-snapping (only applies to `scroll` layout) |
| `gap`             | `string`                                                                                                                                                                                                                                             | `undefined`       | Custom CSS gap overrides (e.g. `16px`)                        |
| `radius`          | `boolean \| string`                                                                                                                                                                                                                                  | `undefined`       | Custom CSS border-radius overrides                            |
| `aspectRatio`     | `string`                                                                                                                                                                                                                                             | `undefined`       | Custom aspect ratio overrides (e.g. `16/9`)                   |
| `columns`         | `number \| object`                                                                                                                                                                                                                                   | `undefined`       | Fixed column count overrides (only applies to `grid` layout)  |
| `pointer`         | `boolean`                                                                                                                                                                                                                                            | `false`           | Forces a pointer cursor over images                           |

## CSS Customization

You can customize the appearance of overlay captions (any `captionPosition` starting with `overlay-`, such as `overlay-top-left` or `overlay-bottom-center`) using CSS custom properties on `:root`, `.gallery-layout`, or a specific gallery container:

| CSS Variable                    | Default               | Description                                                                   |
| ------------------------------- | --------------------- | ----------------------------------------------------------------------------- |
| `--gallery-overlay-bg`          | `rgba(0, 0, 0, 0.6)`  | Background of overlay captions (set to `transparent` to remove the backdrop) |
| `--gallery-overlay-color`       | `white`               | Text color of overlay captions                                                |
| `--gallery-overlay-text-shadow` | `none`                | Text shadow for overlay captions (useful when using a transparent background) |

```css
/* Remove overlay caption background */
.gallery-layout {
  --gallery-overlay-bg: transparent;
  --gallery-overlay-text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

/* Or use a custom overlay color */
.gallery-layout {
  --gallery-overlay-bg: rgba(15, 23, 42, 0.75);
  --gallery-overlay-color: #f8fafc;
}
```

## License

MIT
