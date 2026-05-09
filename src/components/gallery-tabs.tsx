"use client";

import { useState } from "react";
import { T } from "./lang";

type Tab = { en: string; vi: string };

export function GalleryTabs({ tabs }: { tabs: Tab[] }) {
  // Phase 4: visual-only category tabs. Phase 8 will wire actual filtering
  // when approved review images merge in.
  const [active, setActive] = useState(0);
  return (
    <div className="gal-tabs">
      {tabs.map((t, i) => (
        <button
          key={i}
          type="button"
          className={`gal-tab ${active === i ? "on" : ""}`}
          onClick={() => setActive(i)}
        >
          <T en={t.en} vi={t.vi} />
        </button>
      ))}
    </div>
  );
}
