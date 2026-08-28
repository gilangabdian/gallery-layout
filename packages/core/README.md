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

<video width="100%" controls playsinline>
  <source src="https://github.com/gilangabdian/gallery-layout/raw/main/playground/public/demo.mp4" type="video/mp4" />
</video>

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
| `lightbox`        | `boolean`                                                                                                                                                                                                                                            | `false`           | Enables a built-in click-to-zoom fullscreen lightbox          |
| `lazyLoad`        | `boolean`                                                                                                                                                                                                                                            | `true`            | Automatically adds `loading="lazy"` to all images             |
| `align`           | `"left" \| "center" \| "right"`                                                                                                                                                                                                                      | `undefined`       | Alignment of the entire gallery container                     |
| `snap`            | `boolean`                                                                                                                                                                                                                                            | `true`            | Enables CSS scroll-snapping (only applies to `scroll` layout) |
| `gap`             | `string`                                                                                                                                                                                                                                             | `undefined`       | Custom CSS gap overrides (e.g. `16px`)                        |
| `radius`          | `boolean \| string`                                                                                                                                                                                                                                  | `undefined`       | Custom CSS border-radius overrides                            |
| `aspectRatio`     | `string`                                                                                                                                                                                                                                             | `undefined`       | Custom aspect ratio overrides (e.g. `16/9`)                   |
| `columns`         | `number \| object`                                                                                                                                                                                                                                   | `undefined`       | Fixed column count overrides (only applies to `grid` layout)  |
| `pointer`         | `boolean`                                                                                                                                                                                                                                            | `false`           | Forces a pointer cursor over images                           |

## Contributing

Thank you for your interest in contributing to this project. All your contributions are very valuable and will make this project better, more developed and reliable. I truly appreciate your ideas and effort 😄🎉

You can contribute in the following ways:

### Reporting bugs

You can report bugs via issues. Please keep the following in mind when reporting a bug:

- Check existing issues first to see if a similar one has already been reported; if so, it is better to support that issue (e.g., by commenting or adding a reaction) rather than creating a duplicate
- Try to convey the bug in clear language, you can also insert photos, videos, or gifs to support the issue
- If possible, provide instructions on how to reproduce the issue
- If possible, provide steps to fix the issue

### Pull Requests

You are welcome to submit Pull Requests. For instance, if you have an idea you would like to see implemented in the project, you can submit a PR. You can also submit a PR to fix typos or address incomplete explanations in this `README.md`. Before submitting a PR, please note the following:

#### Project Structure

This project uses a monorepo structure; all project code logic resides in the `/packages` folder. Inside, you will find a `core/` folder containing the core library logic and a `tiptap/` folder containing the Tiptap integration logic

#### Testing

This project uses Vitest for testing. After editing or adding a feature, I highly recommend updating existing unit tests or creating new ones related to your changes to ensure no errors arise during usage.
The `test` folders located within `core/` and `tiptap/` are where the respective test files for each library are stored.
To run the test, run this command in the root folder

```bash
pnpm test:run
```

#### Linting

We use <a href="https://prettier.io/">Prettier</a> to format all code. To lint all your code, you can run in the root folder:

```bash
pnpm lint
```

If you encounter errors, you can run the Prettier auto-fix using:

```bash
pnpm lint-fix
```

> **Note**: Not all rules can be auto-fixed, some require manual changes

#### Type Checking

We use TypeScript for the entire codebase; therefore, you need to ensure the code is free of type errors by running this command in the root folder

```bash
pnpm typecheck
```

### Development Setup

1. Fork this repository
1. Clone your fork repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/gallery-layout.git
   ```

1. Create a new branch by running

   ```bash
   git checkout -b your-branch-name
   ```

1. Install dependencies in the root folder

   ```bash
   pnpm install
   ```

1. To run the demo playground, run `pnpm dev` in the root folder, it automatically runs `pnpm dev` in `/playground` folder too.

   > **Note**: Leave this terminal running and open a new terminal tab for the next steps

1. Make your desired changes, and don't forget to edit or add tests. Refer to the Testing section for instructions on how to run tests

1. Run linting in the root folder to make sure there are no linting errors

   ```bash
   pnpm lint
   ```

1. Run type checking in the root folder to make sure there are no type errors

   ```bash
   pnpm typecheck
   ```

1. Once you are satisfied with your changes, commit them to the branch you created:

   ```bash
   git add .
   git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
   ```

1. Push to the remote and create a PR:

   ```bash
   git push origin HEAD
   ```

On your GitHub page, click the "Compare & Pull Request" button (usually available immediately), target the project's `main` branch, and click "Create Pull Request"

Once again, thank you for your contribution

## License

MIT
