import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/lang";

type Service = {
  num: string;
  imgClass: string;
  imgLabel: string;
  imageSrc?: string;
  imageAlt?: { en: string; vi: string };
  title: { en: string; vi: string };
  vi: string;
  body: { en: string; vi: string };
  bullets: { en: string; vi: string }[];
  priceLab: { en: string; vi: string };
  price: string | { en: string; vi: string };
};

const SERVICES: Service[] = [
  {
    num: "/ 01",
    imgClass: "ph warm",
    imgLabel: "Bridal makeup studio",
    imageSrc: "/images/services/makeup.jpg",
    imageAlt: {
      en: "Juliane applying bridal makeup at her vanity",
      vi: "Juliane trang điểm cô dâu tại bàn trang điểm",
    },
    title: { en: "Hair & Makeup", vi: "Tóc & trang điểm" },
    vi: "Tóc & trang điểm",
    body: {
      en: "Founder Juliane is a certified Professional Makeup Artist with incredible attention-to-detail. We do trials so you'll know exactly how you'll look and feel.",
      vi: "Người sáng lập Juliane là chuyên gia trang điểm chuyên nghiệp, luôn chú trọng đến từng chi tiết. Chúng tôi thử trang điểm trước để bạn biết chính xác mình sẽ trông như thế nào.",
    },
    bullets: [
      { en: "Bridal trial & consultation", vi: "Thử trang điểm & tư vấn" },
      { en: "Day-of full hair & makeup", vi: "Tóc & trang điểm trọn ngày" },
      { en: "Touch-ups for ceremony & reception", vi: "Dặm phấn cho lễ và tiệc" },
      { en: "Mother-of, bridesmaids are add-ons", vi: "Trang điểm cho mẹ và phù dâu" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$350",
  },
  {
    num: "/ 02",
    imgClass: "ph",
    imgLabel: "Áo dài hangs in studio",
    imageSrc: "/images/products/groom-ao-dai.jpg",
    imageAlt: {
      en: "Groom in red áo dài and khăn đóng",
      vi: "Chú rể trong áo dài đỏ và khăn đóng",
    },
    title: { en: "Áo Dài & Tea Ceremony", vi: "Áo dài & lễ trà" },
    vi: "Áo dài & lễ trà",
    body: {
      en: "The cornerstone of a Vietnamese wedding. Áo dài rentals for both bride (gold, white or red) and groom (blue, gold or red) with khăn đóng, full tray rentals, and the ceremonial tea tray. See Products for package pricing.",
      vi: "Trái tim của đám cưới Việt. Cho thuê áo dài cho cô dâu (vàng, trắng hoặc đỏ) và chú rể (xanh, vàng, đỏ) kèm khăn đóng, mâm lễ và mâm trà trọn bộ. Xem trang Sản phẩm để biết giá gói.",
    },
    bullets: [
      { en: "Áo dài rental — bride & groom", vi: "Cho thuê áo dài — cô dâu & chú rể" },
      { en: "Tea tray & ceremonial dishes", vi: "Mâm trà & lễ vật" },
      { en: "Ritual guidance from start to finish", vi: "Hướng dẫn nghi lễ từ đầu đến cuối" },
    ],
    priceLab: { en: "Packages from", vi: "Gói từ" },
    price: "$220",
  },
  {
    num: "/ 03",
    imgClass: "ph dark",
    imgLabel: "MC at the mic",
    imageSrc: "/images/services/mc-services.jpg",
    imageAlt: {
      en: "Bilingual MC introducing the bride and groom at a reception",
      vi: "MC song ngữ giới thiệu cô dâu chú rể tại tiệc",
    },
    title: { en: "Bilingual MC", vi: "MC song ngữ" },
    vi: "MC tiếng Việt & Anh",
    body: {
      en: "A host who knows when to slow down for an elder's toast, when to translate a joke, and when to step out of the way. Vietnamese and English.",
      vi: "MC biết khi nào chậm lại cho lời chúc của người lớn, khi nào dịch câu đùa, khi nào lùi lại. Tiếng Việt và tiếng Anh.",
    },
    bullets: [
      { en: "Pre-event script & run-of-show", vi: "Kịch bản trước sự kiện" },
      { en: "Name pronunciation rehearsal — first, middle & family names", vi: "Diễn tập phát âm tên — tên, tên đệm & họ" },
      { en: "Live translation between toasts", vi: "Phiên dịch trực tiếp giữa các lời chúc" },
    ],
    priceLab: { en: "From", vi: "Từ" },
    price: "$350",
  },
  {
    num: "/ 04",
    imgClass: "ph",
    imgLabel: "Limousine arrival",
    imageSrc: "/images/services/limousine.jpg",
    imageAlt: {
      en: "White stretch limousine on a wedding day",
      vi: "Limousine kéo dài trắng trong ngày cưới",
    },
    title: { en: "Limousine & Hotel", vi: "Limousine & khách sạn" },
    vi: "Limousine & khách sạn",
    body: {
      en: "The supporting cast: a chauffeured limousine for the wedding party and hotel-block bookings for out-of-town guests.",
      vi: "Những dịch vụ hỗ trợ: limousine có tài xế cho đoàn cưới, kèm đặt phòng khách sạn cho khách phương xa.",
    },
    bullets: [
      { en: "6 or 10-passenger stretch limousine", vi: "Limousine 6 hoặc 10 chỗ" },
      { en: "Hotel room blocks for the guests", vi: "Đặt phòng khách sạn cho khách" },
    ],
    priceLab: { en: "From", vi: "" },
    price: { en: "Inquiry", vi: "Liên hệ" },
  },
  {
    num: "/ 05",
    imgClass: "ph",
    imgLabel: "Photographer at the ceremony",
    imageSrc: "/images/services/photographer.jpg",
    imageAlt: {
      en: "Photographer reviewing a wedding portrait on his camera",
      vi: "Nhiếp ảnh xem lại ảnh chân dung trên máy ảnh",
    },
    title: { en: "Photography & Videography", vi: "Nhiếp ảnh & quay phim" },
    vi: "Ảnh & video cưới",
    body: {
      en: "A photo and video team that knows when to step in and when to disappear. Every moment that matters — the áo dài fitting, the tea ceremony, the first dance — captured.",
      vi: "Đội ảnh và video biết khi nào tiến tới, khi nào lùi lại. Mỗi khoảnh khắc quan trọng — thử áo dài, lễ trà, điệu nhảy đầu tiên — đều được ghi lại.",
    },
    bullets: [
      { en: "Full-day coverage, from ceremony & reception to the morning prep and details", vi: "Quay chụp trọn ngày — từ lễ và tiệc đến buổi sáng chuẩn bị và các chi tiết" },
    ],
    priceLab: { en: "From", vi: "" },
    price: { en: "Inquiry", vi: "Liên hệ" },
  },
  {
    num: "/ 06",
    imgClass: "ph dark",
    imgLabel: "Live band setup",
    imageSrc: "/images/services/live-band.jpg",
    imageAlt: {
      en: "Drum kit and stage lighting on a small reception stage",
      vi: "Bộ trống và đèn sân khấu nhỏ tại tiệc cưới",
    },
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
    priceLab: { en: "From", vi: "" },
    price: { en: "Inquiry", vi: "Liên hệ" },
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
            <T en="Every part of the day" vi="Trọn vẹn ngày cưới" />
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
              <div className={`img-wrap ${s.imageSrc ? "" : s.imgClass}`}>
                {s.imageSrc ? (
                  <Image
                    src={s.imageSrc}
                    alt={s.imageAlt?.en ?? s.imgLabel}
                    fill
                    sizes="(max-width: 960px) 100vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span>{s.imgLabel}</span>
                )}
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
                {typeof s.price === "string" ? (
                  s.price
                ) : (
                  <T en={s.price.en} vi={s.price.vi} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
