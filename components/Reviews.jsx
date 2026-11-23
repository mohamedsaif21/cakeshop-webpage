import { REVIEWS } from "@/lib/data";

export default function Reviews() {
  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="section-header" data-index="05">
          <span className="sub-tag"><i className="fas fa-heart" aria-hidden="true"></i> Genuine Words</span>
          <h2 className="section-title">Loved by Dessert <em>Connoisseurs</em></h2>
          <p className="section-desc">
            Nothing speaks louder than the honest reviews of clients who trust us with their celebrations and everyday sweet cravings.
          </p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r) => (
            <figure className="review-box" key={r.name}>
              <div className="quote-glyph" aria-hidden="true">&ldquo;</div>
              <div className="review-stars">
                <span className="sr-only">Rated 5 out of 5</span>
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" aria-hidden="true"></i>)}
              </div>
              <blockquote className="review-quote">{r.quote}</blockquote>
              <figcaption className="reviewer-meta">
                <span className="reviewer-initials" aria-hidden="true">{r.initials}</span>
                <span>
                  <span className="reviewer-name">{r.name}</span>
                  <span className="reviewer-sub">{r.sub}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
