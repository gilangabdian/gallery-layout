"use client";

import { useEffect, useRef } from "react";
import { createGallery, type GalleryOptions } from "gallery-layout";
import "gallery-layout/style.css";

export default function Gallery(options: GalleryOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      createGallery(container, options);
    }
    
    return () => {
      if (container) {
        container.innerHTML = "";
      }
      // Clean up any open lightboxes appended to body during hot-reloads
      document.querySelectorAll(".gallery-layout__lightbox").forEach(el => el.remove());
    };
  }, [options]);

  return <div ref={containerRef} />;
}
