"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

/**
 * Product image gallery with a large active image and clickable thumbnails.
 * Local UI state only (the selected image) — not app state.
 */
export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div className="bg-muted relative aspect-square overflow-hidden rounded-xl border">
        <Image
          src={active}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2" role="list">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "bg-muted focus-visible:ring-ring relative size-16 overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2",
                index === activeIndex && "ring-primary ring-2",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
