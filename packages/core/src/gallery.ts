import type { GalleryOptions } from "./types";
import { openLightbox } from "./lightbox";

export function createGallery(container: HTMLElement, options: GalleryOptions): void {
  container.innerHTML = "";
  container.classList.add("gallery-layout");

  const layout = options.layout ?? "scroll";
  container.dataset.layout = layout;

  if (layout === "scroll") {
    const scrollOptions = options as Extract<GalleryOptions, { layout?: "scroll" }>;
    const size = scrollOptions.size ?? "medium";
    container.dataset.size = size;
    
    if (scrollOptions.snap === false || scrollOptions.snap === undefined) {
      container.dataset.snap = "false";
    }
  } else if (layout === "grid") {
    const gridOptions = options as Extract<GalleryOptions, { layout: "grid" }>;
    
    // Determine the columns configuration
    let finalCols = gridOptions.columns;
    
    // If columns is not explicitly set, fallback to mapping from the size attribute
    if (finalCols === undefined) {
      if (gridOptions.size === "small") {
        finalCols = 4;
      } else if (gridOptions.size === "large") {
        finalCols = 2;
      } else {
        finalCols = 3; // Medium / Default
      }
    }

    if (typeof finalCols === "number") {
      container.style.setProperty("--gallery-cols-desktop", finalCols.toString());
      container.style.setProperty("--gallery-cols-tablet", finalCols.toString());
      container.style.setProperty("--gallery-cols-mobile", finalCols.toString());
    } else if (finalCols) {
      if (finalCols.desktop) container.style.setProperty("--gallery-cols-desktop", finalCols.desktop.toString());
      if (finalCols.tablet) container.style.setProperty("--gallery-cols-tablet", finalCols.tablet.toString());
      if (finalCols.mobile) container.style.setProperty("--gallery-cols-mobile", finalCols.mobile.toString());
    }
  }
  
  if (options.captions) {
    container.dataset.captionPosition = options.captionPosition ?? "bottom-center";
  }

  if (options.pointer) {
    container.dataset.pointer = "true";
  }

  if (options.gap) {
    container.style.setProperty("--gallery-gap", options.gap);
  }

  if (options.aspectRatio) {
    container.style.setProperty("--gallery-aspect-ratio", options.aspectRatio);
  }

  if (options.captionSize) {
    container.style.setProperty("--gallery-caption-size", options.captionSize);
  }

  if (options.radius === false) {
    container.style.setProperty("--gallery-radius", "0px");
  } else if (typeof options.radius === "string") {
    container.style.setProperty("--gallery-radius", options.radius);
  }

  const track = document.createElement("div");
  track.className = "gallery-layout__track";

  for (const image of options.images) {
    const item = document.createElement("figure");
    item.className = "gallery-layout__item";

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    if (options.lightbox) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.addEventListener("click", () => {
        openLightbox(image, options);
      });
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(image, options);
        }
      });
    }

    item.appendChild(img);

    if (options.captions && image.title) {
      const caption = document.createElement("figcaption");
      caption.textContent = image.title;
      
      if (options.captionPosition?.startsWith("top")) {
        item.insertBefore(caption, img);
      } else {
        item.appendChild(caption);
      }
    }

    track.appendChild(item);
  }

  container.appendChild(track);
}
