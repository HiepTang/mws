"use client";

import { useState } from "react";
import { T } from "./lang";

const SERVICE_OPTIONS = [
  { en: "Hair & Makeup", vi: "Tóc & trang điểm" },
  { en: "Áo dài & Tea", vi: "Áo dài & lễ trà" },
  { en: "Trilingual MC", vi: "MC ba ngôn ngữ" },
  { en: "Catering & Cake", vi: "Tiệc & bánh" },
  { en: "Flowers & Decor", vi: "Hoa & trang trí" },
  { en: "Full package", vi: "Trọn gói" },
];

export function ContactForm() {
  // Phase 4: form is wired to a stub handler. Phase 5 replaces this with a
  // real server action that POSTs to the contacts table + emails Juliane.
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
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

  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">
            <T en="Your name" vi="Họ tên" />
          </label>
          <input id="name" name="name" type="text" placeholder="Linh Nguyen" required />
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
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        <T en="Send to Juliane" vi="Gửi đến Juliane" />
        <span className="arrow">→</span>
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
