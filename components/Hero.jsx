export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <h1>
            Handcrafted Indulgence,
            <em>Baked With Passion.</em>
          </h1>
          <p>
            Welcome to <strong>Shafa&apos;s Dessert House</strong>. We bake ultra-fudgy brownies, golden blondies, and
            layered dream cakes using real butter, rich Belgian cocoa, and heartfelt home recipes. Zero preservatives,
            made fresh for your sweetest moments.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="btn-primary"><i className="fas fa-cookie-bite" aria-hidden="true"></i> Explore Menu</a>
            <a href="#contact" className="btn-secondary">Order Now</a>
          </div>

          <div className="hero-proof">
            <div>
              <div className="proof-stars">
                <span className="sr-only">Rated 4.9 out of 5</span>
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star" aria-hidden="true"></i>)}
              </div>
              <div className="proof-text"><strong>4.9 / 5</strong> &middot; Loved by 500+ Dessert Enthusiasts</div>
            </div>
            <span className="hero-proof-divider" aria-hidden="true"></span>
            <div>
              <div className="proof-text proof-highlight"><strong>100% Freshly Baked</strong></div>
              <div className="proof-text">Eggless &amp; Customization Options</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-cake-card">
            <img
              src="/assest/img/hero page cake.png"
              alt="Shafa's signature layered chocolate cake"
              fetchPriority="high"
            />
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <img src="/assest/img/shafa desert.png" alt="" />
          </div>
          <p className="hero-photo-caption">Signature bakes &middot; made to order</p>
        </div>
      </div>
    </section>
  );
}
