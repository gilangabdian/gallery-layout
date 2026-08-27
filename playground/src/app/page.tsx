'use client'

import Gallery from '@/components/Gallery'
import TiptapEditor from '@/components/TiptapEditor'
import { ImagePlus, ChevronDown, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { GallerySize } from 'gallery-layout'

type GalleryLayoutType = 'scroll' | 'grid' // Removed "flex"
type CaptionPosType =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'overlay-top-left'
  | 'overlay-top-center'
  | 'overlay-top-right'
  | 'overlay-bottom-left'
  | 'overlay-bottom-center'
  | 'overlay-bottom-right'

type AlignType = 'left' | 'center' | 'right'

const optimizeImage = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`

const defaultImages = [
  { src: optimizeImage('/photos/photo-1.jpg'), alt: 'Night', title: 'Car, 2024' },
  { src: optimizeImage('/photos/photo-2.jpg'), alt: 'Wait', title: 'Wait' },
  { src: optimizeImage('/photos/photo-3.jpg'), alt: 'Laptop', title: 'Work with laptop' },
  { src: optimizeImage('/photos/photo-4.jpg'), alt: 'Owl', title: 'Owl' },
  { src: optimizeImage('/photos/photo-5.jpg'), alt: 'Green garden', title: 'Green garden' },
  { src: optimizeImage('/photos/photo-6.jpg'), alt: 'Forest', title: 'Forest' },
]

export default function Home() {
  const [coreImages, setCoreImages] = useState(defaultImages)
  const coreFileInputRef = useRef<HTMLInputElement>(null)

  // Core Gallery Settings State
  const [layout, setLayout] = useState<GalleryLayoutType>('scroll')
  const [size, setSize] = useState<GallerySize>('medium')
  const [customWidth, setCustomWidth] = useState<string>('')
  const [columns, setColumns] = useState<string>('')
  const [gap, setGap] = useState<string>('16px')
  const [radius, setRadius] = useState<string>('8px')
  const [aspectRatio, setAspectRatio] = useState<string>('')

  const [lightbox, setLightbox] = useState<boolean>(true)
  const [captions, setCaptions] = useState(true)
  const [pointer, setPointer] = useState<boolean>(true)
  const [snapping, setSnapping] = useState<boolean>(true)

  const [captionPosition, setCaptionPosition] = useState<CaptionPosType>('bottom-center')
  const [captionSize, setCaptionSize] = useState<string>('14px')
  const [align, setAlign] = useState<AlignType>('left')

  // Custom Dropdown State
  const [openDropdown, setOpenDropdown] = useState<'caption' | 'align' | null>(null)

  const [timeAgoResult, setTimeAgoResult] = useState('')

  useEffect(() => {
    const startDate = new Date('2026-08-23T00:00:00Z')
    const diffInMs = Date.now() - startDate.getTime()
    const diffDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    let result = ''
    if (diffDays <= 0) result = 'today'
    else if (diffDays < 30) result = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30)
      result = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
    } else {
      const diffYears = Math.floor(diffDays / 365)
      result = `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeAgoResult(result)
  }, [])

  const handleCoreImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
      title: file.name.split('.')[0],
    }))

    setCoreImages((prev) => [...prev, ...newImages])

    if (coreFileInputRef.current) {
      coreFileInputRef.current.value = ''
    }
  }

  const isColumnsUsed = layout === 'grid' && columns.trim().length > 0

  // Convert short UI size names to actual GallerySize strings
  const sizeMap: Record<string, GallerySize> = {
    XS: 'extra-small',
    S: 'small',
    M: 'medium',
    L: 'large',
    XL: 'extra-large',
  }

  const captionPosOptions = [
    { label: 'Top Left', value: 'top-left' },
    { label: 'Top Center', value: 'top-center' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Bottom Center', value: 'bottom-center' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Overlay Top Left', value: 'overlay-top-left' },
    { label: 'Overlay Top Center', value: 'overlay-top-center' },
    { label: 'Overlay Top Right', value: 'overlay-top-right' },
    { label: 'Overlay Bottom Left', value: 'overlay-bottom-left' },
    { label: 'Overlay Bottom Center', value: 'overlay-bottom-center' },
    { label: 'Overlay Bottom Right', value: 'overlay-bottom-right' },
  ]

  const alignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ]

  const getLabel = (val: string, opts: { label: string; value: string }[]) =>
    opts.find((o) => o.value === val)?.label || val

  // Tiptap Logic: Align is only visible if layout is grid and custom size is used
  const isCustomSize = !['extra-small', 'small', 'medium', 'large', 'extra-large'].includes(size)
  const showAlign = layout === 'grid' && isCustomSize

  return (
    <main
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-[family-name:var(--font-geist-sans)]"
      onClick={() => setOpenDropdown(null)}
    >
      {/* Navbar / Header */}
      <nav className="w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="Gallery Layout Logo" className="w-7 h-7 object-contain" />
            <span className="font-semibold text-lg tracking-tight text-white">Gallery Layout</span>
          </div>
          <Link
            href="https://github.com/gilangabdian/gallery-layout"
            target="_blank"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-all"
            title="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 pb-20 pt-8 space-y-32">
        {/* Hero Section */}
        <header className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Side: Text and CTA */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 pb-2">
              Gallery Layout
            </h1>
            <p className="text-neutral-400 text-xl leading-relaxed max-w-md mx-auto md:mx-0">
              Create beautiful layouts.
            </p>
            <div className="pt-4">
              <a
                href="#core-library"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-black bg-white rounded-full hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
              >
                Demo
              </a>
            </div>
          </div>

          {/* Right Side: Morphing SVG Animation */}
          <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden">
            {/* Fade edges */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, #0a0a0a 0%, transparent 15%, transparent 85%, #0a0a0a 100%)',
              }}
            />

            <div className="w-full max-w-[260px] aspect-square relative animate-shape-track will-change-transform">
              {/* Box 1 */}
              <div className="absolute w-[42.5%] h-[42.5%] left-0 top-0 origin-top-left rounded-xl bg-neutral-900 border border-neutral-800 animate-shape-box-1 shadow-2xl flex items-center justify-center overflow-hidden will-change-transform">
                <div className="w-full h-full opacity-20 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              {/* Box 2 */}
              <div className="absolute w-[42.5%] h-[42.5%] left-0 top-0 origin-top-left rounded-xl bg-neutral-900 border border-neutral-800 animate-shape-box-2 shadow-2xl flex items-center justify-center overflow-hidden will-change-transform">
                <div className="w-full h-full opacity-20 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              {/* Box 3 */}
              <div className="absolute w-[42.5%] h-[42.5%] left-0 top-0 origin-top-left rounded-xl bg-neutral-900 border border-neutral-800 animate-shape-box-3 shadow-2xl flex items-center justify-center overflow-hidden will-change-transform">
                <div className="w-full h-full opacity-20 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              {/* Box 4 */}
              <div className="absolute w-[42.5%] h-[42.5%] left-0 top-0 origin-top-left rounded-xl bg-neutral-900 border border-neutral-800 animate-shape-box-4 shadow-2xl flex items-center justify-center overflow-hidden will-change-transform">
                <div className="w-full h-full opacity-20 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            </div>
          </div>
        </header>

        {/* Vanilla JS Core Showcase */}
        <section id="core-library" className="space-y-8 scroll-mt-24">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Core Library</h2>
              <p className="text-neutral-400 mt-2">
                It can be used directly with Vanilla JavaScript and JavaScript frameworks such as
                React, Next.js, Vue.js, Svelte, and others.
              </p>
            </div>
          </header>

          <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-2xl">
            {/* Full Dynamic Control Panel */}
            <div className="bg-neutral-900/50 border-b border-neutral-800/50 p-5 rounded-t-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-5">
                {/* Layout Type */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Layout Type
                  </label>
                  <div className="flex bg-neutral-950 p-1 rounded-lg">
                    {['grid', 'scroll'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setLayout(opt as GalleryLayoutType)}
                        className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                          layout === opt
                            ? 'bg-neutral-800 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Size
                    {isColumnsUsed && (
                      <span className="text-yellow-500 text-[10px] bg-yellow-500/10 px-1.5 py-0.5 rounded leading-none lowercase">
                        disabled by cols
                      </span>
                    )}
                  </label>
                  <div
                    className={`flex bg-neutral-950 p-1 rounded-lg ${isColumnsUsed ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {Object.keys(sizeMap).map((label) => (
                      <button
                        key={label}
                        onClick={() => {
                          setSize(sizeMap[label])
                          setCustomWidth('') // reset custom width when preset is clicked
                        }}
                        className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors uppercase ${
                          size === sizeMap[label] && !customWidth
                            ? 'bg-neutral-800 text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Width Input */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Custom Width
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 360px"
                    value={customWidth}
                    onChange={(e) => {
                      setCustomWidth(e.target.value)
                      if (e.target.value) setSize(e.target.value as GallerySize)
                    }}
                    disabled={isColumnsUsed}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Align (Custom Select) */}
                {showAlign && (
                  <div className="space-y-3 relative">
                    <label className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Align
                    </label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenDropdown(openDropdown === 'align' ? null : 'align')
                      }}
                      className="w-full flex items-center justify-between bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none hover:border-neutral-700 transition-all"
                    >
                      <span>{getLabel(align, alignOptions)}</span>
                      <ChevronDown size={16} className="text-neutral-500" />
                    </button>
                    {openDropdown === 'align' && (
                      <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden z-50">
                        {alignOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setAlign(opt.value as AlignType)
                              setOpenDropdown(null)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors ${align === opt.value ? 'text-white bg-neutral-800/50' : 'text-neutral-400'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Gap */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Gap
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 16px"
                    value={gap}
                    onChange={(e) => setGap(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 transition-all"
                  />
                </div>

                {/* Radius */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Radius
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8px"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 transition-all"
                  />
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Aspect Ratio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1/1"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 transition-all"
                  />
                </div>

                {/* Columns */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Columns (Grid)
                    {layout === 'scroll' && (
                      <span className="text-neutral-500 text-[10px] bg-neutral-500/10 px-1.5 py-0.5 rounded leading-none lowercase">
                        grid only
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 (number)"
                    value={columns}
                    onChange={(e) => setColumns(e.target.value)}
                    disabled={layout !== 'grid'}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Caption Size */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Caption Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 14px"
                    value={captionSize}
                    onChange={(e) => setCaptionSize(e.target.value)}
                    disabled={!captions}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                {/* Caption Position (Custom Select) */}
                <div className="space-y-3 relative sm:col-span-2 md:col-span-2 lg:col-span-1">
                  <label className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Caption Position
                  </label>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (captions) setOpenDropdown(openDropdown === 'caption' ? null : 'caption')
                    }}
                    disabled={!captions}
                    className="w-full flex items-center justify-between bg-neutral-950 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2 outline-none hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <span>{getLabel(captionPosition, captionPosOptions)}</span>
                    <ChevronDown size={16} className="text-neutral-500" />
                  </button>
                  {openDropdown === 'caption' && (
                    <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 custom-scrollbar">
                      {captionPosOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setCaptionPosition(opt.value as CaptionPosType)
                            setOpenDropdown(null)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors ${captionPosition === opt.value ? 'text-white bg-neutral-800/50' : 'text-neutral-400'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggle Features */}
                <div className="space-y-3 sm:col-span-2 md:col-span-4 lg:col-span-5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Features
                  </label>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800/50">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={lightbox}
                        onChange={(e) => setLightbox(e.target.checked)}
                        className="accent-neutral-500 w-4 h-4"
                      />
                      Lightbox
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={captions}
                        onChange={(e) => setCaptions(e.target.checked)}
                        className="accent-neutral-500 w-4 h-4"
                      />
                      Captions
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={pointer}
                        onChange={(e) => setPointer(e.target.checked)}
                        className="accent-neutral-500 w-4 h-4"
                      />
                      Hover Pointer
                    </label>
                    <label
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${layout === 'scroll' ? 'cursor-pointer text-neutral-300 hover:text-white' : 'cursor-not-allowed text-neutral-600'}`}
                    >
                      <input
                        type="checkbox"
                        checked={snapping}
                        onChange={(e) => setSnapping(e.target.checked)}
                        disabled={layout !== 'scroll'}
                        className="accent-neutral-500 w-4 h-4 disabled:opacity-50"
                      />
                      Scroll Snapping
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Canvas */}
            <div className="p-4 md:p-8 min-h-[200px]">
              <Gallery
                images={coreImages}
                size={customWidth ? customWidth : size}
                layout={layout}
                columns={columns.trim() ? parseInt(columns) : undefined}
                captions={captions}
                captionPosition={captionPosition}
                captionSize={captionSize.trim() ? captionSize : undefined}
                pointer={pointer}
                lightbox={lightbox}
                gap={gap.trim() ? gap : undefined}
                radius={radius.trim() ? radius : undefined}
                aspectRatio={aspectRatio.trim() ? aspectRatio : undefined}
                align={align}
                snap={snapping}
              />
            </div>

            {/* Core Image Manager Mini */}
            <div className="border-t border-neutral-800/50 bg-neutral-900/50 p-5 rounded-b-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
                  Image Manager
                </h3>
                <div>
                  <button
                    onClick={() => coreFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-full transition-colors shadow-sm"
                  >
                    <ImagePlus size={14} />
                    Add Image
                  </button>
                  <input
                    type="file"
                    ref={coreFileInputRef}
                    onChange={handleCoreImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {coreImages.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {coreImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 p-2 rounded-lg"
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 shrink-0 rounded bg-neutral-900 overflow-hidden relative border border-neutral-800">
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                      </div>

                      {/* Title Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={img.title || ''}
                          onChange={(e) => {
                            const newImages = [...coreImages]
                            newImages[idx] = { ...newImages[idx], title: e.target.value }
                            setCoreImages(newImages)
                          }}
                          placeholder="Image title/caption..."
                          className="w-full bg-transparent text-sm text-neutral-200 outline-none border-b border-transparent focus:border-neutral-700 pb-1 transition-colors"
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          const newImages = [...coreImages]
                          newImages.splice(idx, 1)
                          setCoreImages(newImages)
                        }}
                        title="Remove image"
                        className="shrink-0 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
                  No images in gallery. Click &quot;Add Image&quot; to upload.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tiptap Integration Showcase */}
        <section className="space-y-8">
          <header className="border-b border-neutral-800 pb-4">
            <h2 className="text-3xl font-semibold text-white tracking-tight">Tiptap Integration</h2>
            <p className="text-neutral-400 mt-2">
              Example of usage with Tiptap. Actually, those photos are from{' '}
              <a
                href="https://unsplash.com/"
                className="underline hover:text-white transition-colors"
              >
                Unsplash
              </a>
              .
            </p>
          </header>

          <TiptapEditor />
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-neutral-950 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-start">
          <p
            className="text-neutral-500 text-sm font-medium tracking-wide"
            suppressHydrationWarning
          >
            MIT &bull; {timeAgoResult}
          </p>
        </div>
      </footer>

      {/* Global CSS for Custom Scrollbar in Dropdowns */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Shape Shifter Animations (Hardware Accelerated via Transform) */
        @keyframes shape-box-1 {
          0%, 35% { transform: translate(11.76%, 11.76%) scale(1, 1); }
          50%, 85% { transform: translate(0%, 58.82%) scale(1.0588, 1.1764); }
          100% { transform: translate(11.76%, 11.76%) scale(1, 1); }
        }
        @keyframes shape-box-2 {
          0%, 35% { transform: translate(123.53%, 11.76%) scale(1, 1); }
          50%, 85% { transform: translate(117.65%, 58.82%) scale(1.0588, 1.1764); }
          100% { transform: translate(123.53%, 11.76%) scale(1, 1); }
        }
        @keyframes shape-box-3 {
          0%, 35% { transform: translate(11.76%, 123.53%) scale(1, 1); }
          50%, 85% { transform: translate(235.29%, 58.82%) scale(1.0588, 1.1764); }
          100% { transform: translate(11.76%, 123.53%) scale(1, 1); }
        }
        @keyframes shape-box-4 {
          0%, 35% { transform: translate(123.53%, 123.53%) scale(1, 1); }
          50%, 85% { transform: translate(352.94%, 58.82%) scale(1.0588, 1.1764); }
          100% { transform: translate(123.53%, 123.53%) scale(1, 1); }
        }
        @keyframes shape-track {
          0%, 35% { transform: translateX(0); }
          50%, 85% { transform: translateX(-35%); }
          100% { transform: translateX(0); }
        }

        .animate-shape-box-1 { animation: shape-box-1 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-shape-box-2 { animation: shape-box-2 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-shape-box-3 { animation: shape-box-3 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-shape-box-4 { animation: shape-box-4 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-shape-track { animation: shape-track 8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `,
        }}
      />
    </main>
  )
}
