"use client";

import { useActionState, useRef } from "react";
import { createGalleryImage, type GalleryActionResult } from "./actions";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";

const initial: GalleryActionResult = { ok: true };

export function GalleryUploadForm() {
  const [state, action, pending] = useActionState(createGalleryImage, initial);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Reset the form on success so admin can upload another without re-fill.
  if (state.ok && state !== initial) {
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="form-card"
      style={{ marginBottom: 32 }}
    >
      <h3 className="serif" style={{ fontSize: 20, marginBottom: 14 }}>
        Upload a photo
      </h3>

      {!state.ok && state.message && (
        <div
          role="alert"
          style={{
            background: "#fbecec",
            border: "1px solid #e0b4b4",
            color: "#7a2828",
            padding: "10px 14px",
            borderRadius: 6,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          {state.message}
        </div>
      )}

      <div className="form-row">
        <div className="field">
          <label htmlFor="ag-image">Image</label>
          <input
            id="ag-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            required
            style={{ paddingTop: 14 }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="ag-category">Category</label>
          <select id="ag-category" name="category" required defaultValue="">
            <option value="" disabled>
              Pick a category
            </option>
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ag-caption">Caption (optional)</label>
          <input
            id="ag-caption"
            name="caption"
            type="text"
            placeholder='e.g. "Linh & Thomas, August 2025"'
            maxLength={200}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary ac-btn-sm"
        disabled={pending}
        style={{ marginTop: 12 }}
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
