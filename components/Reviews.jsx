import { REVIEWS } from "@/lib/data";

export default function Reviews() {
  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="section-header">
          <span className="sub-tag"><i className="fas fa-heart"></i> Genuine Words</span>
          <h2 className="section-title">Loved by Dessert Connoisseurs</h2>
          <p className="section-desc">
            Nothing speaks louder than the honest reviews of clients who trust us with their celebrations and everyday sweet cravings.
          </p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <div className="review-box" key={r.name}>
              <div className="quote-glyph">“</div>
              <div className="review-stars">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <p className="review-quote">&quot;{r.quote}&quot;</p>
              <div className="reviewer-meta">
                <div className="reviewer-initials">{r.initials}</div>
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="reviewer-sub">{r.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
