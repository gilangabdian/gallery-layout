# Gallery Layout — Agent Instructions

## Project Overview

Gallery Layout is a small, framework-agnostic TypeScript library for displaying images as **editorial galleries for blogs, articles, and long-form visual content**.

The project is inspired by editorial blog layouts where multiple photographs are presented together in a horizontal, scrollable strip with optional captions.

The core goal is:

> Make a group of images feel like part of a written story rather than just a generic image gallery.

The library is intended to eventually support integrations such as Tiptap, React, and other frameworks, but those integrations are **not part of the MVP**.

---

## Core Principle

Keep the library:

* small
* framework-agnostic
* accessible
* composable
* easy to customize
* focused on editorial image presentation

Do not add functionality merely because it could be useful.

Every feature should answer:

> Does this improve the core experience of presenting multiple photographs in long-form content?

---

# MVP Scope

The MVP focuses on one primary gallery experience:

```text
┌────────────┐  ┌────────────┐  ┌────────────┐  ─────→
│            │  │            │  │            │
│   image    │  │   image    │  │   image    │
│            │  │            │  │            │
└────────────┘  └────────────┘  └────────────┘
 caption         caption         caption
```

The MVP should support:

* multiple images
* horizontal scrolling
* responsive behavior
* image sizes (`small`, `medium`, `large`)
* configurable gaps
* optional captions/titles
* configurable caption position
* image click interaction
* an optional built-in lightbox
* keyboard-accessible interaction
* touch-friendly interaction
* lazy-loaded images
* semantic HTML
* TypeScript types
* CSS customization through CSS variables
* unit tests

The MVP should NOT include:

* Tiptap integration
* React integration
* Vue integration
* Svelte integration
* image uploading
* image storage
* image processing
* image editing
* authentication
* CMS functionality
* backend functionality
* analytics
* drag-and-drop image management
* masonry layout
* complex editorial layouts
* slideshow functionality
* image comparison
* video support
* server-side rendering-specific logic

These may be considered in future versions, but do not implement them unless explicitly requested.

---

# Architecture

The long-term architecture is:

```text
                    Gallery Core
                         │
              ┌──────────┴──────────┐
              │                     │
        Framework adapters     Editor adapters
              │                     │
           React                 Tiptap
           Vue                   etc.
```

The MVP only implements:

```text
Gallery Core
```

Do not introduce framework-specific dependencies into the core package.

The core library must work directly with browser APIs and standard DOM elements.

The primary API should remain framework-independent.

Example:

```ts
createGallery(element, options)
```

Do not make React a requirement for the core package.

---

# Technology Stack

Use:

* TypeScript
* native browser DOM APIs
* CSS
* pnpm
* tsdown
* Vite
* Vitest
* jsdom

Do not introduce another framework or build system without a clear reason.

Current development architecture:

```text
TypeScript
    │
    ▼
tsdown
    │
    ▼
dist/
```

The playground uses:

```text
Vite
```

Tests use:

```text
Vitest + jsdom
```

---

# Package Philosophy

The project is an npm library, not an application.

Code should therefore prioritize:

1. stable public APIs
2. small bundle size
3. tree-shakability
4. good TypeScript types
5. predictable DOM behavior
6. minimal dependencies
7. compatibility with different consumers

Do not introduce dependencies for functionality that can reasonably be implemented with browser APIs.

Before adding a dependency, ask:

> Can this be implemented cleanly without another dependency?

Prefer "yes" whenever practical.

---

# Source Structure

The project should initially remain simple:

```text
src/
├── gallery.ts
├── types.ts
├── styles.css
└── index.ts
```

As complexity grows, the code may be reorganized into:

```text
src/
├── core/
├── lightbox/
├── layouts/
├── styles/
├── utils/
├── types.ts
└── index.ts
```

Do not prematurely create a large architecture.

Refactor when the current structure becomes difficult to maintain.

---

# Public API

The public API should be intentionally small.

The library should expose something conceptually similar to:

```ts
createGallery(element, {
  images: [...],
  size: "medium",
  titles: true,
  lightbox: true
});
```

The exact API can evolve, but avoid exposing internal implementation details.

Do not expose DOM internals as part of the public API unless there is a strong reason.

Internal implementation should remain replaceable.

---

# Image Model

The basic image model should remain simple.

Example:

```ts
interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}
```

Do not add fields simply because they might be useful someday.

Potential future fields such as:

```ts
width
height
srcset
sizes
caption
credit
href
id
```

should only be introduced when there is an actual use case.

---

# Accessibility

Accessibility is part of the library's core requirements.

Images must have meaningful `alt` text supplied by the consumer.

Do not generate meaningless alt text automatically.

Interactive images must be keyboard accessible.

The lightbox must support:

* keyboard opening
* keyboard closing
* logical focus management
* Escape to close
* previous/next keyboard navigation when applicable

Do not rely exclusively on hover interactions.

Do not use non-semantic elements as interactive controls when a semantic HTML element exists.

Use semantic elements such as:

```html
<figure>
<img>
<figcaption>
<button>
```

whenever appropriate.

---

# Image Semantics

Prefer semantic markup.

A gallery item should generally resemble:

```html
<figure>
  <img />
  <figcaption>...</figcaption>
</figure>
```

Avoid unnecessary wrappers.

Do not use `<div>` everywhere when a semantic element communicates the purpose better.

---

# Image Loading

Images should use lazy loading where appropriate:

```html
<img loading="lazy">
```

Do not introduce custom image-loading systems during the MVP.

Do not assume that the library controls where images are hosted.

---

# Image Hosting

The library is responsible for **displaying images**, not storing them.

Do not implement:

* uploads
* S3 integration
* Cloudinary integration
* Supabase Storage
* image transformations
* image optimization services
* authentication

The consumer provides the image URL.

Example:

```ts
{
  src: "https://example.com/photo.jpg",
  alt: "A rainy Tokyo street"
}
```

---

# CSS Philosophy

The library must not require Tailwind CSS.

The library should provide its own styles.

Styles should use predictable class names and CSS custom properties where customization is useful.

Prefer:

```css
.gallery-layout {
  --gallery-gap: 16px;
  --gallery-radius: 0px;
}
```

over forcing consumers to override deeply nested selectors.

Avoid excessive specificity.

Do not use `!important` unless there is a documented and unavoidable reason.

---

# Styling Philosophy

The visual direction is:

* editorial
* minimal
* photographic
* calm
* suitable for long-form writing
* typography-conscious

Do not add decorative UI merely for visual novelty.

The gallery should support the surrounding article rather than overpower it.

The default design should be intentionally understated.

---

# Layout Philosophy

The primary MVP layout is a horizontally scrollable gallery.

Use native browser scrolling wherever possible.

Prefer CSS:

```css
overflow-x: auto;
scroll-snap-type: x mandatory;
```

over implementing a custom scrolling engine.

Do not recreate browser behavior unnecessarily.

The gallery should work naturally with:

* mouse
* trackpad
* touch
* keyboard

---

# Gallery Sizes

The MVP supports:

```ts
"small"
"medium"
"large"
```

These represent visual presentation sizes, not fixed image dimensions.

Avoid hardcoding behavior that makes the gallery unusable on small screens.

The gallery must remain responsive.

---

# Captions

Captions/titles are optional.

Possible positions include:

```ts
"top"
"bottom"
"overlay"
```

Do not force captions to always be displayed.

The consumer must be able to disable them entirely.

Captions should use semantic:

```html
<figcaption>
```

markup.

---

# Lightbox

The MVP may provide a built-in lightbox.

However, the lightbox must not become tightly coupled to the gallery renderer.

The architecture should allow users to disable the built-in lightbox and implement their own behavior.

Conceptually:

```ts
lightbox: false
```

should be valid.

Later, a callback/event-based API may allow custom lightbox implementations.

Do not make a third-party modal dependency mandatory.

---

# Runtime State vs Content State

Keep document/content configuration separate from runtime state.

Content/configuration:

```ts
{
  layout: "scroll",
  size: "medium",
  captions: true
}
```

Runtime state:

```text
lightbox open
current image
hover state
focus state
scroll position
```

Runtime state must not be unnecessarily stored as persistent gallery content.

---

# Browser APIs

Prefer standard browser APIs when they are sufficient.

Examples:

* DOM APIs
* CSS scrolling
* IntersectionObserver
* ResizeObserver
* native events
* HTML semantics

Do not create custom abstractions around browser functionality unless they provide meaningful value.

---

# TypeScript Rules

TypeScript must run in strict mode.

Avoid:

```ts
any
```

unless there is a specific, documented reason.

Prefer narrow types:

```ts
type GallerySize = "small" | "medium" | "large";
```

instead of:

```ts
type GallerySize = string;
```

Public types must be intentionally designed because consumers will depend on them.

Do not expose internal implementation types unnecessarily.

---

# Testing

Every meaningful behavior should have a test.

At minimum, test:

* gallery creation
* rendering all images
* image attributes
* title/caption behavior
* option defaults
* enabled/disabled features
* invalid input where applicable

Tests should focus on observable behavior rather than implementation details.

Avoid tests such as:

```ts
expect(internalPrivateFunction).toHaveBeenCalled()
```

when the public behavior can be tested instead.

---

# Build

Use tsdown for library builds.

The build should produce:

```text
dist/
├── index.js
├── index.d.ts
├── style.css
└── source maps
```

The published package should contain only files necessary for consumers.

Do not publish:

* playground files
* tests
* development screenshots
* internal documentation
* source assets unrelated to package usage

unless explicitly needed.

---

# Playground

The playground is a development environment for visually testing the library.

Use Vite.

The playground exists to answer questions such as:

* Does the gallery look correct?
* Does horizontal scrolling feel natural?
* Does the gallery work on mobile widths?
* Do captions align correctly?
* Does keyboard interaction work?
* Does the lightbox feel correct?

Do not use the playground as the library implementation itself.

The library must work independently of Vite.

---

# Development Workflow

Before changing implementation:

1. Understand the current public API.
2. Check the existing tests.
3. Check the playground.
4. Make the smallest reasonable change.
5. Run type checking.
6. Run tests.
7. Run the build.
8. Visually inspect the playground when UI behavior changed.

Typical commands:

```bash
pnpm dev
pnpm typecheck
pnpm test:run
pnpm build
```

Do not declare a change complete if the build or tests fail.

---

# MVP Scope Discipline

Do not expand the MVP automatically.

For example, if asked to improve horizontal scrolling, do not also implement:

* masonry
* drag-and-drop
* Tiptap
* React
* image uploading
* fullscreen
* slideshow

unless explicitly requested.

Solve the requested problem first.

---

# Future Integrations

The following are intentionally deferred:

```text
@yourname/gallery-tiptap
@yourname/gallery-react
@yourname/gallery-vue
```

These packages should consume the core library rather than duplicate its implementation.

For example:

```text
gallery-core
      │
      ├── gallery-react
      │
      └── gallery-tiptap
```

Do not build these adapters during MVP.

---

# Tiptap

Tiptap support is planned for a future version.

The eventual Tiptap integration should likely represent the gallery as a custom Tiptap/ProseMirror node rather than trying to combine multiple ordinary image nodes.

Conceptually:

```text
paragraph
gallery
  ├── galleryItem
  ├── galleryItem
  └── galleryItem
paragraph
```

However:

> Do not implement Tiptap support during the MVP unless explicitly requested.

The core library must not depend on Tiptap.

---

# Framework Independence

Do not import:

```text
React
Vue
Svelte
Tiptap
ProseMirror
Next.js
```

into the core package.

The core package should operate using standard browser APIs.

---

# Performance

Prefer simple browser-native behavior.

Avoid:

* unnecessary re-renders
* excessive event listeners
* large dependencies
* continuous polling
* unnecessary observers
* expensive DOM rebuilds

Do not optimize prematurely.

First make the implementation correct.

Then measure before making complex performance changes.

---

# Error Handling

Fail clearly when required input is invalid.

Do not silently hide serious configuration errors.

For example, if the container is not an HTMLElement, throw a useful error.

Avoid cryptic errors such as:

```text
undefined is not a function
```

when a clear error can be produced.

---

# Documentation

The README should eventually explain:

1. what the library is
2. why it exists
3. installation
4. basic usage
5. configuration
6. examples
7. customization
8. accessibility
9. limitations
10. future integrations

Do not document functionality that does not exist.

Documentation must match the actual API.

---

# Naming

Use terminology consistently.

Prefer:

```text
gallery
gallery item
image
caption
lightbox
layout
size
```

Avoid switching between unrelated terminology such as:

```text
slide
card
tile
photo block
media item
```

unless there is a meaningful distinction.

---

# Git and Commit Discipline

Keep changes focused.

Do not mix unrelated changes in one commit.

Prefer commits such as:

```text
feat: add horizontal gallery layout
feat: add caption positioning
feat: add lightbox
fix: preserve image aspect ratio
test: add gallery rendering tests
docs: document gallery options
```

Avoid vague commits such as:

```text
update
changes
stuff
fix things
```

---

# Agent Behavior

When working on this repository, AI agents must:

* inspect existing code before modifying it
* preserve the established architecture
* avoid unnecessary dependencies
* avoid unnecessary abstractions
* avoid introducing frameworks into the core
* keep the MVP scope small
* update tests when behavior changes
* update documentation when public APIs change
* prefer simple browser-native solutions
* explain significant architectural changes before implementing them when the requested change could alter the public API

Do not rewrite large portions of the project without a clear reason.

Do not introduce new architecture merely because it is theoretically scalable.

Optimize for:

```text
clarity > cleverness
simplicity > abstraction
small API > large API
native browser behavior > custom implementations
focused MVP > premature features
```

---

# Definition of Done

A feature is considered complete only when:

* the implementation works
* TypeScript passes
* tests pass
* the package builds
* the playground works
* accessibility has been considered
* public API behavior is documented when applicable
* no unnecessary dependency was introduced
* the feature stays within the current project scope

---

# Current Goal

The immediate goal is to build a polished MVP of the horizontal editorial gallery.

The first milestone is:

```text
Multiple images
      ↓
Horizontal scrolling
      ↓
Small / Medium / Large
      ↓
Optional captions
      ↓
Responsive behavior
      ↓
Image click
      ↓
Optional lightbox
      ↓
Accessible interaction
```

Only after this MVP is stable should the project move toward additional layouts, framework adapters, or Tiptap integration.

---

# Guiding Principle

This project is not trying to become every possible image-gallery library.

It is trying to make this simple thing exceptionally good:

> Present several photographs inside a long-form article in a way that feels intentional, editorial, and beautiful.
