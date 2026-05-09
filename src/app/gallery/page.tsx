import Link from "next/link";
import { GalleryTabs } from "@/components/gallery-tabs";
import { T } from "@/components/lang";

type Tile = {
  size: string;
  imgClass: string;
  imgLabel: string;
  caption: string;
};

const TILES: Tile[] = [
  { size: "t-2x2", imgClass: "ph warm", imgLabel: "Bride & groom — tea ceremony portrait", caption: "Linh & Thomas, August 2025" },
  { size: "t-1x1s", imgClass: "ph", imgLabel: "Áo dài close-up", caption: "Crimson lace, hand-stitched" },
  { size: "t-1x1", imgClass: "ph dark", imgLabel: "Hands offering tea", caption: "First cup, to the elders" },
  { size: "t-1x1", imgClass: "ph", imgLabel: "Mâm quả, 11 trays", caption: "The procession arrives" },
  { size: "t-3x2", imgClass: "ph warm", imgLabel: "Reception hall, golden hour", caption: "Phương & Daniel, May 2025" },
  { size: "t-1x1s", imgClass: "ph", imgLabel: "Bride hair detail", caption: "Pearl & gold mấn" },
  { size: "t-1x1", imgClass: "ph dark", imgLabel: "Father walks bride", caption: "Down the aisle" },
  { size: "t-1x1", imgClass: "ph warm", imgLabel: "Wine cups, raised", caption: "A toast to ancestors" },
  { size: "t-2x1", imgClass: "ph", imgLabel: "Family group portrait", caption: "Three generations, both sides" },
  { size: "t-1x1", imgClass: "ph", imgLabel: "Bouquet on chair", caption: "Peonies, just before the walk" },
  { size: "t-1x1", imgClass: "ph dark", imgLabel: "Live band setup", caption: "Vietnamese ballad set" },
  { size: "t-2x2", imgClass: "ph warm", imgLabel: "Couple — first dance", caption: "Kim & Andrew, October 2024" },
  { size: "t-1x1", imgClass: "ph", imgLabel: "Cake — three tiers", caption: "Fresh-flower topper" },
  { size: "t-1x1", imgClass: "ph", imgLabel: "Limousine arrival", caption: "Stretch, 10-passenger" },
  { size: "t-2x1", imgClass: "ph dark", imgLabel: "MC at reception", caption: "Trilingual, mid-toast" },
];

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
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
            <T en="A hundred & twenty days," vi="Một trăm hai mươi ngày," />
            <br />
            <span className="accent">
              <T en="held in pictures." vi="lưu trong ảnh." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="Browse moments from real Mississauga weddings — tea ceremonies, áo dài fittings, the quiet glance before the procession."
              vi="Khoảnh khắc thật từ các đám cưới ở Mississauga — lễ trà, thử áo dài, ánh mắt yên lặng trước lễ rước dâu."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 56 }}>
        <div className="shell">
          <GalleryTabs
            tabs={[
              { en: "All Moments", vi: "Tất cả" },
              { en: "Tea Ceremony", vi: "Lễ trà" },
              { en: "Áo Dài", vi: "Áo dài" },
              { en: "Reception", vi: "Tiệc cưới" },
              { en: "Family", vi: "Gia đình" },
              { en: "Details", vi: "Chi tiết" },
            ]}
          />

          <div className="gallery-mosaic">
            {TILES.map((t, i) => (
              <div key={i} className={`tile ${t.size}`}>
                <div className={t.imgClass}>
                  <span>{t.imgLabel}</span>
                </div>
                <span className="caption">{t.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="cta-banner">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
                <span className="dash" />
                <T en="More on Instagram" vi="Theo dõi Instagram" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Follow us" vi="Theo dõi chúng tôi" /> <span className="gold">@mwsweddings</span>
              </h2>
              <p>
                <T
                  en="New stories every week. Behind-the-scenes from our studio, real ceremonies, founder notes."
                  vi="Câu chuyện mới mỗi tuần. Hậu trường studio, lễ cưới thực tế, ghi chép từ người sáng lập."
                />
              </p>
            </div>
            <div className="actions">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                <T en="Open Instagram" vi="Mở Instagram" />
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
