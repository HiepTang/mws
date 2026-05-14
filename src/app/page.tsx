import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/lang";

type ServiceCard = {
  img: string;
  imgLabel: string;
  imageSrc?: string;
  imageAlt?: { en: string; vi: string };
  num: string;
  title: { en: string; vi: string };
  vi: string;
  body: { en: string; vi: string };
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    img: "ph warm",
    imgLabel: "Bride makeup",
    num: "01 / Beauty",
    title: { en: "Hair & Makeup", vi: "Tóc & trang điểm" },
    vi: "Tóc & trang điểm cô dâu",
    body: {
      en: "Bridal-led by Juliane, a certified makeup artist. Trial included. Touch-ups across the day.",
      vi: "Trang điểm bởi Juliane, chuyên gia có chứng chỉ. Bao gồm thử và dặm phấn cả ngày.",
    },
  },
  {
    img: "ph",
    imgLabel: "Tea ceremony tray",
    imageSrc: "/images/products/tea-set.jpg",
    imageAlt: {
      en: "Vietnamese wedding tea set",
      vi: "Bộ trà cưới Việt",
    },
    num: "02 / Ceremony",
    title: { en: "Tea Ceremony Setup", vi: "Lễ trà" },
    vi: "Mâm trà & lễ vật",
    body: {
      en: "Tray rentals, áo dài for the bride (gold, or white & red) and groom (blue, gold, or red) with khăn đóng, the wine tray, and the ceremonial pieces.",
      vi: "Cho thuê mâm lễ, áo dài cho cô dâu (vàng, hoặc trắng & đỏ) và chú rể (xanh, vàng, đỏ) kèm khăn đóng, mâm rượu, và đồ lễ trọn bộ.",
    },
  },
  {
    img: "ph dark",
    imgLabel: "MC at reception",
    num: "03 / Voice",
    title: { en: "Bilingual MC", vi: "MC song ngữ" },
    vi: "MC tiếng Việt & Anh",
    body: {
      en: "A host who knows when to slow down for an elder's toast, when to translate a joke, and when to step out of the way. Vietnamese and English, all night long.",
      vi: "MC biết khi nào chậm lại cho lời chúc của người lớn, khi nào dịch câu đùa, khi nào lùi lại. Tiếng Việt và tiếng Anh trọn buổi tiệc.",
    },
  },
  {
    img: "ph warm",
    imgLabel: "Limousine arrival",
    num: "04 / Arrival",
    title: { en: "Limousine", vi: "Limousine" },
    vi: "Limousine cưới",
    body: {
      en: "A chauffeured limousine for the wedding party — 6- or 10-passenger options for the procession, the photo shoot, and the entrance.",
      vi: "Limousine có tài xế cho đoàn cưới — loại 6 hoặc 10 chỗ cho lễ rước dâu, chụp ảnh, và lúc tiến vào tiệc.",
    },
  },
  {
    img: "ph",
    imgLabel: "Photographer at the ceremony",
    num: "05 / Memory",
    title: { en: "Photo & Video", vi: "Ảnh & video" },
    vi: "Ảnh & video cưới",
    body: {
      en: "A photo and video team that knows when to step in and when to disappear. Every moment that matters, kept.",
      vi: "Đội ảnh và video biết khi nào tiến tới, khi nào lùi lại. Mỗi khoảnh khắc quan trọng đều được lưu giữ.",
    },
  },
  {
    img: "ph dark",
    imgLabel: "Live band setup",
    num: "06 / Sound",
    title: { en: "Live Band or DJ", vi: "Ban nhạc / DJ" },
    vi: "Ban nhạc hoặc DJ",
    body: {
      en: "Vietnamese ballads, Canadian classics, or a Spotify queue handed over — your call.",
      vi: "Nhạc Việt, nhạc Canada, hoặc playlist riêng — bạn chọn.",
    },
  },
];

const REVIEWS_PREVIEW = [
  {
    avatar: "L",
    quote: {
      en: "“Juliane held our hands through every part of the ceremony. My fiancé isn't Vietnamese and she made him feel like family from day one.”",
      vi: "“Cô Juliane dìu dắt chúng tôi qua từng nghi lễ. Chồng mình không phải người Việt nhưng cô làm anh ấy cảm thấy như người trong nhà.”",
    },
    name: "Linh & Thomas",
    detail: "Married Aug 2025 · Mississauga",
  },
  {
    avatar: "P",
    quote: {
      en: "“The áo dài fit perfectly and the tea ceremony was the most meaningful 30 minutes of our lives. Worth every cent.”",
      vi: "“Áo dài vừa vặn và lễ trà là 30 phút ý nghĩa nhất đời chúng tôi. Đáng từng đồng.”",
    },
    name: "Phương & Daniel",
    detail: "Married May 2025 · Toronto",
  },
  {
    avatar: "K",
    quote: {
      en: "“The MC moved between Vietnamese and English without missing a beat — grandma understood every toast, grandpa told a joke that landed in both languages. Tears all around, the good kind.”",
      vi: "“MC chuyển giữa tiếng Việt và tiếng Anh rất khéo — bà ngoại hiểu từng lời chúc, ông kể câu đùa hai bên đều cười. Nhiều nước mắt, nước mắt vui.”",
    },
    name: "Kim & Andrew",
    detail: "Married Oct 2024 · Brampton",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="eyebrow">
                  <span className="dash" />
                  <T en="Mississauga, Ontario · Since 2018" vi="Mississauga, Ontario · Từ 2018" />
                </span>
              </div>
              <h1 className="serif">
                <T en="Your one-stop home for a" vi="Đám cưới" />{" "}
                <span className="accent">
                  <T en="traditional" vi="cổ truyền" />
                </span>{" "}
                <T en="Vietnamese" vi="Việt Nam" />{" "}
                <span className="gold">
                  <T en="wedding." vi="trọn gói." />
                </span>
              </h1>
              <p className="hero-sub">
                <T
                  en="From the áo dài fitting to the tea ceremony, the limousine to the live band — every ritual planned with care, by a Vietnamese-Canadian family who loves it."
                  vi="Từ áo dài đến lễ trà, từ limousine đến ban nhạc — mỗi nghi thức được lo trọn vẹn, bởi một gia đình Việt-Canada đầy tâm huyết."
                />
              </p>
              <div className="hero-ctas">
                <Link href="/contact" className="btn btn-primary">
                  <T en="Book a consultation" vi="Đặt buổi tư vấn" />
                  <span className="arrow">→</span>
                </Link>
                <Link href="/services" className="btn btn-ghost">
                  <T en="See all services" vi="Xem dịch vụ" />
                </Link>
              </div>
              <div className="hero-meta">
                <div className="stat">
                  <span className="num">120+</span>
                  <span className="lab">
                    <T en="Weddings honored" vi="Đám cưới đã tổ chức" />
                  </span>
                </div>
                <div className="stat">
                  <span className="num">2</span>
                  <span className="lab">
                    <T en="Languages MC'd" vi="Ngôn ngữ MC" />
                  </span>
                </div>
                <div className="stat">
                  <span className="num">4.9★</span>
                  <span className="lab">
                    <T en="Google rating" vi="Đánh giá Google" />
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-art">
              <div className="frame main">
                <Image
                  src="/images/home/hero-main.jpg"
                  alt="Bride and groom in áo dài at the tea ceremony"
                  fill
                  sizes="(max-width: 960px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="frame accent">
                <Image
                  src="/images/products/wedding-trays.jpg"
                  alt="Gold silk-covered wedding trays with double-happiness embroidery"
                  fill
                  sizes="(max-width: 960px) 50vw, 220px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="seal" aria-hidden="true">
                <span>
                  <em>Book early</em>
                  <br />
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--gold-soft)",
                    }}
                  >
                    · Save ·
                  </span>
                  <br />
                  <em>6 mo. ahead</em>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 0 }}>
        <div className="rail">
          <div className="cell">
            <span className="num">I.</span>
            <span className="name serif">Hair & Makeup</span>
            <span className="vi">Tóc & trang điểm</span>
          </div>
          <div className="cell">
            <span className="num">II.</span>
            <span className="name serif">Áo dài Rental</span>
            <span className="vi">Cho thuê áo dài</span>
          </div>
          <div className="cell">
            <span className="num">III.</span>
            <span className="name serif">Bilingual MC</span>
            <span className="vi">MC song ngữ</span>
          </div>
          <div className="cell">
            <span className="num">IV.</span>
            <span className="name serif">Photo & Video</span>
            <span className="vi">Ảnh & video cưới</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <div className="shell">
          <div className="ornament" aria-hidden="true">
            <span className="line" />
            <span className="diamond" />
            <span className="dot" />
            <span className="diamond" />
            <span className="line" />
          </div>
          <p className="pull-quote">
            <T
              en="A Vietnamese wedding is a story told in chapters —"
              vi="Đám cưới Việt là câu chuyện kể qua nhiều chương —"
            />
            <span className="red"> lễ ăn hỏi, lễ cưới.</span>
            <br />
            <T
              en="We help you tell every word of it."
              vi="Chúng tôi giúp bạn kể trọn từng lời."
            />
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg-warm)", borderBlock: "1px solid var(--line)" }}>
        <div className="shell">
          <div className="section-head row">
            <div>
              <span className="eyebrow eyebrow-gold">
                <span className="dash" />
                <T en="What we offer" vi="Dịch vụ của chúng tôi" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Every detail of the day," vi="Trọn vẹn ngày cưới," />{" "}
                <span className="italic" style={{ color: "var(--red)" }}>
                  <T en="held with care." vi="từng chi tiết." />
                </span>
              </h2>
            </div>
            <Link href="/services" className="btn btn-ghost">
              <T en="All services" vi="Tất cả dịch vụ" />
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="services-grid">
            {SERVICE_CARDS.map((s, i) => (
              <article key={i} className="svc-card">
                <div className={`img ${s.imageSrc ? "" : s.img}`}>
                  {s.imageSrc ? (
                    <Image
                      src={s.imageSrc}
                      alt={s.imageAlt?.en ?? s.imgLabel}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 360px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span>{s.imgLabel}</span>
                  )}
                </div>
                <span className="num">{s.num}</span>
                <h3 className="serif">
                  <T en={s.title.en} vi={s.title.vi} />
                </h3>
                <span className="vi">{s.vi}</span>
                <p>
                  <T en={s.body.en} vi={s.body.vi} />
                </p>
                <span className="more">
                  <T en="Learn more" vi="Xem thêm" /> →
                </span>
              </article>
            ))}
          </div>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink-muted)",
              marginTop: 32,
              maxWidth: "70ch",
            }}
          >
            *{" "}
            <T
              en="A 20% service fee applies to the total package. Book 6+ months ahead for an early-bird discount."
              vi="* Phí dịch vụ 20% áp dụng cho tổng gói. Đặt trước 6 tháng để được giảm giá."
            />
          </p>
        </div>
      </section>

      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="founder">
            <div className="founder-portrait">
              <Image
                src="/images/founder.jpg"
                alt="Juliane Cao — founder, certified Professional Makeup Artist"
                fill
                sizes="(max-width: 960px) 100vw, 480px"
                style={{ objectFit: "cover" }}
              />
              <div className="stamp">
                <span className="role">
                  <T en="Founder · Makeup Artist" vi="Người sáng lập" />
                </span>
                <div className="name">Juliane Cao</div>
              </div>
            </div>
            <div className="founder-body">
              <span className="eyebrow">
                <span className="dash" />
                <T en="A note from the founder" vi="Đôi lời từ người sáng lập" />
              </span>
              <div className="quote-mark" aria-hidden="true">&ldquo;</div>
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: "var(--ink)",
                  fontStyle: "italic",
                }}
              >
                <T
                  en="When I started doing makeup for Vietnamese brides, I noticed how few of them kept the traditional rituals — especially when their groom wasn't Vietnamese. I wanted to change that."
                  vi="Khi bắt đầu trang điểm cho cô dâu Việt, Hảo thấy rất ít đám cưới giữ được nghi lễ truyền thống — nhất là khi chú rể không phải người Việt. Hảo muốn thay đổi điều đó."
                />
              </p>
              <p>
                <T
                  en="I've been an IT professional for thirty years, and a certified makeup artist alongside it. Mississauga Wedding Solutions is what I do because I believe the next generation deserves to know — and to love — where they come from."
                  vi="Hảo đã làm về công nghệ thông tin hơn 30 năm, và song song là chuyên gia trang điểm có chứng chỉ. Mở dịch vụ này vì tin rằng thế hệ trẻ xứng đáng được biết — và yêu — gốc rễ của mình."
                />
              </p>
              <p>
                <T
                  en="We are the company where East meets West."
                  vi="Chúng tôi là nơi văn hóa Á Đông gặp gỡ phương Tây."
                />
              </p>
              <div className="sig">~ Juliane</div>
              <div style={{ marginTop: 24 }}>
                <Link href="/about" className="btn btn-ghost">
                  <T en="Read the full story" vi="Đọc đầy đủ" />
                  <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="section-head row">
            <div>
              <span className="eyebrow eyebrow-gold">
                <span className="dash" />
                <T en="From the families" vi="Lời khen từ các gia đình" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="What our couples" vi="Điều các cặp đôi" />{" "}
                <span className="italic" style={{ color: "var(--red)" }}>
                  <T en="say after." vi="nói sau ngày cưới." />
                </span>
              </h2>
            </div>
            <Link href="/reviews" className="btn btn-ghost">
              <T en="All reviews" vi="Xem tất cả" />
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="reviews-grid">
            {REVIEWS_PREVIEW.map((r, i) => (
              <article key={i} className="review">
                <span className="stars">★★★★★</span>
                <p className="body">
                  <T en={r.quote.en} vi={r.quote.vi} />
                </p>
                <div className="who">
                  <div className="avatar">
                    <em>{r.avatar}</em>
                  </div>
                  <div className="who-text">
                    <div className="n">{r.name}</div>
                    <div className="d">{r.detail}</div>
                  </div>
                </div>
              </article>
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
                <T en="Book early & save" vi="Đặt sớm & tiết kiệm" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="The best dates" vi="Những ngày đẹp nhất" />{" "}
                <span className="gold">
                  <T en="go six months out." vi="thường được đặt trước 6 tháng." />
                </span>
              </h2>
              <p>
                <T
                  en="Reach out, even if your wedding is two years away. We'll send you our planning guide and a full price list — no pressure."
                  vi="Hãy liên hệ ngay, dù đám cưới còn hai năm. Chúng tôi sẽ gửi bạn cẩm nang lập kế hoạch và bảng giá đầy đủ."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Book a consultation" vi="Đặt buổi tư vấn" />
                <span className="arrow">→</span>
              </Link>
              <a href="tel:9050000000" className="btn btn-outline">
                <T en="Call (905) 000-0000" vi="Gọi (905) 000-0000" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
