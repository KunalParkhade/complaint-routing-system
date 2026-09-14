export default function HomePage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
      <section style={{ maxWidth: 760 }}>
        <p style={{ fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", fontSize: 13 }}>CRS 2.0</p>
        <h1 style={{ fontSize: "clamp(42px, 7vw, 76px)", lineHeight: 1.02, margin: "16px 0" }}>
          Complaints routed to the right place.
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.6, color: "#475569" }}>
          Submit a complaint, let the system categorize and route it, track progress, and get a transparent resolution history.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <a href="/register" style={{ padding: "12px 18px", borderRadius: 10, background: "#0f172a", color: "white", fontWeight: 700 }}>Get started</a>
          <a href="/login" style={{ padding: "12px 18px", borderRadius: 10, border: "1px solid #cbd5e1", fontWeight: 700 }}>Sign in</a>
        </div>
      </section>
    </main>
  );
}
