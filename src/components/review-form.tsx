"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitReview, type ReviewState } from "@/app/reviews/actions";
import { useLang, T } from "./lang";
import { Turnstile } from "./turnstile";

const SERVICE_TAGS = [
  { value: "Tea Ceremony", en: "Tea Ceremony", vi: "Lễ trà" },
  { value: "Áo Dài", en: "Áo Dài", vi: "Áo dài" },
  { value: "Hair & Makeup", en: "Hair & Makeup", vi: "Tóc & trang điểm" },
  { value: "MC", en: "Trilingual MC", vi: "MC ba ngôn ngữ" },
  { value: "Catering & Cake", en: "Catering & Cake", vi: "Tiệc & bánh" },
  { value: "Flowers & Decor", en: "Flowers & Decor", vi: "Hoa & trang trí" },
  { value: "Live Band / DJ", en: "Live Band / DJ", vi: "Ban nhạc / DJ" },
  { value: "Photography", en: "Photography", vi: "Nhiếp ảnh" },
  { value: "Limousine", en: "Limousine", vi: "Limousine" },
  { value: "Full Package", en: "Full Heritage Package", vi: "Gói trọn vẹn" },
];

const RATING_LABELS: Record<number, { en: string; vi: string }> = {
  1: { en: "Disappointed", vi: "Thất vọng" },
  2: { en: "Mixed", vi: "Tạm" },
  3: { en: "Good", vi: "Tốt" },
  4: { en: "Great", vi: "Rất tốt" },
  5: { en: "Loved it", vi: "Tuyệt vời" },
};

const initialState: ReviewState = { status: "idle" };

const MAX_BODY_CHARS = 5000;

export function ReviewForm() {
  const { lang } = useLang();
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const v = state.values;
  const k = state.attempt ?? 0;

  const [rating, setRating] = useState<number>(v?.rating ?? 0);
  const [hover, setHover] = useState<number>(0);
  const [tags, setTags] = useState<Set<string>>(new Set(v?.serviceTags ?? []));
  const [bodyLen, setBodyLen] = useState<number>((v?.body ?? "").length);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Resync from server-action reply (validation failure preserves values).
  useEffect(() => {
    if (!v) return;
    setRating(v.rating ?? 0);
    setTags(new Set(v.serviceTags ?? []));
    setBodyLen((v.body ?? "").length);
  }, [v, k]);

  if (state.status === "success") {
    return (
      <div className="rf-card rf-success" role="status" aria-live="polite">
        <div className="rf-success-mark" aria-hidden="true">
          ✓
        </div>
        <h3 className="serif">
          <T en="Thank you." vi="Cảm ơn bạn." />
        </h3>
        <p>
          <T
            en="Juliane will read your words personally. You'll see your review go live within a couple of days."
            vi="Juliane sẽ đọc đánh giá của bạn. Bạn sẽ thấy nó được đăng trong vài ngày tới."
          />
        </p>
        {state.message && (
          <p style={{ fontSize: 13, color: "var(--ink-muted)", maxWidth: "40ch" }}>
            {state.message}
          </p>
        )}
      </div>
    );
  }

  const fieldError = (key: string) => state.errors?.[key as keyof typeof state.errors];
  const ratingShown = hover || rating;
  const ratingLabel = ratingShown
    ? RATING_LABELS[ratingShown]
    : { en: "Tap to rate", vi: "Chạm để đánh giá" };

  function toggleTag(value: string) {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <form className="rf-card" action={formAction} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <input type="hidden" name="language" value={lang} />
      <input type="hidden" name="rating" value={rating} />
      {[...tags].map((t) => (
        <input key={t} type="hidden" name="serviceTags" value={t} />
      ))}

      {state.status === "error" && state.message && (
        <div
          role="alert"
          style={{
            background: "#fbecec",
            border: "1px solid #e0b4b4",
            color: "#7a2828",
            padding: "12px 16px",
            borderRadius: 6,
            marginBottom: 16,
            lineHeight: 1.5,
            fontSize: 14,
          }}
        >
          {state.message}
        </div>
      )}

      {/* 01 — rating */}
      <div className="rf-step">
        <span className="rf-step-num">01</span>
        <span className="rf-step-label">
          <T en="Your rating" vi="Đánh giá của bạn" />
        </span>
      </div>
      <div className={`rf-stars ${rating ? "has-rating" : ""}`} role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`rf-star ${n <= ratingShown ? "on" : ""}`}
            data-value={n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            aria-pressed={rating === n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            ★
          </button>
        ))}
        <span className="rf-stars-label">
          <T en={ratingLabel.en} vi={ratingLabel.vi} />
        </span>
      </div>
      {fieldError("rating") && <FieldError text={fieldError("rating")!} />}

      {/* 02 — service tags */}
      <div className="rf-step" style={{ marginTop: 32 }}>
        <span className="rf-step-num">02</span>
        <span className="rf-step-label">
          <T en="Which services did we help with?" vi="Chúng tôi đã giúp với dịch vụ nào?" />
        </span>
      </div>
      <div className="rf-tags">
        {SERVICE_TAGS.map((t) => (
          <label key={t.value} className="rf-tag">
            <input
              type="checkbox"
              checked={tags.has(t.value)}
              onChange={() => toggleTag(t.value)}
            />
            <span>
              <T en={t.en} vi={t.vi} />
            </span>
          </label>
        ))}
      </div>

      {/* 03 — body */}
      <div className="rf-step" style={{ marginTop: 32 }}>
        <span className="rf-step-num">03</span>
        <span className="rf-step-label">
          <T en="Your review" vi="Đánh giá của bạn" />
        </span>
      </div>
      <div className="rf-field rf-field-textarea">
        <textarea
          key={`body-${k}`}
          name="body"
          rows={6}
          maxLength={MAX_BODY_CHARS}
          required
          placeholder="What stood out? A moment, a person, a detail. Couples find these honest specifics most helpful."
          defaultValue={v?.body ?? ""}
          onChange={(e) => setBodyLen(e.target.value.length)}
        />
        <div className="rf-counter">
          {bodyLen} / {MAX_BODY_CHARS}
        </div>
        {fieldError("body") && <FieldError text={fieldError("body")!} />}
      </div>

      {/* 04 — couple details */}
      <div className="rf-step" style={{ marginTop: 32 }}>
        <span className="rf-step-num">04</span>
        <span className="rf-step-label">
          <T en="A bit about you" vi="Đôi chút về bạn" />
        </span>
      </div>
      <div className="rf-row">
        <div className="rf-field">
          <label htmlFor="coupleNames">
            <T en="Your name(s)" vi="Tên của bạn" />
          </label>
          <input
            key={`coupleNames-${k}`}
            id="coupleNames"
            name="coupleNames"
            type="text"
            placeholder="Linh & Thomas"
            defaultValue={v?.coupleNames ?? ""}
            required
          />
          {fieldError("coupleNames") && <FieldError text={fieldError("coupleNames")!} />}
        </div>
        <div className="rf-field">
          <label htmlFor="emailPrivate">
            <T en="Email (kept private)" vi="Email (giữ kín)" />
          </label>
          <input
            key={`emailPrivate-${k}`}
            id="emailPrivate"
            name="emailPrivate"
            type="email"
            placeholder="hello@example.com"
            defaultValue={v?.emailPrivate ?? ""}
            required
          />
          {fieldError("emailPrivate") && <FieldError text={fieldError("emailPrivate")!} />}
        </div>
      </div>
      <div className="rf-row">
        <div className="rf-field">
          <label htmlFor="weddingDate">
            <T en="Wedding date" vi="Ngày cưới" />
          </label>
          <input
            key={`weddingDate-${k}`}
            id="weddingDate"
            name="weddingDate"
            type="text"
            placeholder="August 2025"
            defaultValue={v?.weddingDate ?? ""}
          />
        </div>
        <div className="rf-field">
          <label htmlFor="city">
            <T en="City" vi="Thành phố" />
          </label>
          <input
            key={`city-${k}`}
            id="city"
            name="city"
            type="text"
            placeholder="Mississauga"
            defaultValue={v?.city ?? ""}
          />
        </div>
      </div>

      {/* 05 — photo upload */}
      <div className="rf-step" style={{ marginTop: 32 }}>
        <span className="rf-step-num">05</span>
        <span className="rf-step-label">
          <T en="Add a wedding photo (optional)" vi="Thêm ảnh cưới (tùy chọn)" />
        </span>
      </div>
      <label className={`rf-upload ${fileName ? "has-file" : ""}`}>
        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <div className="rf-upload-inner">
          <span className="rf-upload-icon" aria-hidden="true">
            +
          </span>
          <span className="rf-upload-text">
            {fileName ?? (
              <T en="Drop a photo here, or click to browse" vi="Thả ảnh vào đây, hoặc bấm để chọn" />
            )}
          </span>
          <span className="rf-upload-hint">
            <T en="JPG / PNG / WebP / HEIC · up to 10MB" vi="JPG / PNG / WebP / HEIC · tối đa 10MB" />
          </span>
        </div>
      </label>
      {fieldError("image") && <FieldError text={fieldError("image")!} />}

      {/* Consent */}
      <label className="rf-consent">
        <input type="checkbox" name="consentShare" defaultChecked={v?.consentShare ?? true} />
        <span>
          <T
            en="I'm happy for Mississauga Wedding Solutions to share my review on this site and social media. My email stays private."
            vi="Tôi đồng ý cho Mississauga Wedding Solutions chia sẻ đánh giá trên trang web và mạng xã hội. Email của tôi được giữ kín."
          />
        </span>
      </label>
      <label className="rf-consent" style={{ marginTop: 12 }}>
        <input type="checkbox" name="consentGallery" defaultChecked={v?.consentGallery ?? false} />
        <span>
          <T
            en="If I added a photo, you may feature it in the public gallery (with credit)."
            vi="Nếu tôi gửi kèm ảnh, bạn có thể đăng trong thư viện công khai (kèm tên)."
          />
        </span>
      </label>

      <Turnstile key={`turnstile-${k}`} />

      <button type="submit" className="btn btn-primary rf-submit" disabled={pending}>
        {pending ? (
          <T en="Sending…" vi="Đang gửi…" />
        ) : (
          <>
            <T en="Send our story" vi="Gửi câu chuyện" />
            <span className="arrow">→</span>
          </>
        )}
      </button>
    </form>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <span
      role="alert"
      style={{
        color: "var(--red)",
        fontSize: 12,
        marginTop: 4,
        fontFamily: "var(--sans)",
      }}
    >
      {text}
    </span>
  );
}
