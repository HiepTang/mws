// Local seed script — POSTs each chosen photo to /api/seed-gallery on the
// live site. The route is gated by SEED_GALLERY_TOKEN; both this script and
// the VPS env need the same value.
//
// Run with:
//   SEED_GALLERY_TOKEN=<token> SITE_URL=https://mws.kho-ai.com node scripts/seed-gallery.mjs
//
// SITE_URL is optional; defaults to https://mws.kho-ai.com.
//
// After the seed batch is loaded successfully:
//   1. Remove SEED_GALLERY_TOKEN from the VPS .env
//   2. Restart mws-web (so the route returns 410 again)
//   3. (Optional cleanup commit) Delete src/app/api/seed-gallery/route.ts and this script
//
// Re-running is safe — each call appends a new row (and a new MinIO object).
// Already-seeded photos can be removed via /admin/gallery's delete button.

import { existsSync, openAsBlob } from "node:fs";
import { basename } from "node:path";

const TOKEN = process.env.SEED_GALLERY_TOKEN;
const SITE_URL = process.env.SITE_URL ?? "https://mws.kho-ai.com";
const ENDPOINT = `${SITE_URL}/api/seed-gallery`;

if (!TOKEN) {
  console.error("Set SEED_GALLERY_TOKEN. Example:");
  console.error("  SEED_GALLERY_TOKEN=xxx node scripts/seed-gallery.mjs");
  process.exit(1);
}

const seeds = [
  // --- Tea Ceremony (lễ trà) ---
  { src: "docs/images/from_owner/Trao_Mam.jpeg", category: "tea_ceremony", caption: "Trao mâm — the procession arrives" },
  { src: "docs/images/from_owner/Trao_Mam_1.jpeg", category: "tea_ceremony", caption: "Handing trays to the bride's family" },
  { src: "docs/images/from_owner/DonKhach.jpeg", category: "tea_ceremony", caption: "Welcoming the guests" },
  { src: "docs/images/from_owner/Couple_1.jpg", category: "tea_ceremony", caption: "Couple portrait, áo dài" },

  // --- Áo Dài ---
  { src: "docs/images/from_owner/BlueAoDai_Groom.jpg", category: "ao_dai", caption: "Groom in blue áo dài" },
  { src: "docs/images/from_owner/RedAoDai_Groom.JPG", category: "ao_dai", caption: "Groom in red áo dài" },
  { src: "docs/images/from_owner/YellowAoDai_Groom.jpg", category: "ao_dai", caption: "Groom in gold áo dài" },
  { src: "docs/images/from_owner/AoDai_Bride.JPG", category: "ao_dai", caption: "Bride áo dài" },

  // --- Reception (tiệc cưới) ---
  // Owner filename is Reception.jpeg (with the 'e').
  { src: "docs/images/from_owner/Reception.jpeg", category: "reception", caption: "Reception, the families together" },

  // --- Family (gia đình) ---
  { src: "docs/images/from_owner/Trao_Mam.jpg", category: "family", caption: "Three generations at the procession" },
  { src: "docs/images/from_owner/RuocDau.jpg", category: "family", caption: "Rước dâu — wedding procession" },

  // --- Details (chi tiết) ---
  { src: "docs/images/from_owner/BanTho.jpg", category: "details", caption: "Ancestor altar" },
  { src: "docs/images/from_owner/trang tri ban tho gia tien.jpg", category: "details", caption: "Altar decoration" },
  { src: "docs/images/from_owner/Hinh_trang_tri_1.jpg", category: "details", caption: "Ceremonial details" },
  { src: "docs/images/from_wix/product-decoration-2.jpg", category: "details", caption: "Lacquer & embroidery detail" },
];

let ok = 0;
let failed = 0;

for (const [i, job] of seeds.entries()) {
  const label = `[${i + 1}/${seeds.length}] ${basename(job.src)}`;

  if (!existsSync(job.src)) {
    console.error(`✗ ${label} — file not found: ${job.src}`);
    failed++;
    continue;
  }

  try {
    const blob = await openAsBlob(job.src);
    const form = new FormData();
    form.append("image", blob, basename(job.src));
    form.append("category", job.category);
    if (job.caption) form.append("caption", job.caption);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`✗ ${label} — HTTP ${res.status}: ${text.slice(0, 200)}`);
      failed++;
      continue;
    }

    const data = await res.json();
    console.log(
      `✓ ${label} → ${job.category} · ${data.dimensions.width}×${data.dimensions.height} · ${data.sizeKB} KB · ${data.id}`,
    );
    ok++;
  } catch (err) {
    console.error(`✗ ${label} — ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  }
}

console.log();
console.log(`Seeded ${ok}/${seeds.length} photos. ${failed} failed.`);
console.log(`Visit ${SITE_URL}/admin/gallery to inspect, edit captions, or re-order.`);
process.exit(failed > 0 ? 1 : 0);
