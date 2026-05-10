import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db, schema } from "@/db";
import { T } from "@/components/lang";
import { ReviewForm } from "@/components/review-form";

export const metadata = {
  title: "Reviews",
};

// Re-fetch on each request — approved reviews flip "live" the moment Juliane
// approves them in /admin. This page is small and the query cheap.
export const dynamic = "force-dynamic";

function initial(name: string): string {
  const first = name.trim().charAt(0).toUpperCase();
  return first || "★";
}

function relativeWedding(weddingDate: string | null, city: string | null): string {
  const parts: string[] = [];
  if (weddingDate) parts.push(`Married ${weddingDate}`);
  if (city) parts.push(city);
  return parts.join(" · ");
}

export default async function ReviewsPage() {
  // Pull published reviews. Anything pending or rejected is hidden from
  // public view by definition.
  let approved: Awaited<ReturnType<typeof fetchApproved>> = [];
  try {
    approved = await fetchApproved();
  } catch (err) {
    console.error("[reviews page] DB read failed:", err);
    // Render the page anyway with an empty list — better than 500 if the
    // DB is briefly unreachable.
  }

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
          {approved.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 22,
                color: "var(--ink-muted)",
                textAlign: "center",
                maxWidth: "40ch",
                margin: "0 auto",
              }}
            >
              <T
                en="The first published reviews will appear here once couples share — and Juliane reads — their stories. Yours could be the first."
                vi="Những đánh giá đầu tiên sẽ xuất hiện ở đây khi các cặp đôi gửi lời và được Juliane duyệt. Câu chuyện của bạn có thể là người đầu tiên."
              />
            </p>
          ) : (
            <div className="reviews-grid">
              {approved.map((r) => (
                <article key={r.id} className="review">
                  <span className="stars" aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                    <span style={{ color: "var(--line)" }}>
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </span>
                  <p className="body">{r.body}</p>
                  <div className="who">
                    <div className="avatar">
                      <em>{initial(r.coupleNames)}</em>
                    </div>
                    <div className="who-text">
                      <div className="n">{r.coupleNames}</div>
                      <div className="d">{relativeWedding(r.weddingDate, r.city) || " "}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="share-your-story"
        style={{ background: "var(--bg-warm)", borderBlock: "1px solid var(--line)" }}
      >
        <div className="shell">
          <div className="review-form-grid">
            <aside className="rf-aside">
              <span className="eyebrow eyebrow-gold">
                <span className="dash" />
                <T en="Share your story" vi="Chia sẻ câu chuyện" />
              </span>
              <h2
                className="serif"
                style={{ marginTop: 14, fontSize: "clamp(36px, 4vw, 56px)" }}
              >
                <T en="Tell us about" vi="Hãy kể về" />
                <br />
                <span className="italic" style={{ color: "var(--red)" }}>
                  <T en="your day with us." vi="ngày của bạn cùng chúng tôi." />
                </span>
              </h2>
              <p style={{ marginTop: 18 }}>
                <T
                  en="If we held a piece of your wedding — the áo dài, the trays, the MC's voice — we'd be honored to hear how it landed. Future couples read every word."
                  vi="Nếu chúng tôi đã góp một phần vào ngày cưới của bạn — áo dài, mâm lễ, lời MC — chúng tôi sẽ rất vinh dự được nghe cảm nhận. Các cặp đôi tương lai sẽ đọc từng lời."
                />
              </p>
              <div className="rf-bullets">
                <div className="rf-bullet">
                  <span className="rf-num">i</span>
                  <div>
                    <h4>
                      <T en="It takes 2 minutes" vi="Chỉ mất 2 phút" />
                    </h4>
                    <p>
                      <T
                        en="A few fields, your rating, and the parts that mattered most."
                        vi="Vài ô, đánh giá của bạn, và những phần quan trọng nhất."
                      />
                    </p>
                  </div>
                </div>
                <div className="rf-bullet">
                  <span className="rf-num">ii</span>
                  <div>
                    <h4>
                      <T en="Photos welcome" vi="Hoan nghênh ảnh" />
                    </h4>
                    <p>
                      <T
                        en="Add a wedding photo and we'll feature it in the gallery (with credit)."
                        vi="Thêm ảnh cưới và chúng tôi sẽ đăng trong thư viện (kèm tên)."
                      />
                    </p>
                  </div>
                </div>
                <div className="rf-bullet">
                  <span className="rf-num">iii</span>
                  <div>
                    <h4>
                      <T en="Reviewed before publish" vi="Duyệt trước khi đăng" />
                    </h4>
                    <p>
                      <T
                        en="Juliane reads each one personally before it goes live."
                        vi="Juliane đọc từng đánh giá trước khi đăng."
                      />
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <ReviewForm />
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="cta-banner">
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>
                <span className="dash" />
                <T en="Your day, next" vi="Ngày của bạn, kế tiếp" />
              </span>
              <h2 className="serif" style={{ marginTop: 14 }}>
                <T en="Be" vi="Hãy là" />{" "}
                <span className="gold">
                  <T en="our next story." vi="câu chuyện kế tiếp." />
                </span>
              </h2>
              <p>
                <T
                  en="If we haven't met yet, we'd love to. Reach out for a 30-minute consultation — no pressure, just a conversation about your day."
                  vi="Nếu chúng ta chưa gặp, chúng tôi rất mong được gặp. Đặt buổi tư vấn 30 phút — không áp lực, chỉ trò chuyện về ngày của bạn."
                />
              </p>
            </div>
            <div className="actions">
              <Link href="/contact" className="btn btn-gold">
                <T en="Book a consultation" vi="Đặt buổi tư vấn" />
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function fetchApproved() {
  return db
    .select({
      id: schema.reviews.id,
      coupleNames: schema.reviews.coupleNames,
      weddingDate: schema.reviews.weddingDate,
      city: schema.reviews.city,
      rating: schema.reviews.rating,
      body: schema.reviews.body,
      imageKey: schema.reviews.imageKey,
      consentGallery: schema.reviews.consentGallery,
    })
    .from(schema.reviews)
    .where(
      and(
        eq(schema.reviews.status, "approved"),
        eq(schema.reviews.consentShare, true),
      ),
    )
    .orderBy(desc(schema.reviews.createdAt))
    .limit(48);
}
