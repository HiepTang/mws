"use client";

import { useState, useTransition } from "react";
import {
  deleteGalleryImage,
  moveGalleryImage,
  toggleGalleryImageHidden,
  updateGalleryImage,
} from "./actions";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";

export function ImageRowControls({
  id,
  caption,
  category,
  hidden,
}: {
  id: string;
  caption: string | null;
  category: string;
  hidden: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [draftCaption, setDraftCaption] = useState(caption ?? "");

  function commitCaption() {
    if (draftCaption.trim() === (caption ?? "").trim()) return;
    startTransition(() => updateGalleryImage(id, { caption: draftCaption }));
  }

  return (
    <div className="ag-controls">
      <input
        type="text"
        value={draftCaption}
        onChange={(e) => setDraftCaption(e.target.value)}
        onBlur={commitCaption}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        placeholder="Caption…"
        maxLength={200}
        disabled={pending}
        className="ag-caption-input"
      />

      <select
        value={category}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => updateGalleryImage(id, { category: e.target.value }))
        }
        className="ag-category-select"
      >
        {GALLERY_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.en}
          </option>
        ))}
      </select>

      <div className="ag-actions">
        <button
          type="button"
          className="ag-icon-btn"
          aria-label="Move up"
          disabled={pending}
          onClick={() => startTransition(() => moveGalleryImage(id, "up"))}
        >
          ↑
        </button>
        <button
          type="button"
          className="ag-icon-btn"
          aria-label="Move down"
          disabled={pending}
          onClick={() => startTransition(() => moveGalleryImage(id, "down"))}
        >
          ↓
        </button>
        <button
          type="button"
          className="ag-icon-btn"
          disabled={pending}
          onClick={() => startTransition(() => toggleGalleryImageHidden(id))}
          title={hidden ? "Unhide" : "Hide"}
        >
          {hidden ? "Show" : "Hide"}
        </button>
        <button
          type="button"
          className="ag-icon-btn ag-danger"
          disabled={pending}
          onClick={() => {
            if (!confirm("Permanently delete this photo? Cannot be undone.")) return;
            startTransition(() => deleteGalleryImage(id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
