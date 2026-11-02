export default function Hero() {
  return (
    <header id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <div className="hero-pill">
            <i className="fas fa-certificate"></i> Small-Batch Artisanal Baking • Pre-Order Only
          </div>
          <h1>
            Handcrafted Indulgence, <br />
            <span className="accent-gradient">Baked With Passion.</span>
          </h1>
          <p>
            Welcome to <strong>Shafa&apos;s Dessert House</strong>. We bake ultra-fudgy brownies, golden blondies, and
            layered dream cakes using real butter, rich Belgian cocoa, and heartfelt home recipes. Zero preservatives,
            made fresh for your sweetest moments.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="btn-primary"><i className="fas fa-cookie-bite"></i> Explore Menu</a>
            <a href="#contact" className="btn-secondary"><i className="fab fa-whatsapp"></i> Order Now</a>
          </div>

          <div className="hero-proof">
            <div>
              <div className="proof-stars">
                {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
              </div>
              <div className="proof-text"><strong>4.9 / 5</strong> Loved by 500+ Dessert Enthusiasts</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-warm)", paddingLeft: "1.5rem" }}>
              <div className="proof-text" style={{ color: "var(--caramel)" }}><strong>100% Freshly Baked</strong></div>
              <div className="proof-text">Eggless &amp; Customization Options</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-badge-float badge-left">
            <div className="badge-icon"><i className="fas fa-heart"></i></div>
            <div>
              <div className="badge-title">Ultra Fudgy Texture</div>
              <div className="badge-subtitle">Crackly tops &amp; gooey centers</div>
            </div>
          </div>
          <div className="hero-badge-float badge-right">
            <div className="badge-icon"><i className="fas fa-award"></i></div>
            <div>
              <div className="badge-title">Pure Dairy Butter</div>
              <div className="badge-subtitle">Real cocoa &amp; no preservatives</div>
            </div>
          </div>
          <div className="hero-cake-card">
            <img src="/assest/img/hero page cake.png" alt="Shafa's Signature Artisanal Chocolate Cake" />
          </div>
        </div>
      </div>
    </header>
  );
}
