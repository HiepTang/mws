"use client";

import { useTransition } from "react";
import {
  approveReview,
  markContactArchived,
  markContactReplied,
  rejectReview,
  reopenContact,
  setGalleryFlag,
} from "./actions";

// ─── Reviews ──────────────────────────────────────────────────────────

export function ReviewControls({
  id,
  status,
  consentGallery,
  hasImage,
  consentShare,
}: {
  id: string;
  status: string;
  consentGallery: boolean;
  hasImage: boolean;
  consentShare: boolean;
}) {
  const [pending, startTransition] = useTransition();

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
      {hasImage && status === "approved" && consentShare && (
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
