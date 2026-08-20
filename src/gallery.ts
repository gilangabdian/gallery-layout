import type { GalleryOptions } from "./types";
import { openLightbox } from "./lightbox";

export function createGallery(container: HTMLElement, options: GalleryOptions): void {
  container.innerHTML = "";
  container.classList.add("gallery-layout");

  const size = options.size ?? "medium";
  container.dataset.size = size;
  
  if (options.captions) {
    container.dataset.captionPosition = options.captionPosition ?? "bottom-center";
  }

  if (options.pointer) {
    container.dataset.pointer = "true";
  }

  if (options.gap) {
    container.style.setProperty("--gallery-gap", options.gap);
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
