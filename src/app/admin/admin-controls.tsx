"use client";

import { useTransition } from "react";
import {
  approveReview,
  markContactArchived,
  markContactReplied,
  rejectReview,
  reopenContact,
  setGalleryFlag,
  setReviewGalleryCategory,
} from "./actions";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";

// ─── Reviews ──────────────────────────────────────────────────────────

export function ReviewControls({
  id,
  status,
  consentGallery,
  galleryCategory,
  hasImage,
  consentShare,
}: {
  id: string;
  status: string;
  consentGallery: boolean;
  galleryCategory: string;
  hasImage: boolean;
  consentShare: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const showGalleryControls = hasImage && status === "approved" && consentShare;

  return (
    <div className="ac-row">
      {status !== "approved" && (
        <button
          type="button"
          className="btn btn-primary ac-btn-sm"
          disabled={pending}
          onClick={() => startTransition(() => approveReview(id))}
        >
          {pending ? "…" : "Approve"}
        </button>
      )}
      {status !== "rejected" && (
        <button
          type="button"
          className="btn btn-ghost ac-btn-sm"
          disabled={pending}
          onClick={() => {
            if (!confirm("Reject this review? It will be hidden from the public site.")) return;
            startTransition(() => rejectReview(id));
          }}
        >
          Reject
        </button>
      )}
      {showGalleryControls && (
        <>
          <label className="ac-toggle">
            <input
              type="checkbox"
              checked={consentGallery}
              disabled={pending}
              onChange={(e) =>
                startTransition(() => setGalleryFlag(id, e.target.checked))
              }
            />
            <span>Show in gallery</span>
          </label>
          <select
            value={galleryCategory}
            disabled={pending || !consentGallery}
            onChange={(e) =>
              startTransition(() => setReviewGalleryCategory(id, e.target.value))
            }
            className="ag-category-select"
            style={{ width: "auto", minWidth: 140 }}
            aria-label="Gallery category"
            title={consentGallery ? "Gallery category" : "Toggle 'Show in gallery' first"}
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.en}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────

export function ContactControls({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="ac-row">
      {status === "new" && (
        <>
          <button
            type="button"
            className="btn btn-primary ac-btn-sm"
            disabled={pending}
            onClick={() => startTransition(() => markContactReplied(id))}
          >
            {pending ? "…" : "Mark replied"}
          </button>
          <button
            type="button"
            className="btn btn-ghost ac-btn-sm"
            disabled={pending}
            onClick={() => {
              if (!confirm("Archive this submission? It can be reopened later.")) return;
              startTransition(() => markContactArchived(id));
            }}
          >
            Archive
          </button>
        </>
      )}
      {status !== "new" && (
        <button
          type="button"
          className="btn btn-ghost ac-btn-sm"
          disabled={pending}
          onClick={() => startTransition(() => reopenContact(id))}
        >
          {pending ? "…" : "Reopen"}
        </button>
      )}
    </div>
  );
}
