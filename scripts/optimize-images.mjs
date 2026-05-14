// One-shot script to process the chosen photos from docs/images/{from_owner,from_wix}
// into the production-ready files under public/images/.
//
// Run with: pnpm img:optimize
// (or: node scripts/optimize-images.mjs)
//
// Each entry says: source → destination, with sensible Sharp pipeline.

import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";

const jobs = [
  // === Brand
  // Footer logo (transparent PNG, white-on-dark-friendly: invert colours).
  {
    src: "docs/images/from_wix/logo.png",
    dst: "public/images/footer-logo.png",
    pipeline: (img) => img.negate({ alpha: false }), // invert RGB but keep alpha
    format: "png",
  },

  // === Home
  {
    src: "docs/images/from_owner/Trao_Mam_1.jpeg",
    dst: "public/images/home/hero-main.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },

  // === Founder portrait (Juliane). Wix CDN added a blurred halo around the
  // central square; we crop to the centre square and resize to 4:5 portrait.
  {
    src: "docs/images/from_wix/about-founder.jpg",
    dst: "public/images/founder.jpg",
    // Source is 1925×1925 with ~250px of blurred halo on each side. Extract
    // the central 1400×1700 area, then resize to 4:5 portrait.
    extract: { left: 260, top: 100, width: 1400, height: 1750 },
    fit: "cover",
    width: 1200,
    height: 1500,
  },

  // === Products
  {
    src: "docs/images/from_owner/TanHon.jpg",
    dst: "public/images/products/wedding-sign.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-candle-stands.jpg",
    dst: "public/images/products/candle-stands.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_owner/Incense Burner.jpg",
    dst: "public/images/products/incense-burner.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-plastic-areca.png",
    dst: "public/images/products/plastic-areca.png",
    fit: "cover",
    width: 1200,
    height: 1500,
    format: "png",
  },
  {
    src: "docs/images/from_owner/Tea sets.JPG",
    dst: "public/images/products/tea-set.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-altar-cloth.jpg",
    dst: "public/images/products/altar-cloth.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-censer.jpg",
    dst: "public/images/products/censer.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_owner/RedAoDai_Groom.JPG",
    dst: "public/images/products/groom-ao-dai.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_owner/AoDai_Bride.JPG",
    dst: "public/images/products/bride-ao-dai.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-wedding-candles-1.jpg",
    dst: "public/images/products/wedding-candles.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
  {
    src: "docs/images/from_wix/product-decoration-1.jpg",
    dst: "public/images/products/decorations.jpg",
    fit: "cover",
    width: 1200,
    height: 1500,
  },
];

const QUALITY = 84;

async function run() {
  for (const job of jobs) {
    if (!existsSync(job.src)) {
      console.warn(`✗ missing source: ${job.src} — skipping`);
      continue;
    }

    mkdirSync(dirname(job.dst), { recursive: true });

    let img = sharp(job.src).rotate(); // honour EXIF orientation

    if (job.extract) {
      img = img.extract(job.extract);
    }

    if (job.width || job.height) {
      img = img.resize({
        width: job.width,
        height: job.height,
        fit: job.fit ?? "cover",
        position: "centre",
        withoutEnlargement: false,
      });
    }

    if (job.pipeline) {
      img = job.pipeline(img);
    }

    const fmt = job.format ?? (job.dst.endsWith(".png") ? "png" : "jpeg");
    if (fmt === "png") {
      img = img.png({ compressionLevel: 9 });
    } else {
      img = img.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });
    }

    await img.toFile(job.dst);
    const meta = await sharp(job.dst).metadata();
    const sizeKB = Math.round((meta.size ?? 0) / 1024);
    console.log(
      `✓ ${job.dst} (${meta.width}×${meta.height}, ${sizeKB} KB)`,
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
