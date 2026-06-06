import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/lang";

type Item = {
  imgClass: string;
  imgLabel: string;
  // When set, the hatched .ph placeholder is replaced by a real <Image>.
  imageSrc?: string;
  imageAlt?: { en: string; vi: string };
  name: { en: string; vi: string };
  price: string;
  viLabel: string;
  meta: { en: string; vi: string };
  badge?: { en: string; vi: string; gold?: boolean };
};

// Items in Package 1 (ceremonial pieces). Same items also rent individually
// at the prices below. Bundle total individually = $290; Package 1 = $220
// (the bundle saves $70).
const PACKAGE_1_ITEMS: Item[] = [
  {
    imgClass: "ph warm",
    imgLabel: "Wedding trays — set of 6",
    imageSrc: "/images/products/wedding-trays.jpg",
    imageAlt: {
      en: "Gold silk-covered wedding trays with embroidered double-happiness symbols",
      vi: "Mâm quả phủ lụa vàng thêu chữ Song Hỷ",
    },
    name: { en: "Wedding Trays — Set of 6", vi: "Mâm quả — bộ 6" },
    price: "$100",
    viLabel: "Mâm lễ vật",
    meta: {
      en: "Rental\nGold · 16″ diameter × 4¼″ height\nRed · 14″ diameter × 4¼″ height",
      vi: "Cho thuê\nVàng · đường kính 16″ × cao 4¼″\nĐỏ · đường kính 14″ × cao 4¼″",
    },
  },
  {
    imgClass: "ph",
    imgLabel: "Wedding sign — Tân Hôn / Vu Quy",
    imageSrc: "/images/products/wedding-sign.jpg",
    imageAlt: { en: "Tân Hôn / Vu Quy wedding sign", vi: "Bảng chữ Tân Hôn / Vu Quy" },
    name: { en: "Wedding Sign", vi: "Bảng chữ" },
    price: "$10",
    viLabel: "Tân Hôn / Vu Quy",
    meta: {
      en: "Rental · Tân Hôn or Vu Quy",
      vi: "Cho thuê · Tân Hôn hoặc Vu Quy",
    },
  },
  {
    imgClass: "ph",
    imgLabel: "Candle stands",
    imageSrc: "/images/products/candle-stands.jpg",
    imageAlt: { en: "Wedding candle stands", vi: "Chân đèn cầy cưới" },
    name: { en: "Candle Stands", vi: "Chân đèn cầy" },
    price: "$20",
    viLabel: "Chân đèn cầy lễ",
    meta: { en: "Rental", vi: "Cho thuê" },
  },
  {
    imgClass: "ph",
    imgLabel: "Incense burner",
    imageSrc: "/images/products/incense-burner.jpg",
    imageAlt: { en: "Incense burner / lư hương", vi: "Lư hương" },
    name: { en: "Incense Burner", vi: "Lư hương" },
    price: "$20",
    viLabel: "Lư hương",
    meta: {
      en: "Rental · 3½″ diameter × 3¾″ height",
      vi: "Cho thuê · đường kính 3½″ × cao 3¾″",
    },
  },
  {
    imgClass: "ph warm",
    imgLabel: "Plastic areca",
    imageSrc: "/images/products/plastic-areca.png",
    imageAlt: { en: "Plastic areca decoration / cau giả", vi: "Cau giả lễ cưới" },
    name: { en: "Plastic Areca", vi: "Cau giả" },
    price: "$30",
    viLabel: "Cau lễ bằng nhựa",
    meta: { en: "Rental", vi: "Cho thuê" },
  },
  {
    imgClass: "ph",
    imgLabel: "Tea set",
    imageSrc: "/images/products/tea-set.jpg",
    imageAlt: { en: "Vietnamese wedding tea set", vi: "Bộ trà cưới" },
    name: { en: "Tea Set", vi: "Bộ trà" },
    price: "$30",
    viLabel: "Bộ trà cưới",
    meta: { en: "Rental · 2 styles", vi: "Cho thuê · 2 kiểu" },
  },
  {
    imgClass: "ph warm",
    imgLabel: "Altar tablecloth",
    imageSrc: "/images/products/altar-cloth.jpg",
    imageAlt: {
      en: "Altar tablecloth for the ancestor altar",
      vi: "Khăn trải bàn thờ gia tiên",
    },
    name: { en: "Altar Tablecloth", vi: "Khăn trải bàn thờ" },
    price: "$30",
    viLabel: "Khăn trải bàn thờ gia tiên",
    meta: { en: "Rental · 7′ × 6.5′", vi: "Cho thuê · 7′ × 6.5′" },
  },
  {
    imgClass: "ph dark",
    imgLabel: "Censer",
    imageSrc: "/images/products/censer.jpg",
    imageAlt: { en: "Censer / lư trầm", vi: "Lư trầm hương" },
    name: { en: "Censer", vi: "Lư trầm" },
    price: "$50",
    viLabel: "Lư trầm hương",
    meta: { en: "Rental", vi: "Cho thuê" },
  },
];

// Áo dài rentals (Package 2 add-ons; also rentable individually).
const AODAI_ITEMS: Item[] = [
  {
    imgClass: "ph",
    badge: { en: "Most rented", vi: "Thuê nhiều nhất", gold: true },
    imgLabel: "Groom áo dài & khăn đóng",
    imageSrc: "/images/products/groom-ao-dai.jpg",
    imageAlt: {
      en: "Groom in red áo dài and khăn đóng",
      vi: "Chú rể trong áo dài đỏ và khăn đóng",
    },
    name: { en: "Groom Áo Dài + Khăn Đóng", vi: "Áo dài chú rể + khăn đóng" },
    price: "$100",
    viLabel: "Áo dài & khăn đóng chú rể",
    meta: {
      en: "Rental · blue, gold, or red",
      vi: "Cho thuê · xanh, vàng, hoặc đỏ",
    },
  },
  {
    imgClass: "ph warm",
    imgLabel: "Bride áo dài & hair piece",
    imageSrc: "/images/products/bride-ao-dai.jpg",
    imageAlt: {
      en: "Bride áo dài with hair piece",
      vi: "Áo dài cô dâu và mấn",
    },
    name: { en: "Bride Áo Dài + Hair Piece", vi: "Áo dài cô dâu + mấn" },
    price: "$100",
    viLabel: "Áo dài & mấn cô dâu",
    meta: {
      en: "Rental · gold, or white & red",
      vi: "Cho thuê · vàng, hoặc trắng & đỏ",
    },
  },
];

// Standalone purchases (not rentals — keepsakes).
const PURCHASE_ITEMS: Item[] = [
  {
    imgClass: "ph",
    imgLabel: "Wedding candles — 5 sizes",
    imageSrc: "/images/products/wedding-candles.jpg",
    imageAlt: {
      en: "Wedding candles in gold and multi-coloured varieties",
      vi: "Đèn cầy vàng và nhiều màu",
    },
    name: { en: "Wedding Candles", vi: "Đèn cầy" },
    price: "$15–$35",
    viLabel: "Đèn cầy · 5 cỡ",
    meta: {
      en: "Purchase · gold or multi-coloured · 5 sizes\n2.8–3.5 cm diameter × 29–42.5 cm height",
      vi: "Mua · vàng hoặc nhiều màu · 5 cỡ\nđường kính 2.8–3.5 cm × cao 29–42.5 cm",
    },
  },
  {
    imgClass: "ph warm",
    imgLabel: "Decorative pieces — many designs",
    imageSrc: "/images/products/decorations.jpg",
    imageAlt: {
      en: "Decorative pieces for the wedding ceremony",
      vi: "Đồ trang trí lễ cưới",
    },
    name: { en: "Decorative Pieces", vi: "Đồ trang trí" },
    price: "$10",
    viLabel: "Đồ trang trí lễ",
    meta: {
      en: "Purchase · many designs (see gallery)",
      vi: "Mua · nhiều mẫu (xem thư viện)",
    },
  },
];

type PackageCard = {
  tag: { en: string; vi: string };
  title: { en: string; vi: string };
  price: string;
  bullets: { en: string; vi: string }[];
  note: { en: string; vi: string };
  featured?: boolean;
};

const PACKAGES: PackageCard[] = [
  {
    tag: { en: "Bundle", vi: "Gói cơ bản" },
    title: { en: "Package 1 — Ceremony", vi: "Gói 1 — Lễ gia tiên" },
    price: "$220",
    bullets: [
      { en: "Wedding trays (set of 6)", vi: "Mâm quả (bộ 6)" },
      { en: "Wedding sign — Tân Hôn / Vu Quy", vi: "Bảng chữ Tân Hôn / Vu Quy" },
      { en: "Candle stands & censer", vi: "Chân đèn cầy & lư trầm" },
      { en: "Incense burner", vi: "Lư hương" },
      { en: "Plastic areca", vi: "Cau giả" },
      { en: "Tea set (2 styles)", vi: "Bộ trà (2 kiểu)" },
      { en: "Altar tablecloth (7′ × 6.5′)", vi: "Khăn trải bàn thờ (7′ × 6.5′)" },
    ],
    note: {
      en: "All 8 ceremonial pieces. Individually they'd be $290 — bundle saves $70.",
      vi: "Trọn 8 món lễ gia tiên. Thuê riêng tổng $290 — gói tiết kiệm $70.",
    },
  },
  {
    tag: { en: "Most chosen", vi: "Phổ biến nhất" },
    title: { en: "Package 2 — Ceremony + Áo Dài", vi: "Gói 2 — Lễ gia tiên + Áo dài" },
    price: "$420",
    bullets: [
      { en: "Everything in Package 1", vi: "Toàn bộ Gói 1" },
      { en: "Groom áo dài + khăn đóng (blue, gold, or red)", vi: "Áo dài & khăn đóng chú rể (xanh, vàng, đỏ)" },
      { en: "Bride áo dài + hair piece (gold, or white & red)", vi: "Áo dài & mấn cô dâu (vàng, hoặc trắng & đỏ)" },
    ],
    note: {
      en: "Package 1 plus both áo dài rentals. Saves $70 vs. renting individually.",
      vi: "Gói 1 cộng cả hai bộ áo dài. Tiết kiệm $70 so với thuê riêng.",
    },
    featured: true,
  },
];

export const metadata = {
  title: "Products",
};

function ItemGrid({ items }: { items: Item[] }) {
  return (
    <div className="product-grid">
      {items.map((p, i) => (
        <article key={i} className="product">
          <div className={`img ${p.imageSrc ? "" : p.imgClass}`}>
            {p.badge && (
              <span className={`badge ${p.badge.gold ? "gold" : ""}`}>
                <T en={p.badge.en} vi={p.badge.vi} />
              </span>
            )}
            {p.imageSrc ? (
              <Image
                src={p.imageSrc}
                alt={p.imageAlt?.en ?? p.imgLabel}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 360px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span>{p.imgLabel}</span>
            )}
          </div>
          <div className="head">
            <span className="name serif">
              <T en={p.name.en} vi={p.name.vi} />
            </span>
            <span className="price">{p.price}</span>
          </div>
          <span className="vi">{p.viLabel}</span>
          <span className="meta">
            <T en={p.meta.en} vi={p.meta.vi} />
          </span>
        </article>
      ))}
    </div>
  );
}

export default function ProductsPage() {
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
              <T en="Products" vi="Sản phẩm" />
            </span>
          </div>
          <h1 className="serif">
            <T en="The pieces that make" vi="Những vật phẩm" />
            <br />
            <span className="accent">
              <T en="a wedding feel like home." vi="cho một đám cưới Việt." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="Ceremonial trays, áo dài, altarware. Most items rent together as a package or à la carte; candles and decorations are take-home keepsakes."
              vi="Mâm lễ, áo dài, đồ thờ. Hầu hết thuê theo gói hoặc thuê riêng; đèn cầy và đồ trang trí là kỷ vật mang về."
            />
          </p>
        </div>
      </section>

      {/* === Packages === */}
      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="section-head center">
            <span className="eyebrow eyebrow-gold">
              <span className="dash" />
              <T en="Bundle & save" vi="Gói tiết kiệm" />
            </span>
            <h2 className="serif">
              <T en="Two packages," vi="Hai gói," />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="your choice." vi="bạn chọn." />
              </span>
            </h2>
            <p style={{ textAlign: "center", marginTop: 12 }}>
              <T
                en="A $100–$200 refundable deposit holds your package — returned in full after items come back in good condition."
                vi="Đặt cọc $100–$200 hoàn lại — sẽ trả lại đầy đủ sau khi kiểm tra đồ trở về nguyên trạng."
              />
            </p>
          </div>

          <div className="package-grid">
            {PACKAGES.map((p, i) => (
              <div key={i} className={`pkg ${p.featured ? "featured" : ""}`}>
                <span className="pkg-tag">
                  <T en={p.tag.en} vi={p.tag.vi} />
                </span>
                <h3 className="serif">
                  <T en={p.title.en} vi={p.title.vi} />
                </h3>
                <span className="pkg-price">
                  <span className="from">
                    <T en="Package" vi="Gói" />
                  </span>
                  {p.price}
                </span>
                <ul>
                  {p.bullets.map((b, j) => (
                    <li key={j}>
                      <T en={b.en} vi={b.vi} />
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--mono)",
                    letterSpacing: "0.02em",
                    color: p.featured ? "rgba(245,235,217,0.55)" : "var(--ink-muted)",
                    marginTop: 4,
                  }}
                >
                  <T en={p.note.en} vi={p.note.vi} />
                </p>
                <Link
                  href="/contact"
                  className={`btn ${p.featured ? "btn-gold" : "btn-ghost"}`}
                >
                  <T en="Reserve" vi="Đặt giữ" />
                  <span className="arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Individual rentals === */}
      <section>
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">
              <span className="dash" />
              <T en="Individual rentals" vi="Thuê riêng" />
            </span>
            <h2 className="serif">
              <T en="Pieces," vi="Từng món," />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="à la carte." vi="thuê riêng." />
              </span>
            </h2>
            <p style={{ marginTop: 12 }}>
              <T
                en="Rent any item below on its own — or bundle them as Package 1 or Package 2 above and save."
                vi="Thuê từng món dưới đây — hoặc gộp thành Gói 1 / Gói 2 ở trên để tiết kiệm."
              />
            </p>
          </div>

          <h3
            className="serif"
            style={{ fontSize: 24, marginBottom: 16, marginTop: 24, color: "var(--ink)" }}
          >
            <T en="Áo dài & attire" vi="Áo dài & lễ phục" />
          </h3>
          <ItemGrid items={AODAI_ITEMS} />

          <h3
            className="serif"
            style={{ fontSize: 24, marginBottom: 16, marginTop: 48, color: "var(--ink)" }}
          >
            <T en="Ceremonial pieces" vi="Đồ lễ gia tiên" />
          </h3>
          <ItemGrid items={PACKAGE_1_ITEMS} />
        </div>
      </section>

      {/* === For purchase === */}
      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow eyebrow-gold">
              <span className="dash" />
              <T en="For purchase" vi="Mua" />
            </span>
            <h2 className="serif">
              <T en="Candles &" vi="Đèn cầy &" />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="decorations." vi="đồ trang trí." />
              </span>
            </h2>
            <p style={{ marginTop: 12 }}>
              <T
                en="Take-home keepsakes — not rentals. Yours to keep after the day."
                vi="Kỷ vật mang về — không phải đồ thuê. Của bạn sau ngày cưới."
              />
            </p>
          </div>

          <ItemGrid items={PURCHASE_ITEMS} />
        </div>
      </section>

      {/* === Disclaimer + CTA === */}
      <section>
        <div className="shell">
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-muted)",
              maxWidth: "70ch",
              marginBottom: 40,
            }}
          >
            <T
              en="* $100–$200 refundable damage deposit applies to packages. Returned in full after items come back in original condition. Individual rentals follow the same care policy."
              vi="* Đặt cọc $100–$200 cho gói thuê, hoàn lại đầy đủ sau khi kiểm tra. Thuê riêng cũng theo chính sách tương tự."
            />
          </p>

          <div className="cta-banner">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
                <span className="dash" />
                <T en="See it in person" vi="Xem tận nơi" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Visit the studio" vi="Đến studio" />{" "}
                <span className="gold">
                  <T en="for a fitting." vi="để thử đồ." />
                </span>
              </h2>
              <p>
                <T
                  en="Photos can only show so much. Come try the áo dài, hold a tray, see the lacquer up close."
                  vi="Ảnh chỉ kể được phần nào. Đến thử áo dài, cầm mâm, xem sơn mài tận tay."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Book a fitting" vi="Đặt thử đồ" />
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
