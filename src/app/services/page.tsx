import Link from "next/link";
import { T } from "@/components/lang";

type Service = {
  num: string;
  imgClass: string;
  imgLabel: string;
  title: { en: string; vi: string };
  vi: string;
  body: { en: string; vi: string };
  bullets: { en: string; vi: string }[];
  priceLab: { en: string; vi: string };
  price: string;
};

const SERVICES: Service[] = [
  {
    num: "/ 01",
    imgClass: "ph warm",
    imgLabel: "Bridal makeup studio",
    title: { en: "Hair & Makeup", vi: "Tóc & trang điểm" },
    vi: "Tóc & trang điểm",
    body: {
      en: "Founder Juliane is a certified Professional Makeup Artist with thirty years of attention-to-detail. We do trials in our studio, so you'll know exactly how you'll look — and feel.",
      vi: "Người sáng lập Juliane là chuyên gia trang điểm chuyên nghiệp với 30 năm chú trọng đến từng chi tiết. Chúng tôi thử trang điểm tại studio để bạn biết chính xác mình sẽ trông như thế nào.",
    },
    bullets: [
      { en: "Bridal trial & consultation", vi: "Thử trang điểm & tư vấn" },
      { en: "Day-of full hair & makeup", vi: "Tóc & trang điểm trọn ngày" },
      { en: "Touch-ups for ceremony & reception", vi: "Dặm phấn cho lễ và tiệc" },
      { en: "Mother-of, bridesmaid add-ons", vi: "Trang điểm cho mẹ và phù dâu" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$650",
  },
  {
    num: "/ 02",
    imgClass: "ph",
    imgLabel: "Áo dài hangs in studio",
    title: { en: "Áo dài & Tea Ceremony", vi: "Áo dài & lễ trà" },
    vi: "Áo dài chú rể & lễ trà",
    body: {
      en: "The cornerstone of a Vietnamese wedding. Áo dài rentals for both bride (gold, or white & red) and groom (blue, gold, or red) with khăn đóng, full tray rentals, and the ceremonial wine tray.",
      vi: "Trái tim của đám cưới Việt. Cho thuê áo dài cho cô dâu (vàng, hoặc trắng & đỏ) và chú rể (xanh, vàng, đỏ) kèm khăn đóng, mâm lễ và mâm rượu trọn bộ.",
    },
    bullets: [
      { en: "Áo dài rental — bride & groom", vi: "Cho thuê áo dài — cô dâu & chú rể" },
      { en: "6, 9, or 11-tray procession", vi: "Mâm 6, 9, hoặc 11" },
      { en: "Wine tray & ceremonial dishes", vi: "Mâm rượu & lễ vật" },
      { en: "Ritual guidance from start to finish", vi: "Hướng dẫn nghi lễ từ đầu đến cuối" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$1,200",
  },
  {
    num: "/ 03",
    imgClass: "ph dark",
    imgLabel: "MC at the mic",
    title: { en: "Bilingual MC", vi: "MC song ngữ" },
    vi: "MC tiếng Việt & Anh",
    body: {
      en: "A host who knows when to slow down for an elder's toast, when to translate a joke, and when to step out of the way. Vietnamese and English.",
      vi: "MC biết khi nào chậm lại cho lời chúc của người lớn, khi nào dịch câu đùa, khi nào lùi lại. Tiếng Việt và tiếng Anh.",
    },
    bullets: [
      { en: "Pre-event script & run-of-show", vi: "Kịch bản trước sự kiện" },
      { en: "Family name pronunciation rehearsal", vi: "Diễn tập phát âm tên gia đình" },
      { en: "Live translation between toasts", vi: "Phiên dịch trực tiếp giữa các lời chúc" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$800",
  },
  {
    num: "/ 04",
    imgClass: "ph dark",
    imgLabel: "Live band setup",
    title: { en: "Live Band, DJ, Lights & Sound", vi: "Ban nhạc, DJ, ánh sáng & âm thanh" },
    vi: "Ban nhạc, DJ, ánh sáng",
    body: {
      en: "A four-piece Vietnamese wedding band, an open-format DJ, or both. Plus the rig: line array, monitors, wireless mics, twinkly café lights.",
      vi: "Ban nhạc cưới Việt 4 thành viên, DJ open-format, hoặc cả hai. Kèm thiết bị: loa, mic không dây, đèn lung linh.",
    },
    bullets: [
      { en: "Vietnamese ballad set or modern bilingual mix", vi: "Nhạc Việt trữ tình hoặc nhạc song ngữ hiện đại" },
      { en: "Full PA, monitors, wireless mics", vi: "Loa đài, mic không dây đầy đủ" },
      { en: "Café-light installation", vi: "Lắp đặt đèn cà phê" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$2,400",
  },
  {
    num: "/ 05",
    imgClass: "ph",
    imgLabel: "Limousine arrival",
    title: { en: "Limousine, Photo & Hotel", vi: "Limousine, ảnh cưới & khách sạn" },
    vi: "Limousine, chụp ảnh, khách sạn",
    body: {
      en: "The supporting cast: a chauffeured limousine for the wedding party, a photo and video team that knows when to step in, and hotel-block bookings for out-of-town guests.",
      vi: "Những dịch vụ hỗ trợ: limousine có tài xế cho đoàn cưới, đội chụp ảnh & quay phim biết khi nào tiến tới, kèm đặt phòng khách sạn cho khách phương xa.",
    },
    bullets: [
      { en: "6 or 10-passenger stretch limousine", vi: "Limousine 6 hoặc 10 chỗ" },
      { en: "Photographer + videographer team", vi: "Đội ngũ chụp ảnh & quay phim" },
      { en: "Hotel room blocks for the families", vi: "Đặt phòng khách sạn cho gia đình" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$1,500",
  },
];

type Package = {
  tag: { en: string; vi: string };
  title: { en: string; vi: string };
  price: string;
  bullets: { en: string; vi: string }[];
  cta: { en: string; vi: string };
  featured?: boolean;
};

const PACKAGES: Package[] = [
  {
    tag: { en: "Intimate", vi: "Ấm cúng" },
    title: { en: "The Tea Ceremony", vi: "Lễ trà" },
    price: "$3,400",
    bullets: [
      { en: "Bride hair & makeup (with trial)", vi: "Tóc & trang điểm cô dâu" },
      { en: "Áo dài rental — bride & groom", vi: "Cho thuê áo dài — cô dâu & chú rể" },
      { en: "6-tray procession + wine tray", vi: "Mâm 6 + mâm rượu" },
      { en: "Bilingual MC, 3 hours", vi: "MC song ngữ, 3 tiếng" },
    ],
    cta: { en: "Inquire", vi: "Liên hệ" },
  },
  {
    tag: { en: "Most chosen", vi: "Phổ biến nhất" },
    title: { en: "The Full Day", vi: "Trọn ngày" },
    price: "$8,900",
    bullets: [
      { en: "Everything in The Tea Ceremony", vi: "Bao gồm toàn bộ Lễ Trà" },
      { en: "Live band, 3 hours", vi: "Ban nhạc 3 tiếng" },
      { en: "6-passenger limousine", vi: "Limousine 6 chỗ" },
      { en: "Photo + video team", vi: "Đội chụp ảnh & quay phim" },
      { en: "Bilingual MC, full event", vi: "MC song ngữ, trọn sự kiện" },
    ],
    cta: { en: "Inquire", vi: "Liên hệ" },
    featured: true,
  },
  {
    tag: { en: "Concierge", vi: "Trọn gói" },
    title: { en: "The Heritage", vi: "Trọn vẹn truyền thống" },
    price: "$14,500",
    bullets: [
      { en: "Everything in The Full Day", vi: "Bao gồm gói Trọn ngày" },
      { en: "11-tray procession + extras", vi: "Mâm 11 + đầy đủ lễ vật" },
      { en: "Bridal party hair & makeup (6)", vi: "Tóc & trang điểm cho 6 phù dâu" },
      { en: "10-passenger limousine", vi: "Limousine 10 chỗ" },
      { en: "Hotel-block management", vi: "Đặt khối phòng khách sạn" },
      { en: "Day-of coordinator (10hrs)", vi: "Điều phối ngày cưới (10 tiếng)" },
    ],
    cta: { en: "Inquire", vi: "Liên hệ" },
  },
];

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
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
              <T en="Services" vi="Dịch vụ" />
            </span>
          </div>
          <h1 className="serif">
            <T en="Every part of the day," vi="Trọn vẹn ngày cưới," />
            <br />
            <span className="accent">
              <T en="taken care of." vi="từng chi tiết một." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="A traditional Vietnamese wedding has many moving parts. Pick à la carte, or let us handle the whole day end-to-end."
              vi="Đám cưới Việt cổ truyền có nhiều phần. Chọn từng dịch vụ, hoặc để chúng tôi lo trọn gói."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 40 }}>
        <div className="shell">
          {SERVICES.map((s, i) => (
            <div key={i} className="svc-row">
              <span className="num">{s.num}</span>
              <div className={`img-wrap ${s.imgClass}`}>
                <span>{s.imgLabel}</span>
              </div>
              <div>
                <div className="title-block">
                  <h3 className="serif">
                    <T en={s.title.en} vi={s.title.vi} />
                  </h3>
                  <div className="vi">{s.vi}</div>
                </div>
                <div className="body">
                  <p style={{ marginTop: 16 }}>
                    <T en={s.body.en} vi={s.body.vi} />
                  </p>
                  <ul>
                    {s.bullets.map((b, j) => (
                      <li key={j}>
                        <T en={b.en} vi={b.vi} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="price">
                <span className="lab">
                  <T en={s.priceLab.en} vi={s.priceLab.vi} />
                </span>
                {s.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--bg-warm)" }}>
        <div className="shell">
          <div className="section-head center">
            <span className="eyebrow eyebrow-gold">
              <span className="dash" />
              <T en="Or take it all in one" vi="Hoặc trọn gói" />
            </span>
            <h2 className="serif">
              <T en="Three packages." vi="Ba gói." />{" "}
              <span className="italic" style={{ color: "var(--red)" }}>
                <T en="One simple price." vi="Một giá đơn giản." />
              </span>
            </h2>
            <p style={{ textAlign: "center", marginTop: 12 }}>
              <T
                en="A 20% service fee is included. Six-month early-bird discount available."
                vi="Đã bao gồm phí dịch vụ 20%. Giảm giá khi đặt trước 6 tháng."
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
                    <T en="Starting" vi="Từ" />
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
                <Link
                  href="/contact"
                  className={`btn ${p.featured ? "btn-gold" : "btn-ghost"}`}
                >
                  <T en={p.cta.en} vi={p.cta.vi} />
                  <span className="arrow">→</span>
                </Link>
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
                <T en="Not sure what fits?" vi="Chưa biết chọn gì?" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Tell us about your day." vi="Hãy kể chúng tôi về ngày của bạn." />
              </h2>
              <p>
                <T
                  en="A 30-minute call. No pressure. We'll give you an honest sense of cost, dates, and what's possible."
                  vi="Một cuộc gọi 30 phút. Không áp lực. Chúng tôi sẽ tư vấn thật lòng về chi phí, ngày và khả năng."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Get a quote" vi="Nhận báo giá" />
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
