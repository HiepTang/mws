"use client";

import { useState } from "react";
import { T } from "./lang";

type Filter = { en: string; vi: string };

export function ProductFilters({ filters }: { filters: Filter[] }) {
  // Phase 4: visual-only chips. Phase 6+ can wire actual filtering once
  // products move to a real data source.
  const [active, setActive] = useState(0);

  return (
    <div className="filters">
      {filters.map((f, i) => (
        <button
          key={i}
          type="button"
          className={`chip ${active === i ? "on" : ""}`}
          onClick={() => setActive(i)}
        >
          <T en={f.en} vi={f.vi} />
        </button>
      ))}
    </div>
  );
}
