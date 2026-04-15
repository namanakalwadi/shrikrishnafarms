import Image from "next/image";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import LazyVideo from "@/components/LazyVideo";

// ─────────────────────────────────────────────────────────
// Desktop layout (4 cols, auto-rows-[100px]) — gap-free:
//
//  [  photo1 (2×3)  ] [video1 (1×5)] [photo2 (1×2)]
//  [  photo1 (2×3)  ] [video1 (1×5)] [photo2 (1×2)]
//  [  photo1 (2×3)  ] [video1 (1×5)] [photo3 (1×3)]
//  [  photo4 (2×2)  ] [video1 (1×5)] [photo3 (1×3)]
//  [  photo4 (2×2)  ] [video1 (1×5)] [photo3 (1×3)]
//  [vid2][  photo5 (2×3)  ] [photo6 (1×3)]
//  [vid2][  photo5 (2×3)  ] [photo6 (1×3)]
//  [vid2][  photo5 (2×3)  ] [photo6 (1×3)]
//  [vid2][     photo7  (3×2)         ]
//  [vid2][     photo7  (3×2)         ]
// ─────────────────────────────────────────────────────────
const media: {
  id: number; label: string; src: string; type: "image" | "video"; cls: string;
}[] = [
  {
    id: 1, label: "Fresh Harvest", src: "photo1.jpeg", type: "image",
    cls: "col-span-2 row-span-2  md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-3",
  },
  {
    id: 2, label: "Farm Tour", src: "video1.mp4", type: "video",
    cls: "col-span-1 row-span-3  md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-5",
  },
  {
    id: 3, label: "Mango Bunches", src: "photo2.jpeg", type: "image",
    cls: "col-span-1 row-span-2  md:col-start-4 md:col-span-1 md:row-start-1 md:row-span-2",
  },
  {
    id: 4, label: "Ripe Mangoes", src: "photo3.jpeg", type: "image",
    cls: "col-span-1 row-span-2  md:col-start-4 md:col-span-1 md:row-start-3 md:row-span-3",
  },
  {
    id: 5, label: "Our Orchard", src: "photo4.jpeg", type: "image",
    cls: "col-span-2 row-span-2  md:col-start-1 md:col-span-2 md:row-start-4 md:row-span-2",
  },
  {
    id: 6, label: "Farm Life", src: "video2.mp4", type: "video",
    cls: "col-span-1 row-span-3  md:col-start-1 md:col-span-1 md:row-start-6 md:row-span-5",
  },
  {
    id: 7, label: "Harvest Season", src: "photo5.jpeg", type: "image",
    cls: "col-span-2 row-span-2  md:col-start-2 md:col-span-2 md:row-start-6 md:row-span-3",
  },
  {
    id: 8, label: "Mango Varieties", src: "photo6.jpeg", type: "image",
    cls: "col-span-1 row-span-2  md:col-start-4 md:col-span-1 md:row-start-6 md:row-span-3",
  },
  {
    id: 9, label: "Farm Landscape", src: "photo7.jpeg", type: "image",
    cls: "col-span-2 row-span-2  md:col-start-2 md:col-span-3 md:row-start-9 md:row-span-2",
  },
];

export default function GalleryPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Photos & Videos</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Gallery</h1>
          <p className="font-bold text-stone-300 mt-3 text-lg max-w-xl">
            A glimpse of our mangoes and farm life in Dharwad
          </p>
        </div>
      </section>

      {/* Mobile: stacked single column */}
      <section className="md:hidden py-10 px-4 flex flex-col gap-3">
        {media.map(({ id, label, src, type }) => (
          <div
            key={id}
            className={`relative w-full rounded-2xl overflow-hidden bg-stone-100 ${
              type === "video" ? "aspect-[9/16]" : "aspect-[4/3]"
            }`}
          >
            {type === "video" ? (
              <LazyVideo
                src={`/gallery/${src}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={`/gallery/${src}`}
                alt={label}
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
              <p className="text-white text-xs font-bold">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Desktop: explicit gap-free grid */}
      <section className="hidden md:block py-16 px-4 max-w-6xl mx-auto">
        <StaggerGrid className="grid grid-cols-4 auto-rows-[100px] gap-3">
          {media.map(({ id, label, src, type, cls }) => (
            <StaggerItem key={id} className={cls}>
              <div className="relative w-full h-full rounded-2xl overflow-hidden group bg-stone-100">
                {type === "video" ? (
                  <LazyVideo
                    src={`/gallery/${src}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={`/gallery/${src}`}
                    alt={label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="50vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-bold">{label}</p>
                  {type === "video" && (
                    <p className="text-white/70 text-[10px] mt-0.5 uppercase tracking-wider">Video</p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </main>
  );
}
