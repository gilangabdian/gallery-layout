'use client'

import { useEffect, useRef } from 'react'
import { createGallery, type GalleryOptions } from 'gallery-layout'
import 'gallery-layout/style.css'

export default function Gallery(options: GalleryOptions) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const gallery = createGallery(container, options)

    return () => {
      gallery.destroy()
    }
  }, [options])

  return <div ref={containerRef} />
}
