import { ABOUT_FEATURES, img } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="container about-grid">
        <div className="about-media-box">
          <div className="about-frame">
            <img src={img("The Best Brownies Ever.jpeg")} alt="Freshly baked fudgy brownies from Shafa's Dessert House" loading="lazy" />
          </div>
          <div className="about-seal">
            <img className="seal-mark" src="/assest/img/shafa desert.png" alt="" loading="lazy" />
            <div>
              <div className="seal-num">100%</div>
              <div className="seal-text">Home Baked Goodness</div>
            </div>
          </div>
        </div>

        <div className="about-content">
          <div className="section-header" data-index="01">
            <span className="sub-tag"><i className="fas fa-cookie" aria-hidden="true"></i> Our Heartfelt Story</span>
            <h2>Crafting Sweet Moments <em>from Our Kitchen to Yours</em></h2>
          </div>
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
                <i className={`fas ${f.icon} feature-icon`} aria-hidden="true"></i>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
