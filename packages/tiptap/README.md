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

<video width="100%" controls playsinline>
  <source src="https://github.com/gilangabdian/gallery-layout/raw/main/playground/public/demo.mp4" type="video/mp4" />
</video>

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
- **Toggle Features**: Turn captions and the lightbox on or off on the fly
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
| `defaultLightbox`    | `boolean`                                                          | `false`     | Default toggle state for the lightbox                                                    |
| `defaultGap`         | `string`                                                           | `"16px"`    | Default CSS gap between images                                                           |
| `defaultRadius`      | `string`                                                           | `"4px"`     | Default CSS border-radius for images                                                     |
| `defaultCaptionSize` | `string`                                                           | `"14px"`    | Default CSS font size for captions                                                       |
| `defaultAspectRatio` | `string`                                                           | `"auto"`    | Default CSS aspect ratio                                                                 |
| `HTMLAttributes`     | `object`                                                           | `{}`        | Custom HTML attributes to add to the rendered node                                       |
| `onUpload`           | `(files: File[]) => Promise<string[]>`                             | `undefined` | Callback for handling image uploads. If provided, overrides the default Base64 fallback. |

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

#### Compatibility Rules

When changing logic or adding new features to the Tiptap integration, you must ensure that your changes remain fully compatible with **Tiptap v2.0.0**. Do not introduce APIs or methods that are only available in experimental/newer versions unless absolutely necessary, to prevent breaking changes for existing users.

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
