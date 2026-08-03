"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

const field: CSSProperties = { display: "grid", gap: 10 };

const fieldLabel: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--graphite)",
};

const fieldInput: CSSProperties = {
  background: "transparent",
  border: 0,
  borderBottom: "1px solid var(--rule)",
  padding: "10px 0 12px",
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.44,
  letterSpacing: "0.004em",
  borderRadius: 0,
  transition: "border-bottom-color 150ms linear",
};

export default function ConversationForm() {
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to a server action / email service. For now the form
    // only flips to the confirmation state, matching the template.
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ maxWidth: "44ch" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(1.5rem,2.4vw,2.05rem)",
            lineHeight: 1.26,
            letterSpacing: "-0.012em",
            color: "var(--sig)",
          }}
        >
          Thank you. We have it.
        </p>
        <p
          style={{
            margin: "1.6em 0 0",
            fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
            lineHeight: 1.72,
            letterSpacing: "0.004em",
            color: "var(--graphite)",
            textWrap: "pretty",
          }}
        >
          You&apos;ll hear from one of us within two working days. If it turns
          out we&apos;re the wrong people for this, we&apos;ll say so, and
          point you toward someone better.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: "calc(40px * var(--pace))",
        maxWidth: "46ch",
      }}
    >
      <label style={field}>
        <span style={fieldLabel}>Your name</span>
        <input type="text" name="name" required style={fieldInput} />
      </label>

      <label style={field}>
        <span style={fieldLabel}>Your business</span>
        <input type="text" name="business" style={fieldInput} />
      </label>

      <label style={field}>
        <span style={fieldLabel}>Email</span>
        <input type="email" name="email" required style={fieldInput} />
      </label>

      <label style={field}>
        <span style={fieldLabel}>What&apos;s happening</span>
        <textarea
          name="concern"
          rows={5}
          required
          style={{ ...fieldInput, lineHeight: 1.62, resize: "none" }}
        />
      </label>

      <label style={field}>
        <span style={fieldLabel}>
          Who else is part of the decision{" "}
          <span style={{ color: "var(--rule)" }}>— optional</span>
        </span>
        <input type="text" name="decider" style={fieldInput} />
      </label>

      <div style={{ marginTop: "calc(24px * var(--pace))" }}>
        <button
          type="submit"
          className="cta-link"
          style={{
            background: "transparent",
            border: 0,
            borderBottom: "1px solid var(--sig)",
            padding: "0 0 12px",
            fontFamily: "'Archivo Narrow',sans-serif",
            fontWeight: 500,
            fontSize: "clamp(1.1rem,1.4vw,1.3rem)",
            letterSpacing: "0.02em",
            cursor: "pointer",
          }}
        >
          Send this
        </button>
      </div>
    </form>
  );
}
