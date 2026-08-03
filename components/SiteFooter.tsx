import Link from "next/link";

type FooterProps = {
  cta: { href: string; label: string };
  borderTop?: boolean;
};

const column: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

export default function SiteFooter({ cta, borderTop = false }: FooterProps) {
  return (
    <footer
      style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding:
          "calc(80px * var(--pace)) clamp(24px,5.5vw,96px) calc(64px * var(--pace))",
        ...(borderTop ? { borderTop: "1px solid var(--rule)" } : {}),
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
          gap: "clamp(16px,4vw,48px)",
        }}
      >
        <div />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "32px 40px",
          }}
        >
          <div style={column}>
            <a href="#" className="foot-link">Studio</a>
            <a href="#" className="foot-link">Engagements</a>
            <a href="#" className="foot-link">Understandings</a>
          </div>
          <div style={column}>
            <a href="#" className="foot-link">Labs</a>
            <a href="#" className="foot-link">Instruments</a>
          </div>
          <div style={column}>
            <a href="#" className="foot-link">Journal</a>
            <a href="#" className="foot-link">About</a>
          </div>
          <div style={{ ...column, gap: 14 }}>
            <Link href={cta.href} className="foot-cta">
              {cta.label}
            </Link>
            <p
              style={{
                margin: 0,
                maxWidth: "30ch",
                fontSize: 13,
                lineHeight: 1.68,
                color: "var(--faint)",
                textWrap: "pretty",
              }}
            >
              Binary1702 also builds its own products, under Labs. Client work
              comes first.
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "calc(96px * var(--pace))",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Binary1702
        </span>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--rule)",
          }}
        >
          MMXXVI
        </span>
      </div>
    </footer>
  );
}
