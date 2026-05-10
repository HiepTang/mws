import { asc, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db, schema } from "@/db";
import { categoryLabel, GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import { GalleryUploadForm } from "./upload-form";
import { ImageRowControls } from "./image-row-controls";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  // Fetch all gallery images grouped by category, sort_order ascending
  // (lowest renders first on /gallery).
  const all = await db
    .select()
    .from(schema.galleryImages)
    .orderBy(asc(schema.galleryImages.category), asc(schema.galleryImages.sortOrder), desc(schema.galleryImages.createdAt));

  const byCategory = new Map<string, typeof all>();
  for (const cat of GALLERY_CATEGORIES) {
    byCategory.set(cat.value, []);
  }
  for (const img of all) {
    const list = byCategory.get(img.category);
    if (list) list.push(img);
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1 className="serif">Gallery</h1>
          <p className="admin-sub">
            <Link href="/admin" style={{ color: "var(--red)" }}>
              ← Back to admin
            </Link>
            {" · "}
            Curated photos that appear on the public Gallery.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn btn-ghost ac-btn-sm">
            Sign out
          </button>
        </form>
      </header>

      <GalleryUploadForm />

      {GALLERY_CATEGORIES.map((cat) => {
        const items = byCategory.get(cat.value) ?? [];
        return (
          <section key={cat.value} className="admin-section" style={{ marginBottom: 40 }}>
            <header className="admin-section-head">
              <h2 className="serif">
                {cat.en}{" "}
                <span style={{ color: "var(--ink-muted)", fontSize: 14 }}>
                  ({items.length})
                </span>
              </h2>
            </header>
            {items.length === 0 ? (
              <p className="admin-empty">No photos in {cat.en} yet.</p>
            ) : (
              <ul className="ag-list">
                {items.map((img) => (
                  <li key={img.id} className={`ag-card ${img.hidden ? "ag-hidden" : ""}`}>
                    <div className="ag-thumb">
                      <Image
                        src={`/api/gallery-image/${img.id}`}
                        alt={img.caption ?? "Gallery photo"}
                        width={img.imageWidth ?? 800}
                        height={img.imageHeight ?? 800}
                        sizes="(max-width: 700px) 100vw, 360px"
                        unoptimized
                      />
                      {img.hidden && <span className="ag-hidden-badge">Hidden</span>}
                    </div>
                    <ImageRowControls
                      id={img.id}
                      caption={img.caption}
                      category={img.category}
                      hidden={img.hidden}
                    />
                    <p className="ag-meta">
                      In <strong>{categoryLabel(img.category)}</strong> · order{" "}
                      {img.sortOrder} · uploaded by {img.uploadedBy ?? "—"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
