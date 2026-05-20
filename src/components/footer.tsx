import Image from "next/image";
import Link from "next/link";
import { T } from "./lang";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div>
          <div className="brand" style={{ marginBottom: 24 }}>
            <Image
              src="/images/footer-logo.png"
              alt="Mississauga Wedding Solutions"
              width={237}
              height={133}
              className="brand-logo footer-brand-logo"
            />
          </div>
          <p className="f-tag">
            <T
              en="Honoring the rituals of a traditional Vietnamese wedding — where East gracefully meets West."
              vi="Tổ chức đám cưới cổ truyền Việt Nam — nơi văn hóa Á Đông gặp gỡ phương Tây."
            />
          </p>
          <div className="socials">
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              IG
            </a>
            <a
              href="https://www.facebook.com/mississaugaweddsols"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              FB
            </a>
          </div>
        </div>

        <div>
          <h4>
            <T en="Explore" vi="Khám phá" />
          </h4>
          <ul>
            <li>
              <Link href="/services">
                <T en="Services" vi="Dịch vụ" />
              </Link>
            </li>
            <li>
              <Link href="/products">
                <T en="Products" vi="Sản phẩm" />
              </Link>
            </li>
            <li>
              <Link href="/gallery">
                <T en="Gallery" vi="Thư viện ảnh" />
              </Link>
            </li>
            <li>
              <Link href="/about">
                <T en="About" vi="Giới thiệu" />
              </Link>
            </li>
            <li>
              <Link href="/reviews">
                <T en="Reviews" vi="Đánh giá" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>
            <T en="Contact" vi="Liên hệ" />
          </h4>
          <ul>
            <li>Mississauga, ON</li>
            <li>(416) 434-4606</li>
            <li>juliane.cao@rogers.com</li>
            <li style={{ marginTop: 8 }}>
              <Link href="/contact" style={{ color: "var(--gold-soft)" }}>
                <T en="Book a consultation →" vi="Đặt buổi tư vấn →" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>
            <T en="Hours" vi="Giờ làm việc" />
          </h4>
          <ul>
            <li>
              <span style={{ color: "var(--cream)" }}>
                <T en="By appointment" vi="Theo lịch hẹn" />
              </span>
              <br />
              <T
                en="Call or email to schedule."
                vi="Gọi hoặc email để đặt lịch."
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="shell">
        <div className="footer-bottom">
          <span>
            © 2026 Mississauga Wedding Solutions.{" "}
            <T en="All rights reserved." vi="Bảo lưu mọi quyền." />
          </span>
          <span>
            <T
              en="Serving the Vietnamese community across the GTA."
              vi="Phục vụ cộng đồng Việt tại Greater Toronto Area."
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
