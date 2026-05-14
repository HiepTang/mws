import Link from "next/link";
import { ProductFilters } from "@/components/product-filters";
import { T } from "@/components/lang";

type Product = {
  imgClass: string;
  badge?: { en: string; vi: string; gold?: boolean };
  imgLabel: string;
  name: { en: string; vi: string };
  price: string;
  viLabel: string;
  meta: { en: string; vi: string };
};

const PRODUCTS: Product[] = [
  {
    imgClass: "ph",
    badge: { en: "Most rented", vi: "Thuê nhiều nhất", gold: true },
    imgLabel: "Groom long dress & hat",
    name: { en: "Groom Áo Dài + Khăn Đóng", vi: "Áo dài chú rể + khăn đóng" },
    price: "$220",
    viLabel: "Áo dài & khăn đóng chú rể",
    meta: {
      en: "Rental · blue, gold, or red · sizes S–XXL",
      vi: "Cho thuê · xanh, vàng, hoặc đỏ · size S–XXL",
    },
  },
  {
    imgClass: "ph",
    imgLabel: "11-tray ceremonial set",
    name: { en: "Mâm Quả — 11 Tray Set", vi: "Mâm quả — bộ 11" },
    price: "$320",
    viLabel: "Mâm lễ vật cao cấp",
    meta: { en: "Rental · gold-leaf finish", vi: "Cho thuê · phủ vàng" },
  },
  {
    imgClass: "ph warm",
    imgLabel: "6-tray standard set",
    name: { en: "Mâm Quả — 6 Tray Set", vi: "Mâm quả — bộ 6" },
    price: "$180",
    viLabel: "Mâm lễ vật cơ bản",
    meta: { en: "Rental · red lacquer", vi: "Cho thuê · sơn mài đỏ" },
  },
  {
    imgClass: "ph",
    imgLabel: "Bride's mấn headpiece",
    name: { en: "Bride's Mấn — Pearl & Gold", vi: "Mấn cô dâu — Ngọc trai & vàng" },
    price: "$80",
    viLabel: "Mấn cô dâu",
    meta: { en: "Rental · adjustable", vi: "Cho thuê · điều chỉnh" },
  },
  {
    imgClass: "ph",
    imgLabel: "Wine tray with two cups",
    name: { en: "Mâm Rượu — Wine Tray", vi: "Mâm rượu" },
    price: "$60",
    viLabel: "Mâm rượu & chén",
    meta: { en: "Rental · brass", vi: "Cho thuê · đồng" },
  },
  {
    imgClass: "ph dark",
    imgLabel: "Altar table — full set",
    name: { en: "Bàn Thờ — Ancestor Altar", vi: "Bàn thờ gia tiên" },
    price: "$420",
    viLabel: "Bàn thờ gia tiên đầy đủ",
    meta: { en: "Rental · setup & takedown", vi: "Cho thuê · lắp dựng" },
  },
];

export const metadata = {
  title: "Products",
};

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
              en="Áo dài, ceremonial trays, headpieces, altarware. Most rentals; some take-home keepsakes."
              vi="Áo dài, mâm lễ, mấn, đồ thờ. Đa số cho thuê; một số dành làm kỷ vật."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 56 }}>
        <div className="shell">
          <ProductFilters
            filters={[
              { en: "All", vi: "Tất cả" },
              { en: "Áo dài", vi: "Áo dài" },
              { en: "Trays", vi: "Mâm lễ" },
              { en: "Headpieces", vi: "Mấn & khăn đóng" },
              { en: "Altar", vi: "Bàn thờ gia tiên" },
              { en: "Keepsakes", vi: "Kỷ vật" },
            ]}
          />

          <div className="product-grid">
            {PRODUCTS.map((p, i) => (
              <article key={i} className="product">
                <div className={`img ${p.imgClass}`}>
                  {p.badge && (
                    <span className={`badge ${p.badge.gold ? "gold" : ""}`}>
                      <T en={p.badge.en} vi={p.badge.vi} />
                    </span>
                  )}
                  <span>{p.imgLabel}</span>
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

          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-muted)",
              marginTop: 40,
              maxWidth: "70ch",
            }}
          >
            <T
              en="* Rentals include cleaning & minor alteration. Damage deposit applies. Custom sizes & colours available with 8 weeks' notice."
              vi="* Cho thuê đã bao gồm giặt & sửa nhỏ. Có đặt cọc. Size & màu riêng cần đặt trước 8 tuần."
            />
          </p>
        </div>
      </section>

      <section>
        <div className="shell">
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
