"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { useLang, T } from "./lang";
import { Turnstile } from "./turnstile";

const SERVICE_OPTIONS = [
  { en: "Hair & Makeup", vi: "Tóc & trang điểm" },
  { en: "Áo dài & Tea", vi: "Áo dài & lễ trà" },
  { en: "Trilingual MC", vi: "MC ba ngôn ngữ" },
  { en: "Catering & Cake", vi: "Tiệc & bánh" },
  { en: "Flowers & Decor", vi: "Hoa & trang trí" },
  { en: "Full package", vi: "Trọn gói" },
];

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const { lang } = useLang();
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="form-card" role="status" aria-live="polite">
        <h3 className="serif" style={{ fontSize: 28, marginBottom: 12 }}>
          <T en="Thank you." vi="Cảm ơn bạn." />
        </h3>
        <p>
          <T
            en="Your note is on its way to Juliane. Expect a reply within one business day — usually faster."
            vi="Lời nhắn đã được gửi đến Juliane. Bạn sẽ nhận được phản hồi trong vòng một ngày làm việc — thường nhanh hơn."
          />
        </p>
      </div>
    );
  }

  const fieldError = (key: string) => state.errors?.[key as keyof typeof state.errors];

  return (
    <form className="form-card" action={formAction} noValidate>
      {/* Honeypot — hidden from real users, visible only to dumb bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      {/* Carries the active language into the server action. */}
      <input type="hidden" name="language" value={lang} />

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

      <div className="form-row">
        <div className="field">
          <label htmlFor="name">
            <T en="Your name" vi="Họ tên" />
          </label>
          <input id="name" name="name" type="text" placeholder="Linh Nguyen" required />
          {fieldError("name") && <FieldError text={fieldError("name")!} />}
        </div>
        <div className="field">
          <label htmlFor="partner">
            <T en="Partner's name" vi="Tên người yêu" />
          </label>
          <input id="partner" name="partner" type="text" placeholder="Thomas Reilly" />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="email">
            <T en="Email" vi="Email" />
          </label>
          <input id="email" name="email" type="email" placeholder="hello@example.com" required />
          {fieldError("email") && <FieldError text={fieldError("email")!} />}
        </div>
        <div className="field">
          <label htmlFor="phone">
            <T en="Phone" vi="Điện thoại" />
          </label>
          <input id="phone" name="phone" type="tel" placeholder="(905) 555-0123" />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="event-date">
            <T en="Wedding date (or season)" vi="Ngày cưới (hoặc mùa)" />
          </label>
          <input id="event-date" name="event-date" type="text" placeholder="June 2026, or 'sometime next fall'" />
        </div>
        <div className="field">
          <label htmlFor="guests">
            <T en="Estimated guests" vi="Số khách dự kiến" />
          </label>
          <select id="guests" name="guests" defaultValue="">
            <option value="">—</option>
            <option>Under 50</option>
            <option>50 – 120</option>
            <option>120 – 200</option>
            <option>200+</option>
            <option>Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="form-row single">
        <div className="field">
          <label>
            <T en="Which services interest you?" vi="Bạn quan tâm đến dịch vụ nào?" />
          </label>
          <div className="check-row">
            {SERVICE_OPTIONS.map((s, i) => (
              <label key={i}>
                <input type="checkbox" name="services" value={s.en} />
                <span className="swatch" aria-hidden="true" />
                <span className="lab">
                  <T en={s.en} vi={s.vi} />
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row single">
        <div className="field">
          <label htmlFor="message">
            <T en="Tell us about your day" vi="Kể về ngày của bạn" />
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="What rituals matter most to you? Anything you're nervous about? We read every note."
            required
          />
          {fieldError("message") && <FieldError text={fieldError("message")!} />}
        </div>
      </div>

      <Turnstile />

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
        disabled={pending}
      >
        {pending ? (
          <T en="Sending…" vi="Đang gửi…" />
        ) : (
          <>
            <T en="Send to Juliane" vi="Gửi đến Juliane" />
            <span className="arrow">→</span>
          </>
        )}
      </button>

      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--ink-muted)",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        <T
          en="We reply within one business day. Your details stay with us."
          vi="Chúng tôi trả lời trong vòng một ngày làm việc. Thông tin của bạn được giữ kín."
        />
      </p>
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
