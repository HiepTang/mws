import Link from "next/link";
import { T } from "@/components/lang";

const SERVICE_CARDS = [
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
    num: "02 / Ceremony",
    title: { en: "Tea Ceremony Setup", vi: "Lễ trà" },
    vi: "Mâm trà & lễ vật",
    body: {
      en: "Tray rentals, the groom's áo dài and khăn đóng (blue, gold, or red), the wine tray — and styling support so the bride's own áo dài and groom's look come together on the day.",
      vi: "Cho thuê mâm trà, áo dài & khăn đóng cho chú rể (xanh, vàng, đỏ), mâm rượu — và tư vấn phối đồ để áo dài cô dâu và áo dài chú rể hài hòa trong ngày cưới.",
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
    title: { en: "Limousine & Transport", vi: "Limousine" },
    vi: "Xe đưa đón",
    body: {
      en: "Door-to-door transport for the wedding party, plus shuttle for out-of-town family if needed.",
      vi: "Xe đưa đón đoàn nhà trai, nhà gái và họ hàng phương xa.",
    },
  },
  {
    img: "ph",
    imgLabel: "Reception flowers",
    num: "05 / Atmosphere",
    title: { en: "Flowers & Decor", vi: "Hoa & trang trí" },
    vi: "Hoa & trang trí tiệc",
    body: {
      en: "Centerpieces, arch, twinkling lights and the small altar pieces that make a hall feel like home.",
      vi: "Hoa bàn, cổng cưới, đèn lung linh và bàn thờ gia tiên ấm cúng.",
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
                  <span className="num">3</span>
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
              <div className="frame main ph warm">
                <span>Bride & groom in áo dài / tea ceremony portrait</span>
              </div>
              <div className="frame accent ph">
                <span>Tea tray detail</span>
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
            <span className="name serif">Flowers & Decor</span>
            <span className="vi">Hoa & trang trí</span>
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
                <div className={`img ${s.img}`}>
                  <span>{s.imgLabel}</span>
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

      <section>
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">
              <span className="dash" />
              <T en="The journey" vi="Hành trình" />
            </span>
            <h2 className="serif" style={{ maxWidth: "18ch" }}>
              <T en="From first call to" vi="Từ buổi gặp đầu tiên đến" />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="last toast." vi="ly rượu cuối cùng." />
              </span>
            </h2>
          </div>
          <ol
            style={{
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              borderTop: "1px solid var(--line)",
            }}
          >
            {[
              {
                num: "i",
                title: { en: "Tea & talk", vi: "Trò chuyện" },
                body: {
                  en: "A 60-min consultation at our studio. We map the rituals you want to keep.",
                  vi: "Buổi tư vấn 60 phút tại studio. Chúng tôi cùng bàn về những nghi thức bạn muốn giữ.",
                },
              },
              {
                num: "ii",
                title: { en: "The plan", vi: "Lập kế hoạch" },
                body: {
                  en: "A timeline, vendor list, and a transparent quote — no surprises.",
                  vi: "Thời gian biểu, danh sách nhà cung cấp, báo giá rõ ràng — không bất ngờ.",
                },
              },
              {
                num: "iii",
                title: { en: "Rehearsal", vi: "Buổi diễn tập" },
                body: {
                  en: "Two weeks out: walkthrough with both families so the day feels familiar.",
                  vi: "Hai tuần trước: tập dượt cùng hai gia đình để ngày cưới quen thuộc.",
                },
              },
              {
                num: "iv",
                title: { en: "The day", vi: "Ngày cưới" },
                body: {
                  en: "We're there from sunrise hair to the last photo, holding every cue.",
                  vi: "Chúng tôi có mặt từ buổi sáng làm tóc đến tấm ảnh cuối ngày.",
                },
              },
            ].map((step, i, arr) => (
              <li
                key={step.num}
                style={{
                  padding: i === 0 ? "32px 24px 32px 0" : i === arr.length - 1 ? "32px 0 32px 24px" : "32px 24px",
                  borderRight: i < arr.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 56,
                    fontStyle: "italic",
                    color: "var(--gold)",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <h3 className="serif" style={{ marginTop: 16, fontSize: 22 }}>
                  <T en={step.title.en} vi={step.title.vi} />
                </h3>
                <p style={{ fontSize: 14, marginTop: 8 }}>
                  <T en={step.body.en} vi={step.body.vi} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="founder">
            <div className="founder-portrait ph warm">
              <span>Juliane Cao, founder portrait</span>
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
