import Gallery from "@/components/Gallery";

export default function Home() {
  const images = [
    { src: "/photos/photo-1.png", alt: "Tokyo street in snowfall", title: "Tokyo" },
    { src: "/photos/photo-2.png", alt: "Tokyo street", title: "A quiet afternoon" },
    { src: "/photos/photo-3.png", alt: "Building in Tokyo", title: "Somewhere in Tokyo" },
    { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
    { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
    { src: "/photos/photo-4.png", alt: "Neon lights", title: "Nightlife" },
  ];

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

        {/* Gallery Component */}
        <div className="-mx-8 md:-mx-24 px-8 md:px-24">
          <section className="my-12">
            <Gallery
              images={images}
              size="medium"
              captions={true}
              captionPosition="overlay"
              pointer={false}
              lightbox={true}
              gap="10px"
              aspectRatio="16/9"
              snap={true}
            />
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
