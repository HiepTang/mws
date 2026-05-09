"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang, T } from "./lang";

type NavItem = {
  href: string;
  en: string;
  vi: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function HeaderClient({ items }: { items: NavItem[] }) {
  const { lang, setLang } = useLang();
  const pathname = usePathname() ?? "/";
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav className={`nav ${navOpen ? "open" : ""}`} aria-label="Primary">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(pathname, item.href) ? "active" : undefined}
            onClick={() => setNavOpen(false)}
          >
            <T en={item.en} vi={item.vi} />
          </Link>
        ))}
      </nav>

      <div className="header-right">
        <div className="lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            data-lang="en"
            className={lang === "en" ? "on" : undefined}
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <button
            type="button"
            data-lang="vi"
            className={lang === "vi" ? "on" : undefined}
            onClick={() => setLang("vi")}
            aria-pressed={lang === "vi"}
          >
            VI
          </button>
        </div>

        <Link href="/contact" className="btn btn-primary">
          <T en="Book Now" vi="Đặt ngay" />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {navOpen ? (
              <path d="M6 6 18 18 M18 6 6 18" />
            ) : (
              <path d="M4 7h16 M4 12h16 M4 17h16" />
            )}
          </svg>
        </button>
      </div>
    </>
  );
}
