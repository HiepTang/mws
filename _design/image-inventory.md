# Image Inventory — mississaugaweddsols.com

Crawled 2026-05-07 from the live Wix site. Source of truth for asset reuse on the new site.

## How Wix URLs work

Every image is on `static.wixstatic.com/media/`. The URL after `/media/` and before `/v1/...` is the **original asset ID** (e.g. `6e6d36_c2cf2fa641d34cdc88d8742c8540a4fe~mv2.png`). Everything after `/v1/` is a Wix transform (crop, fill, quality, format) — it controls the served size, not the source. To get the original full-resolution file, fetch:

```
https://static.wixstatic.com/media/<ASSET_ID>
```

For example, the home hero `…a97041022451497198267f0972c37c86~mv2.jpg` is being served at 894×508 with a 34/52 offset crop, but the underlying source is larger and uncropped.

---

## Brand

| # | Asset | Asset ID | Used on | Display size on Wix | Notes |
|---|---|---|---|---|---|
| B1 | Logo | `6e6d36_c2cf2fa641d34cdc88d8742c8540a4fe~mv2.png` | All pages (header + footer) | 237×133 (header), 225×126 (footer) | PNG with transparency expected |
| B2 | Facebook icon | `11062b_a84995cc8b024f4ea398f5744a56bc27~mv2.png` | Footer | 39×39 | Stock Wix social icon — **replace with own SVG** rather than reuse |

## Home (`/`)

| # | Asset | Asset ID | Role | Wix display | Notes |
|---|---|---|---|---|---|
| H1 | Hero | `6e6d36_a97041022451497198267f0972c37c86~mv2.jpg` (orig name `MG_3352_1.jpg`) | Full-width hero | 894×508 (cropped from 34,52) | Mid-res — request original to test if it scales for a full-bleed hero on the new site |

## Services (`/services`) — 8 service tiles

All served as 117×117 thumbnails on the live site, but the source crops are 568×568 to 4000×4000, so originals are usable at larger display sizes.

| # | Service | Asset ID | Source crop | Notes |
|---|---|---|---|---|
| S1 | Hair | `9af652ad612a4d0f985c928fa2ccfa01.jpg` | 3840×3840 from 960,0 | Looks like Wix stock |
| S2 | Photography / Videography | `6e6d36_5b101cb9d18148d89e99ba38a4336913~mv2.jpg` (orig `photo-937262_960_720.jpg`) | 568×568 | Pixabay-style stock filename |
| S3 | Lighting | `b2ce3d9023e54f30bbf3d0ec1a79133f.jpg` (orig `Twinkly Lights.jpg`) | 4000×4000 from 1000,0 | Wix stock |
| S4 | Makeup | `6e6d36_ef558402fb2848f08393c0e7aa76dd9b~mv2.jpg` (orig `TMPniccolo-9891.jpg`) | 702×702 | Likely owner-supplied or licensed |
| S5 | MC | `fa40f4482e84470db90cc20c71924447.jpg` (orig `Microphone.jpg`) | 783×783 | Wix stock |
| S6 | Transportation | `fc46c036b3b0420296800171f03d5b17.jpg` (orig `Limousine.jpg`) | 3427×3427 | Wix stock |
| S7 | Entertainment / Band | `5ba84e8aed0449ed9a4247850cad1817.jpg` (orig `Band Practice.jpg`) | 3648×3648 | Wix stock |
| S8 | Accommodations | `4d08e183cb9e4110b3754f5849fa264f.jpg` (orig `Hotel bed white and gold.jpg`) | 2848×2848 | Wix stock |

**Note:** S1, S3, S5–S8 look like generic Wix stock library images chosen because the owner didn't have her own shots for those categories. **Recommend replacing** with real photos from past weddings rather than carrying generic stock to the new site.

## Products (`/products`) — 14 items

All thumbnails are 140×140 on the live site. Source crops vary; the wedding-tray / áo dài shoots (originals 711×683 and 1024×983) are clearly Juliane's own product photography.

### Package 1 (ceremony props)

| # | Item | Asset ID | Price | Source crop |
|---|---|---|---|---|
| P1 | Wedding trays (red & gold, set of 6) | `6e6d36_d3fbaf3d9aec47edaf648140458084fe~mv2.jpg` (`MG_3330_1.jpg`) | $100 | 711×683 |
| P2 | Wedding sign (Tân Hôn / Vu Quy) | `6e6d36_68c13ff447204c76b5a85f0f1f660798~mv2.jpg` (`DSC_0004.jpg`) | $10 | 711×683 |
| P3 | Candle stands | `6e6d36_6cf837952a184cec9159025a6e4dbd96~mv2_d_3072_4608_s_4_2.jpg` (`DSC_0102.JPG`) | $20 | 3072×2941 — **largest source on the site** |
| P4 | Incense burner (3.5"×3.75") | `6e6d36_8b67d2ffc62a464f957c228ff8262b7d~mv2.jpg` (`Incense Burner.jpg`) | $20 | 403×403 — small original |
| P5 | Plastic areca | `6e6d36_fed34d21a3fe4060865124356d84bdfb~mv2.png` (`Picture1.png`) | $30 | 347×333 — small original |
| P6 | Tea set (2 styles) | `6e6d36_54f8795ad5604b9d903fa0bb9967c6be~mv2.jpg` (`MG_3354_1.jpg`) | $30 | 711×683 |
| P7 | Altar cloth (7'×6.5') | `6e6d36_34dc9d67b5604e03b4a4805df1da4260~mv2.jpg` | $30 | 1080×1037 |
| P8 | Censer | `6e6d36_fe07c54ff50c49438b86f1d1516e378c~mv2.jpg` (`Incense.jpg`) | $50 | 1536×1536 |

### Package 2 (attire)

| # | Item | Asset ID | Price | Source crop |
|---|---|---|---|---|
| P9 | Groom áo dài + hat (blue/gold/red) | `6e6d36_ae90a06fdb7f45979a7f106dc34b73c1~mv2.jpg` (`MG_3376_1.jpg`) | $100 | 1024×983 — **also reused as gallery hero** |
| P10 | Bride áo dài + hairpiece (gold or white & red) | `6e6d36_2231be62d94b453d9443772f8bc37213~mv2.jpg` (`MG_3374_1.jpg`) | $100 | 1024×983 |

### Wedding candles

| # | Item | Asset ID | Price | Source crop |
|---|---|---|---|---|
| P11 | Wedding candles (gold or multi-color, 5 sizes) | `6e6d36_034332aa0b78445eb6f34539d4b269c1~mv2_d_3072_4608_s_4_2.jpg` (`DSC_0092.JPG`) | $15–$23 | 3072×2949 |
| P12 | Wedding candles (alt) | `6e6d36_34da480ee911462e874f109d628d69e7~mv2_d_3072_4608_s_4_2.jpg` (`DSC_0089.JPG`) | (same set) | 3072×3186 |

### Decorations

| # | Item | Asset ID | Price | Source crop |
|---|---|---|---|---|
| P13 | Decoration sample 8 | `6e6d36_96b1c0bcabf344dba4fd703be45c7930~mv2.jpg` (`Decoration 8.jpg`) | $10 | 3024×2903 |
| P14 | Decoration sample 10 | `6e6d36_a9f47ba332294e8fb8d769a971a9510b~mv2.jpg` (`Decoration 10.jpg`) | $10 | 3024×3139 |

## Gallery (`/gallery`) — INCOMPLETE

The Wix gallery widget loads images dynamically via JS, so the static crawl only surfaced 2 hero/banner shots. **Manual extraction required** — easiest path is to ask the owner for the original files, or open the page in a browser and pull image URLs from the rendered DOM.

| # | Asset ID | Wix display | Notes |
|---|---|---|---|
| G1 | `6e6d36_dfe851a6a1ea48bab68b257ef2325b80~mv2.jpg` | 980×445 fit | Hero/carousel |
| G2 | `6e6d36_ae90a06fdb7f45979a7f106dc34b73c1~mv2.jpg` | 980×445 fit | **Same asset as P9 (groom áo dài)** — reused for gallery hero |

## About (`/about`) — 1 portrait

| # | Asset | Asset ID | Wix display | Notes |
|---|---|---|---|---|
| A1 | Juliane Cao headshot | `6e6d36_4d3d7e515cb8449d9a912165968a2c73~mv2_d_1925_1925_s_2.jpg` (`headshot 2.jpg`) | 130×125 cropped from 1382×1331 | Original is 1925×1925 — plenty of resolution for a larger portrait on the new site |

## Reviews (`/reviews`) — INCOMPLETE

Wix's testimonials widget also loads dynamically. Only one image surfaced via crawl, and it's served at 67×44 with a blur transform — useless as a real photo source.

| # | Asset | Asset ID | Notes |
|---|---|---|---|
| R1 | Julia Le testimonial photo | `ff2c0fa76a5347f3b0f298d9feb685de.jpg` | Served blurred 67×44 — request original from owner |

The prototype's `reviews.html` shows 6 reviews, so there are likely 5–6 more testimonial photos behind the dynamic widget that the crawl missed.

---

## Recommendations for the migration

1. **Reuse with confidence:**
   - Logo (B1) — assuming we can get the original PNG with transparency
   - Home hero (H1) — Juliane's own photography, mid-res
   - All product photos in P1–P14 — owner-shot, varying resolution. P3, P11, P12, P13, P14 have huge originals; P4, P5 have small originals and may need re-shoots if the new design displays them larger
   - Founder portrait A1 — high-res original
2. **Replace before launch:**
   - Service icons S1, S3, S5–S8 — Wix stock; carrying them forward continues to weaken the "real Vietnamese ceremonies" story the prototype is trying to tell. Better to use real ceremony shots cropped square per service.
   - Facebook icon B2 — use an SVG.
3. **Need owner input / manual extraction:**
   - Full Gallery image set (G1+) — JS-loaded; ask for the original folder
   - Testimonial photos for the 5–6 reviews that didn't surface in the crawl
   - Whether Juliane has higher-res originals for the Wix-resized product shots
4. **Pulling originals:** Append asset ID to `https://static.wixstatic.com/media/` to download at full source resolution. We'll want to do this in bulk once the keep/replace list is final.

## Open questions for the owner

- Does she have a local folder of high-res originals (especially for áo dài shoots and gallery)?
- Are services S1, S3, S5–S8 placeholders she'd happily replace, or does she want to keep them?
- Are the testimonial avatars on the Reviews page real customer photos or stock — and is there consent to republish them on the new site?
