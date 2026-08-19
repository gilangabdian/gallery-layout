"use client";

import { useEffect, useRef } from "react";
import { createGallery, type GalleryOptions } from "gallery-layout";
import "gallery-layout/style.css";

export default function Gallery(options: GalleryOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createGallery(containerRef.current, options);
    }
  }, [options]);

  return <div ref={containerRef} />;
}
