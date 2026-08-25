import Gallery from "@/components/Gallery";
import TiptapEditor from "@/components/TiptapEditor";
const images = [
  { src: "/photos/photo-1.png", alt: "Tokyo street in snowfall", title: "Winter in Tokyo, 2024" },
  { src: "/photos/photo-2.png", alt: "Tokyo street", title: "Neon Nights" },
  { src: "/photos/photo-3.png", alt: "Building in Tokyo", title: "Urban Architecture" },
  { src: "/photos/photo-4.png", alt: "Tokyo night street with signs", title: "City Lights" },
  { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
  { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
  { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 md:p-24 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Editorial Gallery</h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            This is a demonstration of the <code className="text-neutral-200">gallery-layout</code> Vanilla JS library
            running inside a Next.js App Router environment.
          </p>
        </header>

        <section className="prose prose-invert">
          <p className="text-neutral-400">
            Below is the horizontal gallery instance. You can scroll through the photos horizontally. Notice how the
            captions align to the bottom of each image seamlessly.
          </p>
        </section>

        {/* Gallery Component (Scroll) */}
        <div className="-mx-8 md:-mx-24 px-8 md:px-24">
          <section className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Layout: Scroll (Default)</h2>
            <Gallery
              images={images}
              size="medium"
              captions={true}
              captionPosition="overlay-bottom-center"
              pointer={true}
              lightbox={true}
              gap="12px"
              radius="0"
              aspectRatio="1/1"
              snap={false}
              captionSize="8px"
            />
          </section>

          <section className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Layout: Grid</h2>
            <Gallery
              images={images}
              layout="grid"
              captions={true}
              captionPosition="overlay-bottom-center"
              captionSize="6px"
              pointer={false}
              size="medium"
              aspectRatio="1/1"
              lightbox={true}
              gap="12px"
              radius="0"
            />
          </section>

          <section className="my-12">
            <h2 className="text-2xl font-semibold mb-6">Tiptap Extension Demo</h2>
            <TiptapEditor />
          </section>
        </div>

        <section className="prose prose-invert">
          <p className="text-neutral-400">
            The core library handles all the DOM manipulation and CSS snap scrolling, keeping this Next.js wrapper
            incredibly thin.
          </p>
        </section>
      </div>
    </main>
  );
}
