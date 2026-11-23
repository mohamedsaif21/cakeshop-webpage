import { TRUST } from "@/lib/data";

export default function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Why Shafa's">
      <div className="container">
        <ul className="trust-grid">
          {TRUST.map((t) => (
            <li className="trust-card" key={t.title}>
              <div className="trust-icon-wrap"><i className={`fas ${t.icon}`} aria-hidden="true"></i></div>
              <div>
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
