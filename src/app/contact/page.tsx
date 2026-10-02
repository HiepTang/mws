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
              en="The form below sends straight to Juliane. Expect a reply within one business day."
              vi="Mẫu này gửi trực tiếp đến Juliane. Bạn sẽ nhận được phản hồi trong vòng một ngày làm việc."
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
                  <T en="Our location" vi="Địa điểm" />
                </h3>
                <span className="vi">Tại Mississauga</span>
                <div className="lines">
                  <span>Mississauga, ON L5W 1L6</span>
                  <span>
                    <a
                      href="https://maps.google.com/?q=L5W+1L6+Mississauga+ON"
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
                    href="tel:4164344606"
                    style={{ fontFamily: "var(--serif)", fontSize: 24 }}
                  >
                    (416) 434-4606
                  </a>
                  <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    <T
                      en="Vietnamese & English spoken."
                      vi="Nói tiếng Việt & Anh."
                    />
                  </span>
                </div>
              </div>

              <div className="info-block">
                <h3 className="serif">
                  <T en="By email" vi="Qua email" />
                </h3>
                <div className="lines">
                  <a href="mailto:juliane.cao@rogers.com">
                    juliane.cao@rogers.com
                  </a>
                </div>
              </div>

              <div className="info-block">
                <h3 className="serif">
                  <T en="Business hours" vi="Giờ làm việc" />
                </h3>
                <div className="lines" style={{ fontSize: 14 }}>
                  <span>
                    <T en="By appointment" vi="Theo lịch hẹn" />
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    <T
                      en="Call or email to schedule a fitting or consultation."
                      vi="Gọi hoặc email để đặt lịch thử đồ hoặc tư vấn."
                    />
                  </span>
                </div>
              </div>

              <iframe
                className="map-frame"
                src="https://www.google.com/maps?q=L5W+1L6+Mississauga+ON&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mississauga Wedding Solutions location"
                style={{ width: "100%", height: "100%", border: 0, display: "block" }}
              />

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
                  en="Six to twelve months for full packages. We do shorter timelines, but the early-bird discount only applies for bookings made 6+ months in advance."
                  vi="Sáu đến mười hai tháng cho trọn gói. Có thể nhận lịch ngắn hơn, nhưng giảm giá đặt sớm chỉ áp dụng khi đặt trước 6 tháng trở lên."
                />
              </p>
            </div>
            <div style={{ padding: 32, borderRight: "1px solid var(--line)" }}>
              <h3 className="serif" style={{ fontSize: 20 }}>
                <T en="Do you do non-Vietnamese weddings?" vi="Có nhận đám cưới không phải Việt Nam không?" />
              </h3>
              <p style={{ fontSize: 14, marginTop: 10 }}>
                <T
                  en="While we specialize in weddings that celebrate Vietnamese traditions, many of our products and services can be adapted for any culture. Tell us what you're imagining — we'd love to help make your dream day come true."
                  vi="Chúng tôi chuyên về đám cưới theo truyền thống Việt Nam, nhưng nhiều sản phẩm và dịch vụ có thể điều chỉnh cho mọi văn hóa. Hãy kể chúng tôi nghe về ngày mơ ước của bạn — chúng tôi rất sẵn lòng giúp biến nó thành hiện thực."
                />
              </p>
            </div>
            <div style={{ padding: 32 }}>
              <h3 className="serif" style={{ fontSize: 20 }}>
                <T en="How much is the deposit?" vi="Tiền đặt cọc bao nhiêu?" />
              </h3>
              <p style={{ fontSize: 14, marginTop: 10 }}>
                <T
                  en="25% to lock the date. Fully refundable up to 90 days out, partially refundable from 90–30 days, and non-refundable less than 30 days out."
                  vi="25% để giữ ngày. Hoàn lại đầy đủ trước 90 ngày, hoàn một phần từ 90–30 ngày, và không hoàn khi còn dưới 30 ngày."
                />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
