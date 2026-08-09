import Link from "next/link";

type FooterProps = {
  cta: { href: string; label: string };
};

export default function SiteFooter({ cta }: FooterProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
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
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 32,
            padding: "24px 0 30px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--rule)",
            }}
          >
            MMXXVI
          </span>
          <Link href={cta.href} className="foot-cta">
            {cta.label}
          </Link>
        </footer>
      </div>
    </div>
  );
}
