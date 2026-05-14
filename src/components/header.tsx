import Image from "next/image";
import Link from "next/link";
import { HeaderClient } from "./header-client";

export const NAV = [
  { href: "/", en: "Home", vi: "Trang chủ" },
  { href: "/services", en: "Services", vi: "Dịch vụ" },
  { href: "/products", en: "Products", vi: "Sản phẩm" },
  { href: "/gallery", en: "Gallery", vi: "Thư viện ảnh" },
  { href: "/about", en: "About", vi: "Giới thiệu" },
  { href: "/reviews", en: "Reviews", vi: "Đánh giá" },
  { href: "/contact", en: "Contact", vi: "Liên hệ" },
] as const;

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Mississauga Wedding Solutions">
          <Image
            src="/images/logo.png"
            alt="Mississauga Wedding Solutions"
            width={301}
            height={165}
            priority
            className="brand-logo"
          />
        </Link>

        <HeaderClient items={NAV.map((item) => ({ ...item }))} />
      </div>
    </header>
  );
}
