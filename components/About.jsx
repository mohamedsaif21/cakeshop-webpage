import { ABOUT_FEATURES } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container about-grid">
        <div className="about-media-box">
          <div className="about-frame">
            <img src="/assest/img/shafa desert.png" alt="Shafa's Dessert House Artisanal Bakery" loading="lazy" />
          </div>
          <div className="about-seal">
            <div className="seal-num">100%</div>
            <div className="seal-text">Home Baked Goodness</div>
          </div>
        </div>

        <div className="about-content">
          <span className="sub-tag"><i className="fas fa-cookie"></i> Our Heartfelt Story</span>
          <h2>Crafting Sweet Moments from Our Kitchen to Yours</h2>
          <p>
            <strong>Shafa&apos;s Dessert House</strong> was born from an unapologetic obsession with authentic,
            melt-in-the-mouth desserts. While commercial bakeries rely on premixes, artificial stabilizers, and mass
            production, we believe true dessert alchemy happens in small, lovingly crafted batches.
          </p>
          <p>
            Every brownie slab, crinkle top, and celebratory cake is baked fresh upon order in our dedicated home
            kitchen. We measure quality by the rich aroma of pure molten chocolate, the crackle of a warm crust, and the
            joyful smiles shared around the table.
          </p>

          <div className="about-highlights">
            {ABOUT_FEATURES.map((f) => (
              <div className="about-feature" key={f.title}>
                <i className={`fas ${f.icon} feature-icon`}></i>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#menu" className="btn-primary"><i className="fas fa-utensils"></i> Explore Our Creations</a>
        </div>
      </div>
    </section>
  );
}
