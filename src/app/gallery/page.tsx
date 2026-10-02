import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import Link from "next/link";
import { db, schema } from "@/db";
import { GalleryLightbox, type LightboxTile } from "@/components/gallery-lightbox";
import { T } from "@/components/lang";
import {
  GALLERY_CATEGORIES,
  categoryValuesFor,
  isGalleryCategory,
  type GalleryCategory,
} from "@/lib/gallery-categories";

export const metadata = {
  title: "Gallery",
};

export const dynamic = "force-dynamic";

type TileSource = "curated" | "review";
type Tile = {
  id: string;
  source: TileSource;
  caption: string;
  width: number;
  height: number;
};

// Repeating mosaic pattern designed for the 12-column .gallery-mosaic.
const TILE_SIZES = [
  "t-2x2",
  "t-1x1s",
  "t-1x1",
  "t-1x1",
  "t-3x2",
  "t-1x1s",
  "t-1x1",
  "t-1x1",
  "t-2x1",
  "t-1x1",
];

function captionFromReview(coupleNames: string, weddingDate: string | null): string {
  return weddingDate ? `${coupleNames}, ${weddingDate}` : coupleNames;
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const tag = isGalleryCategory(params.tag) ? params.tag : null;

  let tiles: Tile[] = [];
  try {
    tiles = await fetchTiles(tag);
  } catch (err) {
    console.error("[gallery] DB read failed:", err);
  }

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <div className="crumbs">
            <Link href="/">
              <T en="Home" vi="Trang chủ" />
            </Link>
            {" · "}
            <span>
              <T en="Gallery" vi="Thư viện ảnh" />
            </span>
          </div>
          <h1 className="serif">
            <T en="Our weddings," vi="Đám cưới của chúng tôi," />
            <br />
            <span className="accent">
              <T en="held in pictures." vi="lưu trong ảnh." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="Browse to see MWS in action and more of our product offerings. Click any photo to enlarge."
              vi="Xem MWS trong thực tế và thêm các sản phẩm của chúng tôi. Bấm vào ảnh để phóng to."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 56 }}>
        <div className="shell">
          <div className="gal-tabs">
            <Link
              href={{ pathname: "/gallery" }}
              className={`gal-tab ${tag === null ? "on" : ""}`}
            >
              <T en="All Moments" vi="Tất cả" />
              <span className="vi">Tất cả</span>
            </Link>
            {GALLERY_CATEGORIES.map((c) => (
              <Link
                key={c.value}
                href={{ pathname: "/gallery", query: { tag: c.value } }}
                className={`gal-tab ${tag === c.value ? "on" : ""}`}
              >
                <T en={c.en} vi={c.vi} />
                <span className="vi">{c.vi}</span>
              </Link>
            ))}
          </div>

          {tiles.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 22,
                color: "var(--ink-muted)",
                textAlign: "center",
                maxWidth: "44ch",
                margin: "0 auto",
                padding: "48px 0",
              }}
            >
              <T
                en="No photos here yet. Check back soon — the first ones land as couples share their wedding pictures with us."
                vi="Chưa có ảnh ở đây. Xin quay lại sau — những ảnh đầu tiên sẽ đến khi các cặp đôi chia sẻ ảnh cưới với chúng tôi."
              />
            </p>
          ) : (
            <GalleryLightbox
              tiles={tiles.map(
                (t, i): LightboxTile => ({
                  key: `${t.source}-${t.id}`,
                  src:
                    t.source === "curated"
                      ? `/api/gallery-image/${t.id}`
                      : `/api/review-image/${t.id}`,
                  caption: t.caption,
                  width: t.width,
                  height: t.height,
                  sizeClass: TILE_SIZES[i % TILE_SIZES.length],
                }),
              )}
            />
          )}
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="cta-banner">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
                <span className="dash" />
                <T en="Follow along" vi="Theo dõi chúng tôi" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Follow us" vi="Theo dõi chúng tôi" /> <span className="gold">@mississaugawedding</span>
              </h2>
              <p>
                <T
                  en="Stay up-to-date on our newest products and services, see our latest ceremonies, and more."
                  vi="Cập nhật sản phẩm và dịch vụ mới nhất, xem các lễ cưới gần đây, và hơn thế nữa."
                />
              </p>
            </div>
            <div className="actions">
              <a
                href="https://www.instagram.com/mississaugawedding/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                <T en="Open Instagram" vi="Mở Instagram" />
                <span className="arrow">→</span>
              </a>
              <a
                href="https://www.facebook.com/mississaugawedding"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <T en="Open Facebook" vi="Mở Facebook" />
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function fetchTiles(tag: GalleryCategory | null): Promise<Tile[]> {
  // Curated photos for the requested tag (or all if tag is null), ordered by
  // admin's chosen sort_order ascending (lowest first), then newest first.
  const curatedConditions = [eq(schema.galleryImages.hidden, false)];
  if (tag !== null)
    curatedConditions.push(inArray(schema.galleryImages.category, categoryValuesFor(tag)));

  const curated = await db
    .select({
      id: schema.galleryImages.id,
      caption: schema.galleryImages.caption,
      imageWidth: schema.galleryImages.imageWidth,
      imageHeight: schema.galleryImages.imageHeight,
      category: schema.galleryImages.category,
    })
    .from(schema.galleryImages)
    .where(and(...curatedConditions))
    .orderBy(asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.createdAt))
    .limit(60);

  // Approved review photos that customers consented to share in the gallery.
  const reviewConditions = [
    eq(schema.reviews.status, "approved"),
    eq(schema.reviews.consentGallery, true),
    isNotNull(schema.reviews.imageKey),
  ];
  if (tag !== null)
    reviewConditions.push(inArray(schema.reviews.galleryCategory, categoryValuesFor(tag)));

  const reviews = await db
    .select({
      id: schema.reviews.id,
      coupleNames: schema.reviews.coupleNames,
      weddingDate: schema.reviews.weddingDate,
      imageWidth: schema.reviews.imageWidth,
      imageHeight: schema.reviews.imageHeight,
    })
    .from(schema.reviews)
    .where(and(...reviewConditions))
    .orderBy(desc(schema.reviews.createdAt))
    .limit(60);

  const curatedTiles: Tile[] = curated.map((c) => ({
    id: c.id,
    source: "curated",
    caption: c.caption ?? "",
    width: c.imageWidth ?? 1200,
    height: c.imageHeight ?? 1500,
  }));

  const reviewTiles: Tile[] = reviews.map((r) => ({
    id: r.id,
    source: "review",
    caption: captionFromReview(r.coupleNames, r.weddingDate),
    width: r.imageWidth ?? 1200,
    height: r.imageHeight ?? 1500,
  }));

  return [...curatedTiles, ...reviewTiles];
}
