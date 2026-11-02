import { TRUST } from "@/lib/data";

export default function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container trust-grid">
        {TRUST.map((t) => (
          <div className="trust-card" key={t.title}>
            <div className="trust-icon-wrap"><i className={`fas ${t.icon}`}></i></div>
            <div>
              <h4>{t.title}</h4>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
