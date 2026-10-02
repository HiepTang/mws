"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export type LightboxTile = {
  key: string;
  src: string;
  caption: string;
  width: number;
  height: number;
  sizeClass: string;
};

/**
 * Renders the gallery mosaic and a click-to-enlarge overlay. Keyboard:
 * Esc closes, arrow keys move between photos.
 */
export function GalleryLightbox({ tiles }: { tiles: LightboxTile[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) =>
        cur === null ? cur : (cur + dir + tiles.length) % tiles.length,
      ),
    [tiles.length],
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    // Lock page scroll while the overlay is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const active = open !== null ? tiles[open] : null;

  return (
    <>
      <div className="gallery-mosaic">
        {tiles.map((t, i) => (
          <button
            key={t.key}
            type="button"
            className={`tile ${t.sizeClass}`}
            onClick={() => setOpen(i)}
            aria-label={t.caption ? `Enlarge photo: ${t.caption}` : "Enlarge photo"}
          >
            <Image
              src={t.src}
              alt={t.caption}
              width={t.width}
              height={t.height}
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              unoptimized
            />
            {t.caption && <span className="caption">{t.caption}</span>}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || "Photo"}
          onClick={close}
        >
          <figure onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.src} alt={active.caption} />
            {active.caption && <figcaption>{active.caption}</figcaption>}
          </figure>
          <button
            type="button"
            className="lb-close"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          {tiles.length > 1 && (
            <>
              <button
                type="button"
                className="lb-nav lb-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="lb-nav lb-next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
