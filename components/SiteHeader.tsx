import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px,5.5vw,96px)",
        }}
      >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 32,
          padding: "30px 0 0",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Binary1702
        </Link>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(20px,3vw,44px)",
          }}
        >
          <a href="#" className="nav-link">Studio</a>
          <a href="#" className="nav-link">Labs</a>
          <a href="#" className="nav-link">Journal</a>
          <a href="#" className="nav-link">About</a>
          <ThemeToggle />
        </nav>
      </header>
      </div>
    </div>
  );
}
