import { T } from "@/components/lang";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="shell">
        <div className="hero-eyebrow">
          <span className="eyebrow">
            <span className="dash" />
            <T en="Vietnamese ceremonies, Mississauga" vi="Đám cưới Việt, Mississauga" />
          </span>
        </div>

        <h1>
          <T
            en={
              <>
                Where <span className="accent">East</span> meets <span className="gold">West</span>,
                gracefully.
              </>
            }
            vi={
              <>
                Nơi <span className="accent">Á Đông</span> gặp gỡ <span className="gold">Phương Tây</span>,
                duyên dáng.
              </>
            }
          />
        </h1>

        <p className="hero-sub">
          <T
            en="Phase 3 placeholder — language toggle, header, and footer wired up. Real content lands in Phase 4."
            vi="Bản dùng thử Phase 3 — chuyển đổi ngôn ngữ, header và footer đã được kết nối. Nội dung thật sẽ đến trong Phase 4."
          />
        </p>
      </div>
    </section>
  );
}
