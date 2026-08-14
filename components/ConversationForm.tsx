"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

const field: CSSProperties = { display: "grid", gap: 4 };

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
  padding: "4px 0 6px",
  fontSize: "clamp(1rem,1.2vw,1.15rem)",
  lineHeight: 1.4,
  letterSpacing: "0.004em",
  borderRadius: 0,
  transition: "border-bottom-color 150ms linear",
};

export default function ConversationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      concern: (form.elements.namedItem("concern") as HTMLTextAreaElement).value,
      decider: (form.elements.namedItem("decider") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
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

  if (status === "error") {
    return (
      <div style={{ maxWidth: "44ch" }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(1.5rem,2.4vw,2.05rem)",
            lineHeight: 1.26,
            letterSpacing: "-0.012em",
            color: "var(--ink)",
          }}
        >
          Something went wrong.
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
          Please email us directly at{" "}
          <a href="mailto:ben@binary1702.com" style={{ color: "var(--sig-text)" }}>
            ben@binary1702.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: 16,
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
          rows={3}
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

      <div style={{ marginTop: 12 }}>
        <button
          type="submit"
          disabled={status === "sending"}
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
            cursor: status === "sending" ? "wait" : "pointer",
            opacity: status === "sending" ? 0.6 : 1,
          }}
        >
          {status === "sending" ? "Sending..." : "Send this"}
        </button>
      </div>
    </form>
  );
}
