import Link from "next/link";
import { T } from "@/components/lang";

const REVIEWS_PLACEHOLDER = [
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
      en: "“The MC switched between Vietnamese, English, and Mandarin without missing a beat. My grandparents cried — happy tears.”",
      vi: "“MC chuyển ngôn ngữ rất khéo. Ông bà mình đã khóc — vì hạnh phúc.”",
    },
    name: "Kim & Andrew",
    detail: "Married Oct 2024 · Brampton",
  },
];

export const metadata = {
  title: "Reviews",
};

export default function ReviewsPage() {
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
              <T en="Reviews" vi="Đánh giá" />
            </span>
          </div>
          <h1 className="serif">
            <T en="Words from" vi="Lời nhắn từ" />{" "}
            <span className="accent">
              <T en="real families." vi="các gia đình." />
            </span>
          </h1>
          <p className="subtitle">
            <T
              en="Every review here was written by a couple after their wedding day. We read every one personally."
              vi="Mỗi lời đánh giá ở đây đều được cặp đôi viết sau ngày cưới. Chúng tôi đọc từng lời một cách cá nhân."
            />
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 56 }}>
        <div className="shell">
          <div className="reviews-grid">
            {REVIEWS_PLACEHOLDER.map((r, i) => (
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
              en="* The submission form for new reviews lands in Phase 6. For now, please share your story with us by email or phone — we'll add it once the form is live."
              vi="* Mẫu gửi đánh giá mới sẽ có trong Phase 6. Tạm thời, hãy chia sẻ câu chuyện qua email hoặc điện thoại — chúng tôi sẽ đăng khi mẫu hoàn tất."
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
                <T en="Tell your story" vi="Kể câu chuyện của bạn" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="We'd love to hear from you." vi="Chúng tôi muốn lắng nghe bạn." />
              </h2>
              <p>
                <T
                  en="If we helped with your wedding, drop us a line. Two minutes of your time helps the next family find us."
                  vi="Nếu chúng tôi đã giúp ngày cưới của bạn, hãy gửi vài dòng. Hai phút của bạn giúp gia đình tiếp theo tìm thấy chúng tôi."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Send a note" vi="Gửi lời nhắn" />
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
