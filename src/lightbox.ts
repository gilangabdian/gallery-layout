import type { GalleryImage } from "./types";

export function openLightbox(image: GalleryImage): void {
  // Create overlay container
  const overlay = document.createElement("div");
  overlay.className = "gallery-layout__lightbox";

  // Create image element
  const imgElement = document.createElement("img");
  imgElement.src = image.src;
  imgElement.alt = image.alt;
  imgElement.className = "gallery-layout__lightbox-img";

  // Create close button (accessible)
  const closeBtn = document.createElement("button");
  closeBtn.className = "gallery-layout__lightbox-close";
  closeBtn.setAttribute("aria-label", "Close lightbox");
  closeBtn.innerHTML = "&times;";

  // Append elements
  overlay.appendChild(imgElement);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // Prevent background scrolling
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // Focus management
  closeBtn.focus();

  // Close logic
  const closeLightbox = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = originalOverflow;
    document.removeEventListener("keydown", onKeyDown);
  };

  // Event listeners
  closeBtn.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (e) => {
    // Only close if clicking the dark overlay, not the image itself
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  };
  document.addEventListener("keydown", onKeyDown);
}
