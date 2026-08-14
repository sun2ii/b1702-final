"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const serif = "'Playfair Display',Georgia,serif";

export default function NotFound() {
  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            letterSpacing: "0.3em",
            marginBottom: "2em",
            color: "var(--faint)",
          }}
        >
          110010100
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          This doesn't resolve.
        </h1>
        <p
          style={{
            margin: "1.5em 0 2.5em",
            fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
            color: "var(--graphite)",
            maxWidth: "32ch",
            lineHeight: 1.6,
          }}
        >
          Return to something that does.
        </p>
        <Link
          href="/"
          className="nav-link"
        >
          Home
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}
