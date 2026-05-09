import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { T } from "@/components/lang";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
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
              <T en="Contact" vi="Liên hệ" />
            </span>
          </div>
          <h1 className="serif">
            <T en="Tell us about" vi="Hãy kể chúng tôi nghe" />
            <br />
            <span className="accent">
              <T en="your wedding day." vi="về ngày cưới của bạn." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="The form below sends straight to Juliane. Expect a personal reply within one business day — usually faster."
              vi="Mẫu này gửi trực tiếp đến Juliane. Mong đợi phản hồi cá nhân trong vòng một ngày làm việc — thường nhanh hơn."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 56 }}>
        <div className="shell">
          <div className="contact-grid">
            <ContactForm />

            <aside className="info-card">
              <div className="info-block">
                <span className="eyebrow">
                  <span className="dash" />
                  <T en="Or reach us directly" vi="Hoặc liên hệ trực tiếp" />
                </span>
                <h3 className="serif" style={{ marginTop: 14 }}>
                  <T en="The studio" vi="Studio" />
                </h3>
                <span className="vi">Văn phòng tại Mississauga</span>
                <div className="lines">
                  <span>123 Cawthra Road, Suite 4</span>
                  <span>Mississauga, ON L5A 2X1</span>
                  <span>
                    <a
                      href="https://maps.google.com/?q=123+Cawthra+Road+Mississauga"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <T en="Get directions →" vi="Chỉ đường →" />
                    </a>
                  </span>
                </div>
              </div>

              <div className="info-block">
                <h3 className="serif">
                  <T en="By phone" vi="Qua điện thoại" />
                </h3>
                <div className="lines">
                  <a
                    href="tel:9050000000"
                    style={{ fontFamily: "var(--serif)", fontSize: 24 }}
                  >
                    (905) 000-0000
                  </a>
                  <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    <T
                      en="Vietnamese / English / Mandarin spoken."
                      vi="Nói tiếng Việt / Anh / Quan Thoại."
                    />
                  </span>
                </div>
              </div>

              <div className="info-block">
                <h3 className="serif">
                  <T en="By email" vi="Qua email" />
                </h3>
                <div className="lines">
                  <a href="mailto:hello@mississaugaweddsols.com">
                    hello@mississaugaweddsols.com
                  </a>
                </div>
              </div>

              <div className="info-block">
                <h3 className="serif">
                  <T en="Studio hours" vi="Giờ mở cửa studio" />
                </h3>
                <div className="lines" style={{ fontSize: 14 }}>
                  <span>
                    <strong style={{ color: "var(--ink)" }}>
                      <T en="Mon – Fri" vi="Thứ 2 – Thứ 6" />
                    </strong>{" "}
                    · 10am – 7pm
                  </span>
                  <span>
                    <strong style={{ color: "var(--ink)" }}>
                      <T en="Sat – Sun" vi="Thứ 7 – Chủ nhật" />
                    </strong>{" "}
                    ·{" "}
                    <T en="By appointment" vi="Theo lịch hẹn" />
                  </span>
                </div>
              </div>

              <div className="map-frame ph">
                <span>Mississauga studio location</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        style={{ background: "var(--bg-warm)", borderBlock: "1px solid var(--line)" }}
      >
        <div className="shell">
          <div className="section-head center">
            <span className="eyebrow eyebrow-gold">
              <span className="dash" />
              <T en="Before you write" vi="Trước khi gửi" />
            </span>
            <h2 className="serif">
              <T en="A few honest answers." vi="Vài câu trả lời thẳng thắn." />
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 0,
              border: "1px solid var(--line)",
              background: "var(--bg)",
            }}
          >
            <div style={{ padding: 32, borderRight: "1px solid var(--line)" }}>
              <h3 className="serif" style={{ fontSize: 20 }}>
                <T en="How far in advance should we book?" vi="Nên đặt trước bao lâu?" />
              </h3>
              <p style={{ fontSize: 14, marginTop: 10 }}>
                <T
                  en="Six to twelve months for full packages. We do shorter timelines, but the early-bird discount only applies past six months."
                  vi="Sáu đến mười hai tháng cho trọn gói. Có thể nhận lịch ngắn hơn, nhưng giảm giá chỉ áp dụng từ sáu tháng trở lên."
                />
              </p>
            </div>
            <div style={{ padding: 32, borderRight: "1px solid var(--line)" }}>
              <h3 className="serif" style={{ fontSize: 20 }}>
                <T en="Do you do non-Vietnamese weddings?" vi="Có nhận đám cưới không phải Việt Nam không?" />
              </h3>
              <p style={{ fontSize: 14, marginTop: 10 }}>
                <T
                  en="Many of ours have a non-Vietnamese partner — that's most of who we serve. Pure non-Vietnamese, less often, but yes."
                  vi="Nhiều cô dâu chú rể của chúng tôi có một người không phải Việt Nam — đó là phần lớn khách. Đám cưới hoàn toàn không Việt Nam, ít hơn, nhưng vẫn nhận."
                />
              </p>
            </div>
            <div style={{ padding: 32 }}>
              <h3 className="serif" style={{ fontSize: 20 }}>
                <T en="What's the deposit?" vi="Tiền đặt cọc bao nhiêu?" />
              </h3>
              <p style={{ fontSize: 14, marginTop: 10 }}>
                <T
                  en="25% to lock the date. Refundable up to 90 days out, partially refundable from 90–30, non-refundable after."
                  vi="25% để giữ ngày. Hoàn lại đầy đủ trước 90 ngày, hoàn một phần từ 90–30 ngày, không hoàn sau đó."
                />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
