import type { GalleryOptions } from "./types";
import { openLightbox } from "./lightbox";

export function createGallery(container: HTMLElement, options: GalleryOptions): void {
  container.innerHTML = "";
  container.classList.add("gallery-layout");

  const size = options.size ?? "medium";
  container.dataset.size = size;

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
      img.addEventListener("click", () => {
        openLightbox(image);
      });
    }

    item.appendChild(img);

    if (options.captions && image.title) {
      const caption = document.createElement("figcaption");
      caption.textContent = image.title;
      item.appendChild(caption);
    }

    track.appendChild(item);
  }

  container.appendChild(track);
}
